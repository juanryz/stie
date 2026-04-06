"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Briefcase, Phone, ArrowLeft, ArrowRight } from "lucide-react";

import {
  dataOrangTuaSchema,
  type DataOrangTuaInput,
} from "@/lib/validations/pendaftaran";
import { usePendaftaranFormStore } from "@/store/pendaftaran-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const inputClass = "h-14 bg-black/20 border-[#2D2A26] rounded-2xl px-6 text-white text-lg focus:ring-2 focus:ring-[#EAC956]/30 focus:border-[#EAC956] transition-all font-light placeholder:text-[#6A685F]";
const labelClass = "text-[10px] font-bold text-[#EAC956] uppercase tracking-widest ml-1 mb-2 block";

export function StepDataOrangTua() {
  const { dataOrangTua, setDataOrangTua, nextStep, prevStep } =
    usePendaftaranFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataOrangTuaInput>({
    resolver: zodResolver(dataOrangTuaSchema),
    defaultValues: dataOrangTua as DataOrangTuaInput,
  });

  function onSubmit(data: DataOrangTuaInput) {
    setDataOrangTua(data);
    nextStep();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Nama Ayah */}
        <div className="space-y-1 group">
          <Label htmlFor="namaAyah" className={labelClass}>Nama Ayah</Label>
          <div className="relative">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
            <Input id="namaAyah" className={cn(inputClass, "pl-14")} placeholder="Nama lengkap ayah" {...register("namaAyah")} />
          </div>
        </div>

        {/* Nama Ibu */}
        <div className="space-y-1 group">
          <Label htmlFor="namaIbu" className={labelClass}>Nama Ibu</Label>
          <div className="relative">
             <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
             <Input id="namaIbu" className={cn(inputClass, "pl-14")} placeholder="Nama lengkap ibu" {...register("namaIbu")} />
          </div>
        </div>

        {/* Pekerjaan Ortu */}
        <div className="space-y-1 group">
          <Label htmlFor="pekerjaanOrtu" className={labelClass}>Pekerjaan Orang Tua</Label>
          <div className="relative">
             <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
             <Input id="pekerjaanOrtu" className={cn(inputClass, "pl-14")} placeholder="Contoh: Wiraswasta" {...register("pekerjaanOrtu")} />
          </div>
        </div>

        {/* No HP Ortu */}
        <div className="space-y-1 group">
          <Label htmlFor="noHpOrtu" className={labelClass}>No. HP Aktif Orang Tua</Label>
          <div className="relative">
            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
            <Input
              id="noHpOrtu"
              type="tel"
              className={cn(inputClass, "pl-14")}
              placeholder="08xxxxxxxxxx"
              aria-invalid={!!errors.noHpOrtu}
              {...register("noHpOrtu")}
            />
          </div>
          {errors.noHpOrtu && <p className="text-red-400 text-[10px] uppercase font-bold tracking-tighter mt-1">{errors.noHpOrtu.message}</p>}
        </div>
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
          Lanjut ke Program Studi <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}
