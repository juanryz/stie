"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LABEL_STATUS } from "@/types";
import { cn } from "@/lib/utils";
import type { StatusPMB } from "@prisma/client";

const NEXT_STATUSES: Partial<Record<StatusPMB, StatusPMB[]>> = {
  MENUNGGU_VERIFIKASI: ["TERVERIFIKASI", "DOKUMEN_TIDAK_LENGKAP", "DITOLAK"],
  DOKUMEN_TIDAK_LENGKAP: ["TERVERIFIKASI", "DITOLAK"],
  TERVERIFIKASI: ["TERDAFTAR_TES", "DITERIMA", "DITOLAK"],
  TERDAFTAR_TES: ["LULUS_TES", "TIDAK_LULUS_TES"],
  LULUS_TES: ["DITERIMA"],
  DITERIMA: ["DAFTAR_ULANG"],
};

const STATUS_BUTTON: Partial<Record<StatusPMB, string>> = {
  TERVERIFIKASI: "bg-blue-500 hover:bg-blue-400 text-black border-blue-500",
  DITERIMA: "bg-green-500 hover:bg-green-400 text-black border-green-500",
  DITOLAK: "bg-red-500 hover:bg-red-400 text-white border-red-500",
  DOKUMEN_TIDAK_LENGKAP: "bg-amber-500 hover:bg-amber-400 text-black border-amber-500",
  TERDAFTAR_TES: "bg-purple-500 hover:bg-purple-400 text-white border-purple-500",
  LULUS_TES: "bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-500",
  TIDAK_LULUS_TES: "bg-rose-500 hover:bg-rose-400 text-white border-rose-500",
  DAFTAR_ULANG: "bg-teal-500 hover:bg-teal-400 text-black border-teal-500",
};

interface Props {
  pendaftarId: string;
  currentStatus: StatusPMB;
}

export function VerifikasiActions({ pendaftarId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<StatusPMB | null>(null);
  const [catatan, setCatatan] = useState("");
  const [selected, setSelected] = useState<StatusPMB | null>(null);

  const nextStatuses = NEXT_STATUSES[currentStatus] ?? [];
  if (nextStatuses.length === 0) return null;

  async function handleUpdate(statusBaru: StatusPMB) {
    setLoading(statusBaru);
    try {
      const res = await fetch(`/api/pendaftar/${pendaftarId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusBaru, catatan: catatan.trim() || undefined }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "Gagal mengubah status.");
        return;
      }
      toast.success(`Status diubah ke: ${LABEL_STATUS[statusBaru]}`);
      setSelected(null);
      setCatatan("");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-2xl border-2 border-[#2D2A26] bg-[#EAC956]/5 p-6 shadow-[0_0_20px_rgba(234,201,86,0.05)] border-dashed mb-8">
      <p className="text-[10px] font-bold text-[#EAC956] tracking-widest uppercase mb-4">Tindakan Verifikasi</p>

      <div className="flex flex-wrap gap-3">
        {nextStatuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSelected(selected === s ? null : s)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2 uppercase tracking-widest",
              selected === s
                ? "ring-4 ring-white/10 scale-105 " + (STATUS_BUTTON[s] ?? "border-white/20 bg-white/10 text-white")
                : "border-transparent opacity-80 hover:opacity-100 hover:scale-105 " + (STATUS_BUTTON[s] ?? "bg-white/10 text-white")
            )}
          >
            {LABEL_STATUS[s]}
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-4 mt-6">
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder={`Catatan untuk status "${LABEL_STATUS[selected]}" (wajib bagi penolakan)`}
            rows={2}
            className="w-full text-sm font-light text-white bg-black/40 border border-[#2D2A26] rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#EAC956] transition-all placeholder:text-[#6A685F]"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleUpdate(selected)}
              disabled={!!loading}
              className={cn("px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-50 text-sm", STATUS_BUTTON[selected] ?? "bg-white text-black hover:bg-white/90")}
            >
              {loading === selected ? "Menyimpan..." : `Konfirmasi: ${LABEL_STATUS[selected]}`}
            </button>
            <button
              type="button"
              onClick={() => { setSelected(null); setCatatan(""); }}
              className="px-6 py-3 rounded-xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
