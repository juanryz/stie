"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { usePendaftaranFormStore } from "@/store/pendaftaran-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LABEL_JALUR } from "@/types";
import { formatTanggal, formatUkuranFile } from "@/lib/utils";

interface Prodi {
  id: string;
  nama: string;
  jenjang: string;
}

interface StepReviewProps {
  prodiList: Prodi[];
}

export function StepReview({ prodiList }: StepReviewProps) {
  const router = useRouter();
  const { dataPribadi, dataPendidikan, dataOrangTua, dataProgram, dokumenFiles, prevStep, reset } =
    usePendaftaranFormStore();

  const [setuju, setSetuju] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProdi = prodiList.find((p) => p.id === dataProgram.prodiId);

  async function handleSubmit() {
    if (!setuju) {
      toast.error("Centang pernyataan kebenaran data terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Buat FormData untuk kirim file + data sekaligus
      const formData = new FormData();

      // Append data JSON
      formData.append("data", JSON.stringify({
        ...dataPribadi,
        ...dataPendidikan,
        ...dataOrangTua,
        ...dataProgram,
      }));

      // Append files
      Object.entries(dokumenFiles).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const res = await fetch("/api/pendaftar", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Gagal mengirim pendaftaran. Silakan coba lagi.");
        return;
      }

      toast.success("Pendaftaran berhasil dikirim!");
      reset();
      router.push(`/status?noPendaftaran=${result.noPendaftaran}`);
    } catch {
      toast.error("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Periksa kembali semua data berikut sebelum mengirim pendaftaran.
      </p>

      {/* Data Pribadi */}
      <ReviewSection title="Data Pribadi">
        <ReviewRow label="Nama" value={dataPribadi.nama} />
        <ReviewRow label="NIK" value={dataPribadi.nik} />
        <ReviewRow label="Jenis Kelamin" value={dataPribadi.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"} />
        <ReviewRow label="Tempat, Tgl Lahir" value={`${dataPribadi.tempatLahir}, ${dataPribadi.tanggalLahir ? formatTanggal(dataPribadi.tanggalLahir) : "-"}`} />
        <ReviewRow label="Agama" value={dataPribadi.agama} />
        <ReviewRow label="Alamat" value={`${dataPribadi.alamat}, ${dataPribadi.kota}, ${dataPribadi.provinsi} ${dataPribadi.kodePos ?? ""}`} />
        <ReviewRow label="No. HP" value={dataPribadi.noHp} />
        <ReviewRow label="Email" value={dataPribadi.email} />
      </ReviewSection>

      {/* Data Pendidikan */}
      <ReviewSection title="Data Pendidikan">
        <ReviewRow label="Sekolah Asal" value={dataPendidikan.asalSekolah} />
        <ReviewRow label="Jurusan" value={dataPendidikan.jurusanSekolah} />
        <ReviewRow label="Tahun Lulus" value={String(dataPendidikan.tahunLulus ?? "-")} />
        <ReviewRow label="Nilai Rata-rata" value={dataPendidikan.nilaiRataRata ? String(dataPendidikan.nilaiRataRata) : "-"} />
      </ReviewSection>

      {/* Data Orang Tua */}
      {(dataOrangTua.namaAyah || dataOrangTua.namaIbu) && (
        <ReviewSection title="Data Orang Tua">
          {dataOrangTua.namaAyah && <ReviewRow label="Nama Ayah" value={dataOrangTua.namaAyah} />}
          {dataOrangTua.namaIbu && <ReviewRow label="Nama Ibu" value={dataOrangTua.namaIbu} />}
          {dataOrangTua.pekerjaanOrtu && <ReviewRow label="Pekerjaan" value={dataOrangTua.pekerjaanOrtu} />}
          {dataOrangTua.noHpOrtu && <ReviewRow label="No. HP Ortu" value={dataOrangTua.noHpOrtu} />}
        </ReviewSection>
      )}

      {/* Program */}
      <ReviewSection title="Pilihan Program">
        <ReviewRow label="Program Studi" value={selectedProdi ? `${selectedProdi.nama} (${selectedProdi.jenjang})` : "-"} />
        <ReviewRow label="Jalur Masuk" value={dataProgram.jalurMasuk ? LABEL_JALUR[dataProgram.jalurMasuk] : "-"} />
      </ReviewSection>

      {/* Dokumen */}
      <ReviewSection title="Dokumen yang Diunggah">
        {Object.entries(dokumenFiles).map(([key, file]) =>
          file ? (
            <ReviewRow
              key={key}
              label={key}
              value={`${file.name} (${formatUkuranFile(file.size)})`}
              icon={<CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />}
            />
          ) : null
        )}
      </ReviewSection>

      {/* Persetujuan */}
      <div className="flex items-start gap-4 rounded-2xl bg-[#EAC956]/5 border-2 border-[#EAC956]/20 p-6 mt-8 shadow-[0_0_20px_rgba(234,201,86,0.05)] transition-colors hover:border-[#EAC956]/40">
        <Checkbox
          id="setuju"
          checked={setuju}
          onCheckedChange={(v) => setSetuju(!!v)}
          className="mt-1 h-6 w-6 border-2 border-[#EAC956] data-[state=checked]:bg-[#EAC956] data-[state=checked]:text-[#3A2E00] rounded-md shrink-0"
        />
        <Label htmlFor="setuju" className="text-[#D2CEBE] font-light leading-relaxed cursor-pointer text-sm">
          Saya menyatakan bahwa semua data dan dokumen yang saya isi adalah{" "}
          <strong className="text-white font-bold">benar dan dapat dipertanggungjawabkan</strong>. Saya memahami
          bahwa data palsu dapat menyebabkan pembatalan pendaftaran.
        </Label>
      </div>

      <div className="flex justify-between items-center pt-10 border-t border-[#2D2A26] mt-12">
        <button 
          type="button" 
          onClick={prevStep} 
          disabled={isSubmitting}
          className="h-16 px-8 bg-white/5 hover:bg-white/10 text-[#D2CEBE] rounded-[24px] font-bold text-lg flex items-center gap-3 transition-all border border-white/5 disabled:opacity-50"
        >
          <ArrowLeft className="w-6 h-6" /> Kembali
        </button>
        <button 
          type="button" 
          onClick={handleSubmit} 
          disabled={!setuju || isSubmitting}
          className="h-16 px-12 bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-[24px] font-bold text-lg flex items-center gap-3 shadow-3xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
          {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
        </button>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-[#2D2A26] bg-black/20 overflow-hidden group hover:border-[#EAC956]/40 transition-colors">
      <div className="bg-[#EAC956]/5 px-6 py-4 border-b border-[#2D2A26] group-hover:bg-[#EAC956]/10 transition-colors">
        <p className="text-[10px] font-bold text-[#EAC956] tracking-widest uppercase">{title}</p>
      </div>
      <div className="px-6 py-5 space-y-3">{children}</div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 text-sm pb-3 border-b border-white/5 last:border-0 last:pb-0">
      {icon}
      <span className="text-[#6A685F] text-xs font-bold uppercase tracking-widest w-40 shrink-0 mt-0.5">{label}</span>
      <span className="font-light text-[#F8F6F1] break-all text-lg leading-tight">{value ?? "-"}</span>
    </div>
  );
}
