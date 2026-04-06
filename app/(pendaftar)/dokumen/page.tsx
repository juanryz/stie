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
  FileSearch,
  Download,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StatusDokumen } from "@prisma/client";
import { ReuploadButton } from "./reupload-button";

export const metadata: Metadata = {
  title: "Dokumen Saya — PMB STIE Anindyaguna",
};

const STATUS_CONFIG: Record<
  StatusDokumen,
  { label: string; icon: React.ElementType; color: string; border: string; bg: string }
> = {
  MENUNGGU: {
    label: "Verifikasi Pending",
    icon: Clock,
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
  },
  VALID: {
    label: "Dokumen Valid",
    icon: CheckCircle2,
    color: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/10",
  },
  DITOLAK: {
    label: "Revisi Dibutuhkan",
    icon: XCircle,
    color: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/10",
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

  if (!pendaftar) redirect("/daftar");

  const dokumenWithUrls = await Promise.all(
    pendaftar.dokumen.map(async (dok) => {
      const signedUrl = await getSignedUrl(dok.urlFile).catch(() => null);
      return { ...dok, signedUrl };
    })
  );

  return (
    <div className="max-w-5xl mx-auto pb-32">
       {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#2D2A26] pb-10">
        <div>
          <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#EAC956]/20 ring-1 ring-[#EAC956]/10">
            <FileText className="w-4 h-4" />
            Archive Berkas
          </div>
          <h1 className="text-5xl text-white font-normal tracking-tight">Dokumen Saya</h1>
          <p className="text-[#D2CEBE] font-light mt-2 italic">Daftar berkas persyaratan yang telah Anda unggah ke sistem.</p>
        </div>
      </div>

      {dokumenWithUrls.length === 0 ? (
        <div className="bg-[#1C1A17] border border-dashed border-[#2D2A26] rounded-[48px] p-24 text-center">
          <FileSearch className="h-16 w-16 text-[#6A685F] mx-auto mb-6 opacity-30" />
          <p className="text-[#D2CEBE] font-light text-xl">Belum ada dokumen yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dokumenWithUrls.map((dok) => {
            const config = STATUS_CONFIG[dok.status];
            const Icon = config.icon;
            return (
              <div
                key={dok.id}
                className="group relative bg-[#1C1A17] border border-[#2D2A26] rounded-[48px] p-10 hover:bg-[#2B2A23] transition-all overflow-hidden"
              >
                {/* Decorative Icon Background */}
                <div className="absolute top-10 right-10 opacity-[0.03] scale-[4] pointer-events-none group-hover:scale-[5] group-hover:rotate-12 transition-transform duration-700">
                   <FileText className="text-white" />
                </div>

                <div className="flex flex-col h-full relative z-10">
                   <div className="flex items-center justify-between mb-8">
                      <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border", config.bg, config.color, config.border)}>
                         <Icon className="w-3.5 h-3.5" />
                         {config.label}
                      </div>
                      <span className="text-[10px] font-bold text-[#6A685F] uppercase tracking-tighter">
                         {(dok.ukuranFile / 1024).toFixed(0)} KB
                      </span>
                   </div>

                   <h3 className="text-2xl text-white font-normal mb-1 tracking-tight group-hover:text-[#EAC956] transition-colors">
                      {LABEL_DOKUMEN[dok.jenis]}
                   </h3>
                   <p className="text-xs text-[#6A685F] mb-10 font-mono truncate">{dok.namaFile}</p>

                   {dok.catatan && dok.status === "DITOLAK" && (
                     <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-200/70 leading-relaxed font-light">
                           <strong>Alasan Penolakan:</strong> {dok.catatan}
                        </p>
                     </div>
                   )}

                   <div className="mt-auto flex items-center justify-between pt-8 border-t border-[#2D2A26]">
                      <span className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest">
                         Uploaded {new Date(dok.uploadedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                      </span>
                      
                      <div className="flex gap-3">
                         {dok.status !== "VALID" && (
                           <ReuploadButton dokumenId={dok.id} jenis={dok.jenis} />
                         )}
                         {dok.signedUrl && (
                           <a
                             href={dok.signedUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                           >
                              <Button variant="ghost" className="text-[#EAC956] hover:bg-[#EAC956] hover:text-[#3A2E00] rounded-xl h-10 px-4 flex items-center gap-2 group/btn transition-all">
                                 Lihat Berkas <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                              </Button>
                           </a>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-16 bg-[#2B2A23]/30 border border-[#2D2A26] rounded-[40px] p-8 flex items-center gap-6">
         <div className="w-12 h-12 bg-[#EAC956]/10 rounded-2xl flex items-center justify-center text-[#EAC956]">
            <Info className="w-6 h-6" />
         </div>
         <p className="text-sm text-[#D2CEBE] font-light leading-relaxed">
            Jika terdapat kesalahan pada dokumen atau status pendaftaran Anda, silakan hubungi tim Helpdesk PMB STIE Anindyaguna melalui WhatsApp resmi untuk bantuan verifikasi ulang.
         </p>
      </div>
    </div>
  );
}
