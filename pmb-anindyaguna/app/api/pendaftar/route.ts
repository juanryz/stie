import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/supabase";
import { submitPendaftaranSchema } from "@/lib/validations/pendaftaran";
import { sendKonfirmasiPendaftaran } from "@/lib/email";
import type { JenisDokumen } from "@prisma/client";

const FILE_KEY_TO_JENIS: Record<string, JenisDokumen> = {
  foto: "FOTO",
  ktp: "KTP",
  kartuKeluarga: "KARTU_KELUARGA",
  ijazahAtauSkl: "IJAZAH_ATAU_SKL",
  transkripNilai: "TRANSKRIP_NILAI",
  sertifikatPrestasi: "SERTIFIKAT_PRESTASI",
};

const REQUIRED_KEYS = ["foto", "ktp", "kartuKeluarga", "ijazahAtauSkl", "transkripNilai"];

export async function POST(req: NextRequest) {
  // 1. Cek session — hanya PENDAFTAR yang boleh submit
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Anda harus login terlebih dahulu." }, { status: 401 });
  }
  if (session.user.role !== "PENDAFTAR") {
    return NextResponse.json({ error: "Hanya pendaftar yang dapat mengisi formulir." }, { status: 403 });
  }

  const userId = session.user.id;

  // 2. Parse FormData
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Format request tidak valid." }, { status: 400 });
  }

  // 3. Parse + validasi JSON data
  const dataRaw = formData.get("data");
  if (typeof dataRaw !== "string") {
    return NextResponse.json({ error: "Data formulir tidak ditemukan." }, { status: 400 });
  }

  let parsed: ReturnType<typeof submitPendaftaranSchema.safeParse>;
  try {
    parsed = submitPendaftaranSchema.safeParse(JSON.parse(dataRaw));
  } catch {
    return NextResponse.json({ error: "Format data tidak valid." }, { status: 400 });
  }

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const data = parsed.data;

  // 4. Cek pendaftaran duplikat
  const existing = await prisma.pendaftar.findUnique({ where: { userId } });
  if (existing) {
    return NextResponse.json(
      { error: "Anda sudah memiliki pendaftaran. Cek halaman status." },
      { status: 409 }
    );
  }

  // 5. Cek periode PMB aktif
  const periode = await prisma.periodePMB.findFirst({ where: { aktif: true } });
  if (!periode) {
    return NextResponse.json(
      { error: "Tidak ada periode PMB aktif saat ini. Hubungi panitia." },
      { status: 400 }
    );
  }

  // 6. Validasi program studi
  const prodi = await prisma.programStudi.findFirst({
    where: { id: data.prodiId, aktif: true },
  });
  if (!prodi) {
    return NextResponse.json({ error: "Program studi tidak valid atau tidak aktif." }, { status: 400 });
  }

  // 7. Kumpulkan file dari FormData
  const fileEntries: Array<{
    key: string;
    file: File;
    jenis: JenisDokumen;
  }> = [];

  for (const [key, jenis] of Object.entries(FILE_KEY_TO_JENIS)) {
    const f = formData.get(key);
    if (f instanceof File && f.size > 0) {
      fileEntries.push({ key, file: f, jenis });
    }
  }

  // Validasi dokumen wajib
  const uploadedKeys = new Set(fileEntries.map((e) => e.key));
  const missing = REQUIRED_KEYS.filter((k) => !uploadedKeys.has(k));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Dokumen wajib belum lengkap: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // 8. Upload file ke Supabase Storage
  const uploadedDocs: Array<{
    jenis: JenisDokumen;
    namaFile: string;
    urlFile: string;
    ukuranFile: number;
  }> = [];

  for (const { key, file, jenis } of fileEntries) {
    const ext = file.name.split(".").pop() ?? "bin";
    const filePath = `${userId}/${jenis}/${Date.now()}-${key}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await uploadFile(buffer, filePath, file.type);
    } catch (err) {
      console.error("Upload gagal:", err);
      return NextResponse.json(
        { error: `Gagal mengupload ${key}. Coba lagi.` },
        { status: 500 }
      );
    }

    uploadedDocs.push({
      jenis,
      namaFile: file.name,
      urlFile: filePath,
      ukuranFile: file.size,
    });
  }

  // 9. Buat Pendaftar + generate noPendaftaran dalam transaksi
  try {
    const pendaftar = await prisma.$transaction(async (tx) => {
      const count = await tx.pendaftar.count({ where: { periodeId: periode.id } });
      const seq = String(count + 1).padStart(4, "0");
      const year = new Date().getFullYear();
      const noPendaftaran = `ANINDYA-${year}-${prodi.kode}-${seq}`;

      return tx.pendaftar.create({
        data: {
          noPendaftaran,
          userId,
          periodeId: periode.id,
          prodiId: data.prodiId,
          jalurMasuk: data.jalurMasuk,
          // Data Pribadi
          nama: data.nama,
          nik: data.nik,
          tempatLahir: data.tempatLahir,
          tanggalLahir: new Date(data.tanggalLahir),
          jenisKelamin: data.jenisKelamin,
          agama: data.agama,
          alamat: data.alamat,
          kota: data.kota,
          provinsi: data.provinsi,
          kodePos: data.kodePos || null,
          noHp: data.noHp,
          email: data.email,
          // Data Pendidikan
          asalSekolah: data.asalSekolah,
          jurusanSekolah: data.jurusanSekolah,
          tahunLulus: data.tahunLulus,
          nilaiRataRata: data.nilaiRataRata ?? null,
          // Data Orang Tua
          namaAyah: data.namaAyah || null,
          namaIbu: data.namaIbu || null,
          pekerjaanOrtu: data.pekerjaanOrtu || null,
          noHpOrtu: data.noHpOrtu || null,
          // Relasi
          dokumen: { create: uploadedDocs },
          riwayatStatus: {
            create: {
              statusBaru: "MENUNGGU_VERIFIKASI",
              catatan: "Pendaftaran baru dikirim oleh pendaftar.",
              diubahOleh: userId,
            },
          },
        },
      });
    });

    // Kirim email konfirmasi (non-blocking, jangan gagalkan response)
    sendKonfirmasiPendaftaran({
      to: data.email,
      nama: data.nama,
      noPendaftaran: pendaftar.noPendaftaran,
      namaProdi: prodi.nama,
      jenjang: prodi.jenjang,
      jalurMasuk: data.jalurMasuk,
      periode: periode.nama,
    }).catch((err) => console.error("[email] Konfirmasi gagal:", err));

    return NextResponse.json({ noPendaftaran: pendaftar.noPendaftaran }, { status: 201 });
  } catch (err) {
    console.error("Gagal menyimpan pendaftaran:", err);
    // NIK duplikat
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "P2002") {
      return NextResponse.json(
        { error: "NIK sudah terdaftar dalam sistem." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Gagal menyimpan pendaftaran. Coba lagi." },
      { status: 500 }
    );
  }
}
