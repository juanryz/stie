import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, Clock, FileText, CreditCard, AlertCircle, XCircle } from "lucide-react";
import { LABEL_STATUS, LABEL_JALUR, WARNA_STATUS } from "@/types";
import { formatTanggal } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StatusPMB } from "@prisma/client";

export const metadata: Metadata = {
  title: "Status Pendaftaran — PMB STIE Anindyaguna",
};

const STATUS_ICON: Record<StatusPMB, React.ElementType> = {
  MENUNGGU_VERIFIKASI: Clock,
  DOKUMEN_TIDAK_LENGKAP: AlertCircle,
  TERVERIFIKASI: CheckCircle2,
  TERDAFTAR_TES: CheckCircle2,
  LULUS_TES: CheckCircle2,
  TIDAK_LULUS_TES: XCircle,
  DITERIMA: CheckCircle2,
  DITOLAK: XCircle,
  DAFTAR_ULANG: CheckCircle2,
  MENGUNDURKAN_DIRI: XCircle,
};

async function getPendaftar(userId: string) {
  return prisma.pendaftar.findUnique({
    where: { userId },
    include: {
      prodi: true,
      periode: true,
      riwayatStatus: { orderBy: { createdAt: "asc" } },
      dokumen: { orderBy: { uploadedAt: "asc" } },
    },
  });
}

export default async function StatusPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const pendaftar = await getPendaftar(session.user.id);

  if (!pendaftar) {
    return (
      <div className="text-center py-16 space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-semibold">Belum Ada Pendaftaran</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Anda belum mengisi formulir pendaftaran. Mulai pendaftaran sekarang.
        </p>
        <Link href="/daftar">
          <Button className="bg-[#1B4F72] hover:bg-[#154060] mt-2">
            Isi Formulir Pendaftaran
          </Button>
        </Link>
      </div>
    );
  }

  const Icon = STATUS_ICON[pendaftar.status];
  const warnaClass = WARNA_STATUS[pendaftar.status];
  const dokumenValid = pendaftar.dokumen.filter((d) => d.status === "VALID").length;
  const dokumenTotal = pendaftar.dokumen.length;

  return (
    <div className="space-y-6">
      {/* Header status */}
      <div className="rounded-xl bg-white border border-border p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              No. Pendaftaran
            </p>
            <p className="text-2xl font-bold text-[#1B4F72] mt-0.5 font-mono tracking-wide">
              {pendaftar.noPendaftaran}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {pendaftar.prodi.nama} ({pendaftar.prodi.jenjang}) ·{" "}
              {LABEL_JALUR[pendaftar.jalurMasuk]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold", warnaClass)}>
              <Icon className="h-4 w-4" />
              {LABEL_STATUS[pendaftar.status]}
            </span>
          </div>
        </div>

        {pendaftar.status === "DOKUMEN_TIDAK_LENGKAP" && pendaftar.catatanVerifikasi && (
          <div className="mt-4 rounded-lg bg-orange-50 border border-orange-200 p-3 text-sm text-orange-800">
            <strong>Catatan Panitia:</strong> {pendaftar.catatanVerifikasi}
          </div>
        )}

        {pendaftar.status === "DITOLAK" && pendaftar.catatanVerifikasi && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            <strong>Alasan Penolakan:</strong> {pendaftar.catatanVerifikasi}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dokumen">
          <div className="rounded-xl border border-border bg-white p-4 hover:border-[#1B4F72]/40 hover:bg-[#1B4F72]/5 transition-colors cursor-pointer group">
            <FileText className="h-5 w-5 text-[#1B4F72] mb-2" />
            <p className="font-medium text-sm">Dokumen Saya</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dokumenValid}/{dokumenTotal} dokumen valid
            </p>
          </div>
        </Link>
        <Link href="/kartu">
          <div className="rounded-xl border border-border bg-white p-4 hover:border-[#1B4F72]/40 hover:bg-[#1B4F72]/5 transition-colors cursor-pointer group">
            <CreditCard className="h-5 w-5 text-[#1B4F72] mb-2" />
            <p className="font-medium text-sm">Kartu Pendaftaran</p>
            <p className="text-xs text-muted-foreground mt-0.5">Lihat & cetak kartu</p>
          </div>
        </Link>
      </div>

      {/* Data ringkasan */}
      <div className="rounded-xl bg-white border border-border shadow-sm overflow-hidden">
        <div className="bg-muted/40 px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-[#1B4F72]">Informasi Pendaftaran</p>
        </div>
        <div className="divide-y divide-border">
          <InfoRow label="Nama Lengkap" value={pendaftar.nama} />
          <InfoRow label="NIK" value={pendaftar.nik} />
          <InfoRow
            label="Tanggal Lahir"
            value={`${pendaftar.tempatLahir}, ${formatTanggal(pendaftar.tanggalLahir.toISOString())}`}
          />
          <InfoRow label="Program Studi" value={`${pendaftar.prodi.nama} (${pendaftar.prodi.jenjang})`} />
          <InfoRow label="Jalur Masuk" value={LABEL_JALUR[pendaftar.jalurMasuk]} />
          <InfoRow label="Periode" value={pendaftar.periode.nama} />
          <InfoRow
            label="Tanggal Daftar"
            value={formatTanggal(pendaftar.createdAt.toISOString())}
          />
        </div>
      </div>

      {/* Timeline riwayat status */}
      {pendaftar.riwayatStatus.length > 0 && (
        <div className="rounded-xl bg-white border border-border shadow-sm overflow-hidden">
          <div className="bg-muted/40 px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-[#1B4F72]">Riwayat Status</p>
          </div>
          <div className="px-4 py-3">
            <div className="relative space-y-4">
              {pendaftar.riwayatStatus.map((r, i) => {
                const isLast = i === pendaftar.riwayatStatus.length - 1;
                return (
                  <div key={r.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full mt-0.5 shrink-0",
                          isLast ? "bg-[#1B4F72]" : "bg-muted-foreground/30"
                        )}
                      />
                      {!isLast && <div className="w-px flex-1 bg-muted-foreground/20 my-1" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-medium">{LABEL_STATUS[r.statusBaru]}</p>
                      {r.catatan && (
                        <p className="text-xs text-muted-foreground mt-0.5">{r.catatan}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start px-4 py-2.5 text-sm gap-4">
      <span className="text-muted-foreground w-36 shrink-0">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
