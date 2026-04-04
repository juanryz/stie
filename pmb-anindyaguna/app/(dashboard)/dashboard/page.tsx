import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LABEL_JALUR, LABEL_STATUS } from "@/types";
import { Users, Clock, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
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
      color: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-500",
    },
    {
      label: "Menunggu Verifikasi",
      value: statusMap.MENUNGGU_VERIFIKASI ?? 0,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      iconColor: "text-yellow-500",
    },
    {
      label: "Diterima",
      value: statusMap.DITERIMA ?? 0,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-700 border-green-200",
      iconColor: "text-green-500",
    },
    {
      label: "Ditolak",
      value: statusMap.DITOLAK ?? 0,
      icon: XCircle,
      color: "bg-red-50 text-red-700 border-red-200",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B4F72]">Dashboard</h1>
        {periodePMB && (
          <p className="text-sm text-muted-foreground mt-0.5">
            Periode aktif: <span className="font-medium text-[#1B4F72]">{periodePMB.nama}</span>
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div
            key={label}
            className={cn("rounded-xl border p-4 bg-white shadow-sm", color)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium opacity-80">{label}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
              </div>
              <Icon className={cn("h-5 w-5 mt-1", iconColor)} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kuota per Prodi */}
        <div className="rounded-xl bg-white border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <p className="text-sm font-semibold text-[#1B4F72]">Kuota per Program Studi</p>
          </div>
          <div className="p-5 space-y-4">
            {prodiList.map((prodi) => {
              const terisi = prodi._count.pendaftar;
              const persen = Math.min(100, Math.round((terisi / prodi.kuota) * 100));
              return (
                <div key={prodi.id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">
                      {prodi.kode} — {prodi.nama}
                      <span className="ml-1 text-xs text-muted-foreground font-normal">
                        ({prodi.jenjang})
                      </span>
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {terisi}/{prodi.kuota}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        persen >= 90 ? "bg-red-500" : persen >= 70 ? "bg-yellow-500" : "bg-[#1B4F72]"
                      )}
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {persen}% terisi · sisa {Math.max(0, prodi.kuota - terisi)} kursi
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per Jalur Masuk */}
        <div className="rounded-xl bg-white border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <p className="text-sm font-semibold text-[#1B4F72]">Pendaftar per Jalur Masuk</p>
          </div>
          <div className="p-5 space-y-3">
            {perJalur.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada data.</p>
            ) : (
              perJalur.map(({ jalurMasuk, _count }) => {
                const persen = totalPendaftar > 0
                  ? Math.round((_count / totalPendaftar) * 100)
                  : 0;
                return (
                  <div key={jalurMasuk} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-28 shrink-0">
                      {LABEL_JALUR[jalurMasuk]}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1B4F72]/70"
                        style={{ width: `${persen}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">{_count}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Status breakdown */}
          <div className="px-5 pb-5">
            <p className="text-xs font-semibold text-[#1B4F72] uppercase tracking-wide mb-3 mt-1">
              Breakdown Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  "MENUNGGU_VERIFIKASI",
                  "TERVERIFIKASI",
                  "DITERIMA",
                  "DITOLAK",
                  "DOKUMEN_TIDAK_LENGKAP",
                  "DAFTAR_ULANG",
                ] as StatusPMB[]
              ).map((s) => {
                const count = statusMap[s] ?? 0;
                if (count === 0) return null;
                return (
                  <div key={s} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-1.5">
                    <span className="text-xs text-muted-foreground truncate pr-2">
                      {LABEL_STATUS[s]}
                    </span>
                    <span className="text-xs font-bold shrink-0">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pendaftar terbaru */}
      <div className="rounded-xl bg-white border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#1B4F72]">Pendaftar Terbaru</p>
          <a href="/pendaftar" className="text-xs text-[#1B4F72] hover:underline font-medium">
            Lihat semua →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">
                  No. Pendaftaran
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">
                  Nama
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                  Prodi
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground hidden lg:table-cell">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendaftarTerbaru.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    Belum ada pendaftar.
                  </td>
                </tr>
              ) : (
                pendaftarTerbaru.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-[#1B4F72]">
                      <a href={`/pendaftar/${p.id}`} className="hover:underline">
                        {p.noPendaftaran}
                      </a>
                    </td>
                    <td className="px-5 py-3 font-medium">{p.nama}</td>
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                      {p.prodi.kode}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                      {new Date(p.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusPMB }) {
  const MAP: Partial<Record<StatusPMB, string>> = {
    MENUNGGU_VERIFIKASI: "bg-yellow-100 text-yellow-800",
    DOKUMEN_TIDAK_LENGKAP: "bg-orange-100 text-orange-800",
    TERVERIFIKASI: "bg-blue-100 text-blue-800",
    DITERIMA: "bg-green-100 text-green-800",
    DITOLAK: "bg-red-100 text-red-800",
    DAFTAR_ULANG: "bg-teal-100 text-teal-800",
  };
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
        MAP[status] ?? "bg-muted text-muted-foreground"
      )}
    >
      {LABEL_STATUS[status]}
    </span>
  );
}
