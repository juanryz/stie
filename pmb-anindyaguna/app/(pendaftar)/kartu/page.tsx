import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LABEL_JALUR, LABEL_STATUS } from "@/types";
import { formatTanggal } from "@/lib/utils";
import { PrintButton } from "./print-button";

export const metadata: Metadata = {
  title: "Kartu Pendaftaran — PMB STIE Anindyaguna",
};

async function getPendaftarFull(userId: string) {
  return prisma.pendaftar.findUnique({
    where: { userId },
    include: { prodi: true, periode: true },
  });
}

export default async function KartuPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const pendaftar = await getPendaftarFull(session.user.id);
  if (!pendaftar) redirect("/daftar");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-xl font-bold text-[#1B4F72]">Kartu Pendaftaran</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Simpan atau cetak kartu pendaftaran Anda.
          </p>
        </div>
        <PrintButton />
      </div>

      {/* Kartu — akan dicetak */}
      <div
        id="kartu-pendaftaran"
        className="bg-white rounded-xl border-2 border-[#1B4F72] shadow-sm overflow-hidden print:border print:shadow-none print:rounded-none"
      >
        {/* Header kartu */}
        <div className="bg-[#1B4F72] text-white px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/70 font-medium">
                Kartu Pendaftaran Mahasiswa Baru
              </p>
              <h2 className="text-xl font-bold mt-1">STIE Anindyaguna</h2>
              <p className="text-sm text-white/80">Semarang</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/70">No. Pendaftaran</p>
              <p className="font-mono font-bold text-lg tracking-wide">
                {pendaftar.noPendaftaran}
              </p>
            </div>
          </div>
        </div>

        {/* Status strip */}
        <div className="bg-[#EAF2F8] px-6 py-2 border-b border-[#1B4F72]/20 flex items-center justify-between">
          <span className="text-xs text-[#1B4F72] font-medium uppercase tracking-wide">
            Status
          </span>
          <span className="text-sm font-semibold text-[#1B4F72]">
            {LABEL_STATUS[pendaftar.status]}
          </span>
        </div>

        {/* Body kartu */}
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
          <KartuRow label="Nama Lengkap" value={pendaftar.nama} span />
          <KartuRow label="NIK" value={pendaftar.nik} />
          <KartuRow label="Jenis Kelamin" value={pendaftar.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"} />
          <KartuRow
            label="Tempat, Tgl Lahir"
            value={`${pendaftar.tempatLahir}, ${formatTanggal(pendaftar.tanggalLahir.toISOString())}`}
            span
          />
          <KartuRow label="Agama" value={pendaftar.agama} />
          <KartuRow label="No. HP" value={pendaftar.noHp} />
          <KartuRow label="Email" value={pendaftar.email} span />
          <KartuRow
            label="Alamat"
            value={`${pendaftar.alamat}, ${pendaftar.kota}, ${pendaftar.provinsi}${pendaftar.kodePos ? " " + pendaftar.kodePos : ""}`}
            span
          />

          <div className="col-span-full my-2 border-t border-dashed border-[#1B4F72]/20" />

          <KartuRow label="Program Studi" value={`${pendaftar.prodi.nama} (${pendaftar.prodi.jenjang})`} span />
          <KartuRow label="Jalur Masuk" value={LABEL_JALUR[pendaftar.jalurMasuk]} />
          <KartuRow label="Periode PMB" value={pendaftar.periode.nama} />

          <div className="col-span-full my-2 border-t border-dashed border-[#1B4F72]/20" />

          <KartuRow label="Sekolah Asal" value={pendaftar.asalSekolah} span />
          <KartuRow label="Jurusan" value={pendaftar.jurusanSekolah} />
          <KartuRow label="Tahun Lulus" value={String(pendaftar.tahunLulus)} />
          {pendaftar.nilaiRataRata !== null && (
            <KartuRow label="Nilai Rata-rata" value={String(pendaftar.nilaiRataRata)} />
          )}
        </div>

        {/* Footer kartu */}
        <div className="bg-[#EAF2F8] px-6 py-3 border-t border-[#1B4F72]/20 flex items-center justify-between text-xs text-[#1B4F72]/70">
          <span>
            Tanggal Daftar:{" "}
            {new Date(pendaftar.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>pmb.anindyaguna.ac.id</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center print:hidden">
        Kartu ini sebagai bukti pendaftaran. Harap disimpan dan dibawa saat proses seleksi.
      </p>
    </div>
  );
}

function KartuRow({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div className={cn("py-1.5", span ? "col-span-full sm:col-span-2" : "")}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
