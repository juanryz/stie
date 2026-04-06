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
      <div className="flex items-start gap-3 rounded-lg bg-muted/50 border border-border p-4">
        <Checkbox
          id="setuju"
          checked={setuju}
          onCheckedChange={(v) => setSetuju(!!v)}
          className="mt-0.5"
        />
        <Label htmlFor="setuju" className="text-sm leading-relaxed cursor-pointer">
          Saya menyatakan bahwa semua data dan dokumen yang saya isi adalah{" "}
          <strong>benar dan dapat dipertanggungjawabkan</strong>. Saya memahami
          bahwa data palsu dapat menyebabkan pembatalan pendaftaran.
        </Label>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="gap-2" disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!setuju || isSubmitting}
          className="bg-[#1B4F72] hover:bg-[#154060] gap-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
        </Button>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="bg-muted/50 px-4 py-2 border-b border-border">
        <p className="text-sm font-semibold text-[#1B4F72]">{title}</p>
      </div>
      <div className="px-4 py-3 space-y-2">{children}</div>
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
    <div className="flex items-start gap-2 text-sm">
      {icon}
      <span className="text-muted-foreground w-36 shrink-0">{label}</span>
      <span className="font-medium break-all">{value ?? "-"}</span>
    </div>
  );
}
