"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

import {
  dataProgramSchema,
  type DataProgramInput,
} from "@/lib/validations/pendaftaran";
import { usePendaftaranFormStore } from "@/store/pendaftaran-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Prodi {
  id: string;
  kode: string;
  nama: string;
  jenjang: string;
  kuota: number;
  sisaKuota: number;
}

interface StepDataProgramProps {
  prodiList: Prodi[];
}

const JALUR_OPTIONS = [
  { value: "REGULER", label: "Reguler", desc: "Jalur umum untuk semua lulusan SMA/SMK/MA" },
  { value: "BEASISWA", label: "Beasiswa", desc: "Keringanan biaya bagi pendaftar berprestasi" },
  { value: "TRANSFER", label: "Transfer", desc: "Untuk lulusan D3 yang ingin lanjut ke S1" },
  { value: "KERJASAMA", label: "Kerjasama", desc: "Jalur khusus mitra institusi" },
] as const;

const selectClass = "h-14 w-full bg-black/20 border-[#2D2A26] rounded-2xl px-6 text-white text-lg focus:ring-2 focus:ring-[#EAC956]/30 focus:border-[#EAC956] transition-all font-light appearance-none";
const labelClass = "text-[10px] font-bold text-[#EAC956] uppercase tracking-widest ml-1 mb-2 block";

export function StepDataProgram({ prodiList }: StepDataProgramProps) {
  const { dataProgram, setDataProgram, nextStep, prevStep } =
    usePendaftaranFormStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DataProgramInput>({
    resolver: zodResolver(dataProgramSchema),
    defaultValues: dataProgram as DataProgramInput,
  });

  const selectedJalur = watch("jalurMasuk");

  function onSubmit(data: DataProgramInput) {
    setDataProgram(data);
    nextStep();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {/* Pilih Prodi */}
      <div className="space-y-1 group">
        <Label htmlFor="prodiId" className={labelClass}>Program Studi <span className="text-red-400">*</span></Label>
        <div className="relative">
          <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors z-10 pointer-events-none" />
          <select
            id="prodiId"
            className={cn(selectClass, "pl-14 cursor-pointer", errors.prodiId && "border-red-400")}
            {...register("prodiId")}
          >
            <option value="" className="bg-[#1C1A17] text-white">— Pilih program studi —</option>
            {prodiList.map((prodi) => (
              <option key={prodi.id} value={prodi.id} disabled={prodi.sisaKuota <= 0} className="bg-[#1C1A17] text-white py-2">
                {prodi.nama} ({prodi.jenjang}) — Sisa {prodi.sisaKuota} kursi
              </option>
            ))}
          </select>
        </div>
        {errors.prodiId && <p className="text-red-400 text-[10px] uppercase font-bold tracking-tighter mt-2">{errors.prodiId.message}</p>}
      </div>

      {/* Pilih Jalur */}
      <div className="space-y-2">
        <Label className={labelClass}>Jalur Masuk <span className="text-red-400">*</span></Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {JALUR_OPTIONS.map((jalur) => {
            const isSelected = selectedJalur === jalur.value;
            return (
              <button
                key={jalur.value}
                type="button"
                onClick={() => setValue("jalurMasuk", jalur.value, { shouldValidate: true })}
                className={cn(
                  "flex flex-col items-start rounded-2xl border-2 p-5 text-left transition-all relative overflow-hidden group",
                  isSelected
                    ? "border-[#EAC956] bg-[#EAC956]/5 shadow-[0_0_20px_rgba(234,201,86,0.1)] text-[#EAC956]"
                    : "border-[#2D2A26] bg-black/20 hover:border-[#EAC956]/40 text-white hover:text-[#EAC956]"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "border-[#EAC956]" : "border-[#6A685F] group-hover:border-[#EAC956]/50"
                    )}
                  >
                    {isSelected && (
                      <div className="h-2.5 w-2.5 rounded-full bg-[#EAC956]" />
                    )}
                  </div>
                  <span className="font-bold text-lg leading-none">{jalur.label}</span>
                </div>
                <p className="text-sm font-light text-[#D2CEBE] ml-8">{jalur.desc}</p>
              </button>
            );
          })}
        </div>
        {/* hidden input untuk register jalurMasuk */}
        <input type="hidden" {...register("jalurMasuk")} />
        {errors.jalurMasuk && <p className="text-red-400 text-[10px] uppercase font-bold tracking-tighter mt-1">{errors.jalurMasuk.message}</p>}
      </div>

      <div className="flex justify-between items-center pt-10 border-t border-[#2D2A26] mt-12">
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
          Lanjut ke Dokumen <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}
