import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LABEL_JALUR, LABEL_STATUS } from "@/types";
import { Users, Clock, CheckCircle2, XCircle, TrendingUp, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusPMB } from "@prisma/client";

export const metadata: Metadata = {
  title: "Dashboard — PMB STIE Anindyaguna",
};

async function getStats() {
  const [
    totalPendaftar,
    perStatus,
    perProdi,
    perJalur,
    pendaftarTerbaru,
    periodePMB,
  ] = await Promise.all([
    prisma.pendaftar.count(),
    prisma.pendaftar.groupBy({ by: ["status"], _count: true }),
    prisma.pendaftar.groupBy({ by: ["prodiId"], _count: true }),
    prisma.pendaftar.groupBy({ by: ["jalurMasuk"], _count: true }),
    prisma.pendaftar.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { prodi: { select: { nama: true, kode: true } } },
    }),
    prisma.periodePMB.findFirst({ where: { aktif: true } }),
  ]);

  const prodiList = await prisma.programStudi.findMany({
    where: { aktif: true },
    include: { _count: { select: { pendaftar: true } } },
  });

  const statusMap = Object.fromEntries(
    perStatus.map((s) => [s.status, s._count])
  ) as Record<StatusPMB, number>;

  return {
    totalPendaftar,
    statusMap,
    prodiList,
    perJalur,
    pendaftarTerbaru,
    periodePMB,
  };
}

