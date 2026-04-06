import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@/lib/storage";
import { LABEL_DOKUMEN } from "@/types";
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusDokumen } from "@prisma/client";

export const metadata: Metadata = {
  title: "Dokumen Saya — PMB STIE Anindyaguna",
};

const STATUS_DOKUMEN_CONFIG: Record<
  StatusDokumen,
  { label: string; icon: React.ElementType; className: string }
> = {
  MENUNGGU: {
    label: "Menunggu Verifikasi",
    icon: Clock,
    className: "text-yellow-700 bg-yellow-50 border-yellow-200",
  },
  VALID: {
    label: "Valid",
    icon: CheckCircle2,
    className: "text-green-700 bg-green-50 border-green-200",
  },
  DITOLAK: {
    label: "Ditolak",
    icon: XCircle,
    className: "text-red-700 bg-red-50 border-red-200",
  },
};

async function getDokumen(userId: string) {
  const pendaftar = await prisma.pendaftar.findUnique({
    where: { userId },
    include: { dokumen: { orderBy: { uploadedAt: "asc" } } },
  });
  return pendaftar;
}

export default async function DokumenPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const pendaftar = await getDokumen(session.user.id);

  if (!pendaftar) {
    redirect("/daftar");
  }

  // Generate signed URLs (best-effort, may be null if service key not set)
  const dokumenWithUrls = await Promise.all(
    pendaftar.dokumen.map(async (dok) => {
      const signedUrl = await getSignedUrl(dok.urlFile).catch(() => null);
      return { ...dok, signedUrl };
    })
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#1B4F72]">Dokumen Saya</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Dokumen yang telah Anda unggah saat pendaftaran.
        </p>
      </div>

      {dokumenWithUrls.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>Belum ada dokumen yang diunggah.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dokumenWithUrls.map((dok) => {
            const config = STATUS_DOKUMEN_CONFIG[dok.status];
            const Icon = config.icon;
            return (
              <div
                key={dok.id}
                className="rounded-xl bg-white border border-border shadow-sm p-4 flex items-start gap-3"
              >
                <FileText className="h-5 w-5 text-[#1B4F72] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{LABEL_DOKUMEN[dok.jenis]}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{dok.namaFile}</p>
                  <p className="text-xs text-muted-foreground">
                    {(dok.ukuranFile / 1024).toFixed(0)} KB ·{" "}
                    {new Date(dok.uploadedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {dok.catatan && dok.status === "DITOLAK" && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      Catatan: {dok.catatan}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium",
                      config.className
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </span>
                  {dok.signedUrl && (
                    <a
                      href={dok.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[#1B4F72] hover:underline"
                    >
                      Lihat <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center pt-2">
        Jika dokumen ditolak, hubungi panitia PMB untuk informasi lebih lanjut.
      </p>
    </div>
  );
}
