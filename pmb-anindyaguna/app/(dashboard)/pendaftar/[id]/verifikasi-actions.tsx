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
  TERVERIFIKASI: "bg-blue-600 hover:bg-blue-700 text-white",
  DITERIMA: "bg-green-600 hover:bg-green-700 text-white",
  DITOLAK: "bg-red-600 hover:bg-red-700 text-white",
  DOKUMEN_TIDAK_LENGKAP: "bg-orange-500 hover:bg-orange-600 text-white",
  TERDAFTAR_TES: "bg-purple-600 hover:bg-purple-700 text-white",
  LULUS_TES: "bg-emerald-600 hover:bg-emerald-700 text-white",
  TIDAK_LULUS_TES: "bg-red-500 hover:bg-red-600 text-white",
  DAFTAR_ULANG: "bg-teal-600 hover:bg-teal-700 text-white",
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
    <div className="rounded-xl bg-white border border-border shadow-sm p-4 space-y-3">
      <p className="text-sm font-semibold text-[#1B4F72]">Tindakan Verifikasi</p>

      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSelected(selected === s ? null : s)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border-2",
              selected === s
                ? "border-[#1B4F72] ring-2 ring-[#1B4F72]/20 " + (STATUS_BUTTON[s] ?? "bg-gray-200 text-gray-800")
                : "border-transparent " + (STATUS_BUTTON[s] ?? "bg-gray-200 text-gray-800")
            )}
          >
            {LABEL_STATUS[s]}
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-2">
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder={`Catatan untuk status "${LABEL_STATUS[selected]}" (opsional)`}
            rows={2}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => handleUpdate(selected)}
              disabled={!!loading}
              className="bg-[#1B4F72] hover:bg-[#154060] text-sm"
            >
              {loading === selected ? "Menyimpan..." : `Konfirmasi: ${LABEL_STATUS[selected]}`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => { setSelected(null); setCatatan(""); }}
            >
              Batal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
