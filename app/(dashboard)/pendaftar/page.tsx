import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LABEL_STATUS, LABEL_JALUR } from "@/types";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
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

const STATUS_WARNA: Partial<Record<StatusPMB, string>> = {
  MENUNGGU_VERIFIKASI: "bg-yellow-100 text-yellow-800",
  DOKUMEN_TIDAK_LENGKAP: "bg-orange-100 text-orange-800",
  TERVERIFIKASI: "bg-blue-100 text-blue-800",
  TERDAFTAR_TES: "bg-purple-100 text-purple-800",
  LULUS_TES: "bg-emerald-100 text-emerald-800",
  TIDAK_LULUS_TES: "bg-red-100 text-red-800",
  DITERIMA: "bg-green-100 text-green-800",
  DITOLAK: "bg-red-100 text-red-800",
  DAFTAR_ULANG: "bg-teal-100 text-teal-800",
  MENGUNDURKAN_DIRI: "bg-gray-100 text-gray-800",
};

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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1B4F72]">Data Pendaftar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Total <strong>{total}</strong> pendaftar ditemukan
        </p>
      </div>

      {/* Filter bar */}
      <form method="GET" action="/pendaftar" className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Cari nama, NIK, no. pendaftaran..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30"
          />
        </div>

        <select
          name="status"
          defaultValue={sp.status}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30"
        >
          <option value="">Semua Status</option>
          {(Object.keys(LABEL_STATUS) as StatusPMB[]).map((s) => (
            <option key={s} value={s}>
              {LABEL_STATUS[s]}
            </option>
          ))}
        </select>

        <select
          name="prodiId"
          defaultValue={sp.prodiId}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30"
        >
          <option value="">Semua Prodi</option>
          {prodiList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.kode} — {p.nama}
            </option>
          ))}
        </select>

        <select
          name="jalur"
          defaultValue={sp.jalur}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30"
        >
          <option value="">Semua Jalur</option>
          {(Object.keys(LABEL_JALUR) as JalurMasuk[]).map((j) => (
            <option key={j} value={j}>
              {LABEL_JALUR[j]}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-[#1B4F72] text-white rounded-lg hover:bg-[#154060] transition-colors"
        >
          Filter
        </button>
        {(sp.q || sp.status || sp.prodiId || sp.jalur) && (
          <a
            href="/pendaftar"
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Reset
          </a>
        )}
      </form>

      {/* Table */}
      <div className="rounded-xl bg-white border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">No. Pendaftaran</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Nama</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Prodi</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Jalur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Tanggal</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    Tidak ada pendaftar ditemukan.
                  </td>
                </tr>
              ) : (
                data.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#1B4F72]">{p.noPendaftaran}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.nama}</p>
                      <p className="text-xs text-muted-foreground">{p.noHp}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{p.prodi.kode}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{LABEL_JALUR[p.jalurMasuk]}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                          STATUS_WARNA[p.status] ?? "bg-muted text-muted-foreground"
                        )}
                      >
                        {LABEL_STATUS[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                      {new Date(p.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/pendaftar/${p.id}`}
                        className="text-xs text-[#1B4F72] font-medium hover:underline"
                      >
                        Detail →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={buildUrl({ page: String(page - 1) })}
                  className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  ← Prev
                </a>
              )}
              {page < totalPages && (
                <a
                  href={buildUrl({ page: String(page + 1) })}
                  className="px-3 py-1.5 text-xs bg-[#1B4F72] text-white rounded-lg hover:bg-[#154060] transition-colors"
                >
                  Next →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
