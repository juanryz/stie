import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LABEL_JALUR, LABEL_STATUS } from "@/types";
import { formatTanggal } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ShieldCheck, ArrowRight, FileCheck2, Clock, AlertCircle, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Verifikasi — PMB STIE Anindyaguna",
};

async function getAntrian() {
  return prisma.pendaftar.findMany({
    where: {
      status: { in: ["MENUNGGU_VERIFIKASI", "DOKUMEN_TIDAK_LENGKAP"] },
    },
    include: {
      prodi: { select: { kode: true, nama: true } },
      dokumen: { select: { id: true, status: true } },
    },
    orderBy: { createdAt: "asc" }, // FIFO
  });
}

export default async function VerifikasiPage() {
  const antrian = await getAntrian();

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-[1400px] mx-auto min-h-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
           <div className="flex items-center gap-3 mb-4 text-[#EAC956]">
             <ShieldCheck className="w-8 h-8" />
             <span className="text-sm font-bold tracking-[0.2em] uppercase">Queue</span>
           </div>
           <h1 className="text-5xl text-white font-normal tracking-tight mb-2">Antrian Verifikasi</h1>
           <p className="text-[#D2CEBE] font-light">
             Terdapat <span className="font-bold text-[#EAC956]">{antrian.length}</span> pendaftar yang perlu divalidasi dokumennya.
           </p>
        </div>
        
        {/* REFRESH STATUS (Optional) */}
        <div className="bg-[#2B2A23] p-4 rounded-3xl border border-[#2D2A26] flex items-center gap-4 text-xs font-bold text-[#D2CEBE] tracking-widest uppercase">
           <div className="w-2 h-2 rounded-full bg-[#EAC956] animate-pulse" />
           Sistem Real-Time
        </div>
      </div>

      {antrian.length === 0 ? (
        <div className="rounded-[40px] bg-[#1C1A17] border border-[#2D2A26] border-dashed p-24 text-center">
           <FileCheck2 className="w-16 h-16 text-[#2D2A26] mx-auto mb-6" />
           <h3 className="text-2xl text-white font-normal mb-2">Antrian Kosong</h3>
           <p className="text-[#6A685F] font-light max-w-sm mx-auto leading-relaxed">
             Semua pendaftar telah berhasil diverifikasi. Antrian akan muncul secara otomatis saat ada pendaftaran baru.
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {antrian.map((p, idx) => {
            const dokTotal = p.dokumen.length;
            const dokValid = p.dokumen.filter((d) => d.status === "VALID").length;
            const isLengkap = p.status === "DOKUMEN_TIDAK_LENGKAP";

            return (
              <Link key={p.id} href={`/pendaftar/${p.id}`} className="block group">
                <div className="rounded-[40px] bg-[#1C1A17] border border-[#2D2A26] p-8 lg:p-10 hover:bg-[#2B2A23] hover:border-[#EAC956]/40 transition-all shadow-2xl relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAC956]/2 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#EAC956]/10 transition-colors" />

                  <div className="flex items-start justify-between mb-8 relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-black/40 rounded-lg border border-white/5 font-mono text-[10px] font-bold text-[#EAC956] tracking-widest">
                           #{p.noPendaftaran}
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border",
                          isLengkap 
                           ? "bg-orange-500/10 text-orange-500 border-orange-500/20" 
                           : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        )}>
                           {isLengkap ? "Lengkapi Data" : "Verifikasi"}
                        </span>
                     </div>
                     <div className="flex items-center gap-2 text-[#6A685F]">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Queue Pos: {idx + 1}</span>
                     </div>
                  </div>

                  <div className="flex-1 mb-8 relative z-10">
                    <h3 className="text-3xl text-white font-normal group-hover:text-[#EAC956] transition-colors mb-3 leading-tight tracking-tight">{p.nama}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-light text-[#D2CEBE]">
                       <div className="flex items-center gap-2">
                          <AlertCircle className="w-3 h-3 text-[#EAC956]" />
                          {p.prodi.nama}
                       </div>
                       <div className="w-1 h-1 rounded-full bg-[#2D2A26] self-center" />
                       <p>{LABEL_JALUR[p.jalurMasuk as keyof typeof LABEL_JALUR] || p.jalurMasuk}</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-[#2D2A26] flex items-center justify-between relative z-10 mt-auto">
                    <div className="flex flex-col gap-1">
                       <p className="text-[10px] text-[#6A685F] font-bold uppercase tracking-widest">Waktu Pendaftaran</p>
                       <div className="flex items-center gap-2 text-[#D2CEBE] font-medium text-xs">
                          <Calendar className="w-3 h-3 opacity-40" />
                          {formatTanggal(p.createdAt.toISOString())}
                       </div>
                    </div>
                    
                    <div className="bg-[#2B2A23] border border-[#2D2A26] px-6 py-4 rounded-[28px] flex items-center gap-6 group-hover:border-[#EAC956]/50 transition-colors">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[#6A685F] uppercase tracking-tighter">Dokumen</span>
                          <span className={cn("text-xl font-bold", dokValid === dokTotal ? "text-green-500" : "text-[#EAC956]")}>
                            {dokValid}/{dokTotal}
                          </span>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-[#EAC956] text-[#3A2E00] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-[#EAC956]/10">
                          <ArrowRight className="w-5 h-5" />
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
