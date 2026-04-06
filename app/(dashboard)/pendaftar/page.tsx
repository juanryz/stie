import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LABEL_STATUS, LABEL_JALUR } from "@/types";
import { cn } from "@/lib/utils";
import { Search, Filter, Users, ArrowRight, Calendar, GraduationCap } from "lucide-react";
import type { StatusPMB, JalurMasuk } from "@prisma/client";

export const metadata: Metadata = {
  title: "Data Pendaftar — PMB STIE Anindyaguna",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    prodiId?: string;
    jalur?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 20;

async function getPendaftar(filters: {
  q?: string;
  status?: string;
  prodiId?: string;
  jalur?: string;
  page: number;
}) {
  const where = {
    ...(filters.q && {
      OR: [
        { nama: { contains: filters.q, mode: "insensitive" as const } },
        { noPendaftaran: { contains: filters.q, mode: "insensitive" as const } },
        { nik: { contains: filters.q } },
        { noHp: { contains: filters.q } },
      ],
    }),
    ...(filters.status && { status: filters.status as StatusPMB }),
    ...(filters.prodiId && { prodiId: filters.prodiId }),
    ...(filters.jalur && { jalurMasuk: filters.jalur as JalurMasuk }),
  };

  const [data, total] = await Promise.all([
    prisma.pendaftar.findMany({
      where,
      include: { prodi: { select: { kode: true, nama: true } } },
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.pendaftar.count({ where }),
  ]);

  return { data, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export default async function PendaftarPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const { data, total, totalPages } = await getPendaftar({ ...sp, page });

  const prodiList = await prisma.programStudi.findMany({ where: { aktif: true } });

  const buildUrl = (params: Record<string, string | undefined>) => {
    const merged = { ...sp, ...params };
    const qs = new URLSearchParams(
      Object.entries(merged).filter((e): e is [string, string] => !!e[1])
    ).toString();
    return `/pendaftar${qs ? "?" + qs : ""}`;
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-[1600px] mx-auto min-h-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
           <div className="flex items-center gap-3 mb-4 text-[#EAC956]">
             <Users className="w-8 h-8" />
             <span className="text-sm font-bold tracking-[0.2em] uppercase">Database</span>
           </div>
           <h1 className="text-5xl text-white font-normal tracking-tight mb-2">Data Pendaftar</h1>
           <p className="text-[#D2CEBE] font-light">
             Ditemukan <span className="font-bold text-[#EAC956]">{total}</span> calon mahasiswa terdaftar.
           </p>
        </div>
        
        {/* ACTION BUTTONS (Optional) */}
        <div className="flex gap-4">
           {/* Placeholder for future export buttons */}
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-[#1C1A17] border border-[#2D2A26] rounded-[40px] p-8 lg:p-10 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#EAC956]/2 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
         
         <form method="GET" action="/pendaftar" className="flex flex-col lg:flex-row gap-6 relative z-10">
            <div className="relative flex-1 min-w-[280px]">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
               <input 
                name="q"
                defaultValue={sp.q}
                placeholder="Cari nama, NIK, atau no. pendaftaran..." 
                className="w-full h-14 bg-black/20 border border-[#2D2A26] rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-[#EAC956]/50 focus:bg-[#2B2A23]/50 transition-all" 
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-[2]">
               <select
                 name="status"
                 defaultValue={sp.status}
                 className="h-14 bg-black/20 border border-[#2D2A26] text-[#D2CEBE] rounded-2xl px-6 text-sm focus:outline-none focus:border-[#EAC956]/50 transition-all appearance-none cursor-pointer"
               >
                 <option value="" className="bg-[#1C1A17]">Semua Status</option>
                 {(Object.keys(LABEL_STATUS) as StatusPMB[]).map((s) => (
                   <option key={s} value={s} className="bg-[#1C1A17]">
                     {LABEL_STATUS[s]}
                   </option>
                 ))}
               </select>

               <select
                 name="prodiId"
                 defaultValue={sp.prodiId}
                 className="h-14 bg-black/20 border border-[#2D2A26] text-[#D2CEBE] rounded-2xl px-6 text-sm focus:outline-none focus:border-[#EAC956]/50 transition-all appearance-none cursor-pointer"
               >
                 <option value="" className="bg-[#1C1A17]">Semua Prodi</option>
                 {prodiList.map((p) => (
                   <option key={p.id} value={p.id} className="bg-[#1C1A17]">
                     {p.kode} — {p.nama}
                   </option>
                 ))}
               </select>

               <select
                 name="jalur"
                 defaultValue={sp.jalur}
                 className="h-14 bg-black/20 border border-[#2D2A26] text-[#D2CEBE] rounded-2xl px-6 text-sm focus:outline-none focus:border-[#EAC956]/50 transition-all appearance-none cursor-pointer"
               >
                 <option value="" className="bg-[#1C1A17]">Semua Jalur</option>
                 {(Object.keys(LABEL_JALUR) as JalurMasuk[]).map((j) => (
                   <option key={j} value={j} className="bg-[#1C1A17]">
                     {LABEL_JALUR[j]}
                   </option>
                 ))}
               </select>
            </div>

            <div className="flex gap-2">
               <button
                 type="submit"
                 className="px-8 h-14 bg-[#EAC956] text-[#3A2E00] font-bold rounded-2xl hover:bg-[#FCE68A] shadow-xl shadow-[#EAC956]/10 transition-all flex items-center gap-2 shrink-0"
               >
                 <Filter className="w-4 h-4" /> Filter
               </button>
               
               {(sp.q || sp.status || sp.prodiId || sp.jalur) && (
                 <Link
                   href="/pendaftar"
                   className="px-6 h-14 border border-[#2D2A26] text-[#D2CEBE] font-medium rounded-2xl hover:bg-white/5 transition-all flex items-center shrink-0"
                 >
                   Reset
                 </Link>
               )}
            </div>
         </form>
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-[40px] bg-[#1C1A17] border border-[#2D2A26] shadow-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2A26] bg-[#2B2A23]/20">
                <th className="text-left px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F]">ID Pendaftaran</th>
                <th className="text-left px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F]">Calon Mahasiswa</th>
                <th className="text-left px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F] hidden sm:table-cell">Program Studi</th>
                <th className="text-left px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F] hidden md:table-cell">Jalur</th>
                <th className="text-left px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F]">Status</th>
                <th className="text-left px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F] hidden lg:table-cell">Terdaftar</th>
                <th className="px-8 py-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2A26]">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                     <Users className="w-12 h-12 text-[#2D2A26] mx-auto mb-4" />
                     <p className="text-[#6A685F] font-light">Tidak ada pendaftar yang sesuai dengan kriteria.</p>
                  </td>
                </tr>
              ) : (
                data.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-8 py-6">
                       <span className="font-mono text-xs text-[#EAC956] font-bold">#{p.noPendaftaran}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="text-white font-medium text-base group-hover:text-[#EAC956] transition-colors">{p.nama}</span>
                          <span className="text-[#6A685F] text-[10px] font-bold uppercase tracking-widest mt-1">{p.noHp}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-[#D2CEBE] font-light hidden sm:table-cell">
                       <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 opacity-40" />
                          {p.prodi.nama}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-[#D2CEBE] font-light hidden md:table-cell">
                       {LABEL_JALUR[p.jalurMasuk]}
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-8 py-6 text-[#6A685F] text-xs font-medium hidden lg:table-cell">
                       <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 opacity-40" />
                          {new Date(p.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link
                        href={`/pendaftar/${p.id}`}
                        className="w-10 h-10 rounded-full bg-[#2B2A23] border border-[#2D2A26] flex items-center justify-center text-white hover:bg-[#EAC956] hover:text-[#3A2E00] hover:border-[#EAC956] transition-all ml-auto group/btn"
                      >
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <div className="px-10 py-8 border-t border-[#2D2A26] bg-[#2B2A23]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm font-light text-[#6A685F]">
              Menampilkan <span className="text-[#D2CEBE] font-bold">{data.length}</span> dari <span className="text-[#D2CEBE] font-bold">{total}</span> entri
            </p>
            
            <div className="flex gap-3">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="px-6 h-12 border border-[#2D2A26] text-[#D2CEBE] rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center font-bold text-xs"
                >
                  KEMBALI
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="px-8 h-12 bg-[#2B2A23] text-[#EAC956] rounded-2xl hover:bg-[#EAC956] hover:text-[#3A2E00] transition-all flex items-center justify-center font-bold text-xs shadow-xl shadow-black/20"
                >
                  HALAMAN BERIKUTNYA
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusPMB }) {
  const MAP: Partial<Record<StatusPMB, string>> = {
    MENUNGGU_VERIFIKASI: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    DOKUMEN_TIDAK_LENGKAP: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    TERVERIFIKASI: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    DITERIMA: "bg-green-500/10 text-green-500 border-green-500/20",
    DITOLAK: "bg-red-500/10 text-red-500 border-red-500/20",
    DAFTAR_ULANG: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  };
  
  return (
    <span className={cn("inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all", MAP[status] ?? "bg-white/5 text-white/50 border-white/10")}>
      {LABEL_STATUS[status as keyof typeof LABEL_STATUS] || status.replace(/_/g, ' ')}
    </span>
  );
}
