"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  dataPendidikanSchema,
  type DataPendidikanInput,
} from "@/lib/validations/pendaftaran";
import { usePendaftaranFormStore } from "@/store/pendaftaran-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus:border-ring focus:ring-3 focus:ring-ring/50";

const JURUSAN_OPTIONS = [
  "IPA",
  "IPS",
  "Bahasa",
  "SMK Akuntansi",
  "SMK Manajemen",
  "SMK Bisnis",
  "SMK Lainnya",
  "Lainnya",
];

export function StepDataPendidikan() {
  const { dataPendidikan, setDataPendidikan, nextStep, prevStep } =
    usePendaftaranFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataPendidikanInput>({
    resolver: zodResolver(dataPendidikanSchema),
    defaultValues: dataPendidikan as DataPendidikanInput,
  });

  function onSubmit(data: DataPendidikanInput) {
    setDataPendidikan(data);
    nextStep();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Asal Sekolah */}
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="asalSekolah">Nama Sekolah Asal <span className="text-destructive">*</span></Label>
          <Input
            id="asalSekolah"
            placeholder="Contoh: SMA Negeri 1 Semarang"
            aria-invalid={!!errors.asalSekolah}
            {...register("asalSekolah")}
          />
          {errors.asalSekolah && <p className="text-xs text-destructive">{errors.asalSekolah.message}</p>}
        </div>

        {/* Jurusan */}
        <div className="space-y-1.5">
          <Label htmlFor="jurusanSekolah">Jurusan / Program <span className="text-destructive">*</span></Label>
          <select
            id="jurusanSekolah"
            className={cn(selectClass, errors.jurusanSekolah && "border-destructive")}
            {...register("jurusanSekolah")}
          >
            <option value="">— Pilih jurusan —</option>
            {JURUSAN_OPTIONS.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
          {errors.jurusanSekolah && <p className="text-xs text-destructive">{errors.jurusanSekolah.message}</p>}
        </div>

        {/* Tahun Lulus */}
        <div className="space-y-1.5">
          <Label htmlFor="tahunLulus">Tahun Lulus <span className="text-destructive">*</span></Label>
          <Input
            id="tahunLulus"
            type="number"
            placeholder={`Contoh: ${new Date().getFullYear()}`}
            min={2000}
            max={new Date().getFullYear() + 1}
            aria-invalid={!!errors.tahunLulus}
            {...register("tahunLulus", { valueAsNumber: true })}
          />
          {errors.tahunLulus && <p className="text-xs text-destructive">{errors.tahunLulus.message}</p>}
        </div>

        {/* Nilai Rata-rata */}
        <div className="space-y-1.5">
          <Label htmlFor="nilaiRataRata">Nilai Rata-rata Rapor</Label>
          <Input
            id="nilaiRataRata"
            type="number"
            step="0.01"
            placeholder="Contoh: 85.50"
            min={0}
            max={100}
            aria-invalid={!!errors.nilaiRataRata}
            {...register("nilaiRataRata", { valueAsNumber: true })}
          />
          <p className="text-xs text-muted-foreground">Skala 0–100, opsional</p>
          {errors.nilaiRataRata && <p className="text-xs text-destructive">{errors.nilaiRataRata.message}</p>}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
        <Button type="submit" className="bg-[#1B4F72] hover:bg-[#154060] gap-2">
          Lanjut <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
