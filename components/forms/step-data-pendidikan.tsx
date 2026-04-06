"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, School, BookOpen, Calendar, Star, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import {
  dataPendidikanSchema,
  type DataPendidikanInput,
} from "@/lib/validations/pendaftaran";
import { usePendaftaranFormStore } from "@/store/pendaftaran-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const inputClass = "h-14 bg-black/20 border-[#2D2A26] rounded-2xl px-6 text-white text-lg focus:ring-2 focus:ring-[#EAC956]/30 focus:border-[#EAC956] transition-all font-light placeholder:text-[#6A685F]";
const labelClass = "text-[10px] font-bold text-[#EAC956] uppercase tracking-widest ml-1 mb-2 block";
const selectClass = "h-14 w-full bg-black/20 border-[#2D2A26] rounded-2xl px-6 text-white text-lg focus:ring-2 focus:ring-[#EAC956]/30 focus:border-[#EAC956] transition-all font-light appearance-none";

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
  const { dataPendidikan, setDataPendidikan, nextStep, prevStep } = usePendaftaranFormStore();

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Asal Sekolah */}
        <div className="md:col-span-2 space-y-1 group">
          <Label className={labelClass}>Nama Sekolah Asal <span className="text-red-400">*</span></Label>
          <div className="relative">
            <School className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
            <Input
              id="asalSekolah"
              className={cn(inputClass, "pl-14")}
              placeholder="SMA Negeri 1 Semarang..."
              {...register("asalSekolah")}
            />
          </div>
          {errors.asalSekolah && <p className="text-red-400 text-[10px] uppercase font-bold tracking-tighter mt-1">{errors.asalSekolah.message}</p>}
        </div>

        {/* Jurusan */}
        <div className="space-y-1 group">
          <Label className={labelClass}>Jurusan / Program <span className="text-red-400">*</span></Label>
          <div className="relative">
            <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors z-10 pointer-events-none" />
            <select
              id="jurusanSekolah"
              className={cn(selectClass, "pl-14 cursor-pointer", errors.jurusanSekolah && "border-red-400")}
              {...register("jurusanSekolah")}
            >
              <option value="" className="bg-[#1C1A17] text-white">— Pilih jurusan —</option>
              {JURUSAN_OPTIONS.map((j) => (
                <option key={j} value={j} className="bg-[#1C1A17] text-white">{j}</option>
              ))}
            </select>
          </div>
          {errors.jurusanSekolah && <p className="text-red-400 text-[10px] uppercase font-bold tracking-tighter mt-2">{errors.jurusanSekolah.message}</p>}
        </div>

        {/* Tahun Lulus */}
        <div className="space-y-1 group">
          <Label className={labelClass}>Tahun Lulus <span className="text-red-400">*</span></Label>
          <div className="relative">
            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
            <Input
              id="tahunLulus"
              type="number"
              className={cn(inputClass, "pl-14")}
              placeholder="Contoh: 2026"
              {...register("tahunLulus", { valueAsNumber: true })}
            />
          </div>
          {errors.tahunLulus && <p className="text-red-400 text-[10px] uppercase font-bold tracking-tighter mt-2">{errors.tahunLulus.message}</p>}
        </div>

        {/* Nilai Rata-rata */}
        <div className="space-y-1 group md:col-span-2">
          <Label className={labelClass}>Nilai Rata-rata Rapor (Opsional)</Label>
          <div className="relative">
            <Star className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
            <Input
              id="nilaiRataRata"
              type="number"
              step="0.01"
              className={cn(inputClass, "pl-14")}
              placeholder="Contoh: 85.50"
              {...register("nilaiRataRata", { valueAsNumber: true })}
            />
          </div>
          <p className="text-[10px] text-[#6A685F] font-bold uppercase tracking-tight mt-2 ml-1">Skala 0–100</p>
          {errors.nilaiRataRata && <p className="text-red-400 text-[10px] uppercase font-bold tracking-tighter mt-1">{errors.nilaiRataRata.message}</p>}
        </div>
      </div>

      <div className="flex justify-between items-center pt-10 border-t border-[#2D2A26]">
        <button 
          type="button" 
          onClick={prevStep} 
          className="h-16 px-8 bg-white/5 hover:bg-white/10 text-[#D2CEBE] rounded-[24px] font-bold text-lg flex items-center gap-3 transition-all border border-white/5"
        >
          <ArrowLeft className="w-6 h-6" /> Kembali
        </button>
        <button 
          type="submit" 
          className="h-16 px-12 bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-[24px] font-bold text-lg flex items-center gap-3 shadow-3xl hover:scale-105 transition-all"
        >
          Lanjut ke Dokumen <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