export default async function DashboardPage() {
  const { totalPendaftar, statusMap, prodiList, perJalur, pendaftarTerbaru, periodePMB } =
    await getStats();

  const statCards = [
    {
      label: "Total Pendaftar",
      value: totalPendaftar,
      icon: Users,
      color: "text-[#EAC956]",
      iconColor: "text-[#EAC956]",
    },
    {
      label: "Menunggu Verifikasi",
      value: statusMap.MENUNGGU_VERIFIKASI ?? 0,
      icon: Clock,
      color: "text-yellow-400",
      iconColor: "text-yellow-400",
    },
    {
      label: "Diterima",
      value: statusMap.DITERIMA ?? 0,
      icon: CheckCircle2,
      color: "text-green-400",
      iconColor: "text-green-400",
    },
    {
      label: "Ditolak",
      value: statusMap.DITOLAK ?? 0,
      icon: XCircle,
      color: "text-red-400",
      iconColor: "text-red-400",
    },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-4 text-[#EAC956]">
             <LayoutDashboard className="w-8 h-8" />
             <span className="text-sm font-bold tracking-[0.2em] uppercase">Overview</span>
           </div>
           <h1 className="text-[44px] leading-none text-white font-normal tracking-tight mb-3">Dashboard Utama</h1>
           {periodePMB && (
             <p className="text-[#D2CEBE] font-light">
               Periode Aktif: <span className="font-bold text-[#EAC956] ml-1 bg-[#EAC956]/10 px-3 py-1 rounded-full border border-[#EAC956]/20">{periodePMB.nama}</span>
             </p>
           )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div
            key={label}
            className="rounded-[32px] border border-[#2D2A26] p-8 bg-[#1C1A17] shadow-2xl relative overflow-hidden group hover:border-[#EAC956]/30 transition-all"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-[40px]" />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-xs font-bold text-[#6A685F] uppercase tracking-widest mb-2">{label}</p>
                <p className="text-5xl font-light text-white group-hover:text-[#EAC956] transition-colors">{value}</p>
              </div>
              <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/5", iconColor)}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Kuota per Prodi */}
        <div className="rounded-[40px] bg-[#1C1A17] border border-[#2D2A26] shadow-2xl overflow-hidden">
          <div className="px-10 py-6 border-b border-[#2D2A26] bg-[#2B2A23]/30">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#EAC956]">Kuota per Program Studi</p>
          </div>
          <div className="p-10 space-y-8">
            {prodiList.map((prodi) => {
              const terisi = prodi._count.pendaftar;
              const persen = Math.min(100, Math.round((terisi / prodi.kuota) * 100));
              return (
                <div key={prodi.id} className="group">
                  <div className="flex items-center justify-between text-base mb-3 transition-colors group-hover:text-[#EAC956]">
                    <span className="font-medium text-white">
                      {prodi.nama}
                      <span className="ml-2 text-xs text-[#D2CEBE] font-light">
                        ({prodi.jenjang})
                      </span>
                    </span>
                    <span className="text-[#D2CEBE] text-sm font-bold bg-[#2B2A23] px-3 py-1 rounded-lg">
                      {terisi} / {prodi.kuota}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#33312A] overflow-hidden shadow-inner">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        persen >= 90 ? "bg-red-500" : persen >= 70 ? "bg-[#EAC956]" : "bg-gradient-to-r from-[#EAC956] to-[#FCE68A]"
                      )}
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per Jalur Masuk */}
        <div className="rounded-[40px] bg-[#1C1A17] border border-[#2D2A26] shadow-2xl overflow-hidden flex flex-col">
          <div className="px-10 py-6 border-b border-[#2D2A26] bg-[#2B2A23]/30">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#EAC956]">Pendaftar per Jalur</p>
          </div>
          <div className="p-10 flex-1 space-y-6">
            {perJalur.length === 0 ? (
              <p className="text-sm text-[#D2CEBE] text-center py-10 italic">Belum ada data pendaftar.</p>
            ) : (
              perJalur.map(({ jalurMasuk, _count }) => {
                const persen = totalPendaftar > 0
                  ? Math.round((_count / totalPendaftar) * 100)
                  : 0;
                return (
                  <div key={jalurMasuk} className="flex items-center gap-6 group">
                    <span className="text-sm font-medium text-white w-32 shrink-0 group-hover:text-[#EAC956] transition-colors">
                      {LABEL_JALUR[jalurMasuk as keyof typeof LABEL_JALUR] || jalurMasuk}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#2B2A23] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#EAC956] opacity-70"
                        style={{ width: `${persen}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#EAC956] w-10 text-right">{_count}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Status breakdown grid */}
          <div className="p-10 pt-0">
             <div className="grid grid-cols-2 gap-3">
                {Object.entries(statusMap).map(([status, count]) => (
                   <div key={status} className="bg-[#2B2A23]/50 border border-[#2D2A26] rounded-2xl p-4 flex justify-between items-center group hover:bg-[#2B2A23] transition-colors">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#6A685F] group-hover:text-[#D2CEBE]">{LABEL_STATUS[status as keyof typeof LABEL_STATUS] || status.replace(/_/g, ' ')}</span>
                      <span className="text-white font-bold">{count}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Pendaftar terbaru table */}
      <div className="rounded-[40px] bg-[#1C1A17] border border-[#2D2A26] shadow-2xl overflow-hidden">
        <div className="px-10 py-6 border-b border-[#2D2A26] bg-[#2B2A23]/30 flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#EAC956]">Pendaftar Terbaru</p>
          <Link href="/pendaftar" className="text-xs text-[#EAC956] hover:underline font-bold tracking-widest uppercase">
            Semua Data →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2A26] bg-[#2B2A23]/20">
                <th className="text-left px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F]">ID</th>
                <th className="text-left px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F]">Nama Calon Mahasiswa</th>
                <th className="text-left px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F] hidden md:table-cell">Program Studi</th>
                <th className="text-left px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F]">Status PMB</th>
                <th className="text-left px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6A685F] hidden lg:table-cell">Waktu Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2A26]">
              {pendaftarTerbaru.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-10 py-6 font-mono text-xs text-[#EAC956]">
                    <Link href={`/pendaftar/${p.id}`} className="hover:underline">#{p.noPendaftaran}</Link>
                  </td>
                  <td className="px-10 py-6 font-medium text-white group-hover:text-[#EAC956] transition-colors">{p.nama}</td>
                  <td className="px-10 py-6 text-[#D2CEBE] font-light hidden md:table-cell">{p.prodi.nama}</td>
                  <td className="px-10 py-6">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-10 py-6 text-[#6A685F] text-xs font-medium hidden lg:table-cell">
                    {new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border", MAP[status] ?? "bg-white/5 text-white/50 border-white/10")}>
      {LABEL_STATUS[status as keyof typeof LABEL_STATUS] || status.replace(/_/g, ' ')}
    </span>
  );
}
