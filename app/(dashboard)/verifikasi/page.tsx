import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LABEL_JALUR } from "@/types";
import { formatTanggal } from "@/lib/utils";
import { cn } from "@/lib/utils";

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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1B4F72]">Antrian Verifikasi</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          <strong>{antrian.length}</strong> pendaftar menunggu verifikasi dokumen.
        </p>
      </div>

      {antrian.length === 0 ? (
        <div className="rounded-xl bg-white border border-border shadow-sm p-12 text-center text-muted-foreground">
          Tidak ada pendaftar yang perlu diverifikasi saat ini.
        </div>
      ) : (
        <div className="space-y-3">
          {antrian.map((p) => {
            const dokTotal = p.dokumen.length;
            const dokValid = p.dokumen.filter((d) => d.status === "VALID").length;
            const isLengkap = p.status === "DOKUMEN_TIDAK_LENGKAP";

            return (
              <Link key={p.id} href={`/pendaftar/${p.id}`}>
                <div className="rounded-xl bg-white border border-border shadow-sm p-4 hover:border-[#1B4F72]/40 hover:bg-[#1B4F72]/5 transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-mono text-xs text-[#1B4F72] font-semibold">
                          {p.noPendaftaran}
                        </p>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            isLengkap
                              ? "bg-orange-100 text-orange-800"
                              : "bg-yellow-100 text-yellow-800"
                          )}
                        >
                          {isLengkap ? "Dokumen Tidak Lengkap" : "Menunggu Verifikasi"}
                        </span>
                      </div>
                      <p className="font-semibold mt-1">{p.nama}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.prodi.kode} · {LABEL_JALUR[p.jalurMasuk]} ·{" "}
                        Daftar {formatTanggal(p.createdAt.toISOString())}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">Dokumen</p>
                      <p className={cn("text-sm font-bold", dokValid === dokTotal ? "text-green-600" : "text-orange-500")}>
                        {dokValid}/{dokTotal}
                      </p>
                      <p className="text-xs text-[#1B4F72] group-hover:underline mt-1">
                        Verifikasi →
                      </p>
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
