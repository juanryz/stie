import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LABEL_STATUS, LABEL_JALUR, LABEL_DOKUMEN, WARNA_STATUS } from "@/types";
import { getSignedUrl } from "@/lib/supabase";
import { formatTanggal } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ArrowLeft, ExternalLink, CheckCircle2, Clock, XCircle } from "lucide-react";
import { VerifikasiActions } from "./verifikasi-actions";
import type { StatusDokumen } from "@prisma/client";

export const metadata: Metadata = {
  title: "Detail Pendaftar — PMB STIE Anindyaguna",
};

const STATUS_DOK_CONFIG: Record<StatusDokumen, { label: string; className: string; icon: React.ElementType }> = {
  MENUNGGU: { label: "Menunggu", className: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: Clock },
  VALID: { label: "Valid", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
  DITOLAK: { label: "Ditolak", className: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
};

async function getPendaftar(id: string) {
  return prisma.pendaftar.findUnique({
    where: { id },
    include: {
      prodi: true,
      periode: true,
      dokumen: { orderBy: { uploadedAt: "asc" } },
      riwayatStatus: { orderBy: { createdAt: "asc" } },
      user: { select: { email: true } },
    },
  });
}

export default async function PendaftarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pendaftar = await getPendaftar(id);
  if (!pendaftar) notFound();

  const dokumenWithUrls = await Promise.all(
    pendaftar.dokumen.map(async (dok) => ({
      ...dok,
      signedUrl: await getSignedUrl(dok.urlFile).catch(() => null),
    }))
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back + header */}
      <div>
        <Link href="/pendaftar" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">No. Pendaftaran</p>
            <p className="font-mono font-bold text-xl text-[#1B4F72] mt-0.5">{pendaftar.noPendaftaran}</p>
          </div>
          <span
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
              WARNA_STATUS[pendaftar.status]
            )}
          >
            {LABEL_STATUS[pendaftar.status]}
          </span>
        </div>
      </div>

      {/* Aksi Verifikasi */}
      <VerifikasiActions pendaftarId={pendaftar.id} currentStatus={pendaftar.status} />

      {/* Data Pribadi */}
      <Section title="Data Pribadi">
        <Row label="Nama Lengkap" value={pendaftar.nama} />
        <Row label="NIK" value={pendaftar.nik} />
        <Row label="Jenis Kelamin" value={pendaftar.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"} />
        <Row label="Tempat, Tgl Lahir" value={`${pendaftar.tempatLahir}, ${formatTanggal(pendaftar.tanggalLahir.toISOString())}`} />
        <Row label="Agama" value={pendaftar.agama} />
        <Row label="Alamat" value={`${pendaftar.alamat}, ${pendaftar.kota}, ${pendaftar.provinsi}${pendaftar.kodePos ? " " + pendaftar.kodePos : ""}`} />
        <Row label="No. HP" value={pendaftar.noHp} />
        <Row label="Email" value={pendaftar.user.email ?? pendaftar.email} />
      </Section>

      {/* Data Pendidikan */}
      <Section title="Data Pendidikan">
        <Row label="Sekolah Asal" value={pendaftar.asalSekolah} />
        <Row label="Jurusan" value={pendaftar.jurusanSekolah} />
        <Row label="Tahun Lulus" value={String(pendaftar.tahunLulus)} />
        {pendaftar.nilaiRataRata !== null && (
          <Row label="Nilai Rata-rata" value={String(pendaftar.nilaiRataRata)} />
        )}
      </Section>

      {/* Data Orang Tua */}
      {(pendaftar.namaAyah || pendaftar.namaIbu) && (
        <Section title="Data Orang Tua">
          {pendaftar.namaAyah && <Row label="Nama Ayah" value={pendaftar.namaAyah} />}
          {pendaftar.namaIbu && <Row label="Nama Ibu" value={pendaftar.namaIbu} />}
          {pendaftar.pekerjaanOrtu && <Row label="Pekerjaan" value={pendaftar.pekerjaanOrtu} />}
          {pendaftar.noHpOrtu && <Row label="No. HP Ortu" value={pendaftar.noHpOrtu} />}
        </Section>
      )}

      {/* Program */}
      <Section title="Pilihan Program">
        <Row label="Program Studi" value={`${pendaftar.prodi.nama} (${pendaftar.prodi.jenjang})`} />
        <Row label="Jalur Masuk" value={LABEL_JALUR[pendaftar.jalurMasuk]} />
        <Row label="Periode" value={pendaftar.periode.nama} />
      </Section>

      {/* Dokumen */}
      <Section title="Dokumen">
        <div className="space-y-2 pt-1">
          {dokumenWithUrls.map((dok) => {
            const cfg = STATUS_DOK_CONFIG[dok.status];
            const Icon = cfg.icon;
            return (
              <div key={dok.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium">{LABEL_DOKUMEN[dok.jenis]}</p>
                  <p className="text-xs text-muted-foreground">{dok.namaFile}</p>
                  {dok.catatan && dok.status === "DITOLAK" && (
                    <p className="text-xs text-red-600 mt-0.5">Catatan: {dok.catatan}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium", cfg.className)}>
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                  {dok.signedUrl && (
                    <a href={dok.signedUrl} target="_blank" rel="noopener noreferrer"
                      className="text-[#1B4F72] hover:text-[#154060]">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Riwayat Status */}
      <Section title="Riwayat Status">
        <div className="space-y-3 pt-1">
          {pendaftar.riwayatStatus.map((r, i) => (
            <div key={r.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={cn("h-2.5 w-2.5 rounded-full mt-1 shrink-0",
                  i === pendaftar.riwayatStatus.length - 1 ? "bg-[#1B4F72]" : "bg-muted-foreground/30"
                )} />
                {i < pendaftar.riwayatStatus.length - 1 && (
                  <div className="w-px flex-1 bg-muted-foreground/20 my-1" />
                )}
              </div>
              <div className="pb-1">
                <p className="text-sm font-medium">{LABEL_STATUS[r.statusBaru]}</p>
                {r.catatan && <p className="text-xs text-muted-foreground">{r.catatan}</p>}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(r.createdAt).toLocaleString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-border shadow-sm overflow-hidden">
      <div className="bg-muted/30 px-4 py-2.5 border-b border-border">
        <p className="text-sm font-semibold text-[#1B4F72]">{title}</p>
      </div>
      <div className="px-4 py-3 divide-y divide-border">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start py-2 gap-4 text-sm">
      <span className="text-muted-foreground w-36 shrink-0">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
