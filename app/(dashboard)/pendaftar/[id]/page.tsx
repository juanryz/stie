import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LABEL_STATUS, LABEL_JALUR, LABEL_DOKUMEN, WARNA_STATUS } from "@/types";
import { getSignedUrl } from "@/lib/storage";
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
      <div className="mb-8">
        <Link href="/dashboard/pendaftar" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[#D2CEBE] hover:text-white transition-all text-xs font-bold tracking-widest uppercase mb-6">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[10px] text-[#6A685F] font-bold uppercase tracking-widest mb-1.5">No. Pendaftaran</p>
            <p className="font-mono font-bold text-2xl text-white tracking-tighter">{pendaftar.noPendaftaran}</p>
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
      {/* Dokumen */}
      <Section title="Dokumen Unggahan">
        <div className="space-y-3 pt-2">
          {dokumenWithUrls.map((dok) => {
            const cfg = STATUS_DOK_CONFIG[dok.status];
            const Icon = cfg.icon;
            return (
              <div key={dok.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4 hover:border-white/10 transition-colors">
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">{LABEL_DOKUMEN[dok.jenis]}</p>
                  <p className="text-xs font-mono text-[#D2CEBE] truncate max-w-[200px]">{dok.namaFile}</p>
                  {dok.catatan && dok.status === "DITOLAK" && (
                    <p className="text-[10px] font-bold text-red-400 mt-1.5 bg-red-400/10 px-2 py-1 rounded inline-block">Catatan: {dok.catatan}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest", dok.status === "VALID" ? "bg-green-500/10 text-green-400" : dok.status === "DITOLAK" ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500")}>
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                  {dok.signedUrl && (
                    <a href={dok.signedUrl} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#EAC956] hover:bg-[#EAC956] hover:text-[#3A2E00] transition-colors border border-white/10">
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
      <Section title="Riwayat Log Konfirmasi">
        <div className="space-y-0 relative py-2">
          {pendaftar.riwayatStatus.map((r, i) => (
            <div key={r.id} className="flex gap-4 relative">
              <div className="flex flex-col items-center">
                <div className={cn("h-3 w-3 rounded-full mt-1 shrink-0 relative z-10 shadow-lg",
                  i === pendaftar.riwayatStatus.length - 1 ? "bg-[#EAC956] ring-4 ring-[#EAC956]/20" : "bg-[#2D2A26] border border-[#6A685F]"
                )} />
                {i < pendaftar.riwayatStatus.length - 1 && (
                  <div className="w-px h-full bg-[#2D2A26] absolute top-4 bottom-0 left-[5.5px]" />
                )}
              </div>
              <div className="pb-8">
                <p className="text-sm font-bold text-white mb-0.5">{LABEL_STATUS[r.statusBaru]}</p>
                {r.catatan && <p className="text-xs text-[#D2CEBE] italic">"{r.catatan}"</p>}
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6A685F] mt-1.5">
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
    <div className="rounded-2xl border-2 border-[#2D2A26] bg-black/20 overflow-hidden group hover:border-[#EAC956]/40 transition-colors">
      <div className="bg-[#EAC956]/5 px-6 py-4 border-b border-[#2D2A26] group-hover:bg-[#EAC956]/10 transition-colors">
        <p className="text-[10px] font-bold text-[#EAC956] tracking-widest uppercase">{title}</p>
      </div>
      <div className="px-6 py-4 flex flex-col gap-0">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start py-3 border-b border-white/5 last:border-0 last:pb-0 text-sm gap-4">
      <span className="text-[#6A685F] text-xs font-bold uppercase tracking-widest w-40 shrink-0 mt-0.5">{label}</span>
      <span className="font-light text-[#F8F6F1] break-all text-lg leading-tight">{value}</span>
    </div>
  );
}
