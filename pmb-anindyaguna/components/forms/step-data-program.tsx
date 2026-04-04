"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  dataProgramSchema,
  type DataProgramInput,
} from "@/lib/validations/pendaftaran";
import { usePendaftaranFormStore } from "@/store/pendaftaran-form";
import { Button } from "@/components/ui/button";
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

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus:border-ring focus:ring-3 focus:ring-ring/50";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Pilih Prodi */}
      <div className="space-y-1.5">
        <Label htmlFor="prodiId">
          Program Studi <span className="text-destructive">*</span>
        </Label>
        <select
          id="prodiId"
          className={cn(selectClass, errors.prodiId && "border-destructive")}
          {...register("prodiId")}
        >
          <option value="">— Pilih program studi —</option>
          {prodiList.map((prodi) => (
            <option key={prodi.id} value={prodi.id} disabled={prodi.sisaKuota <= 0}>
              {prodi.nama} ({prodi.jenjang}) — Sisa {prodi.sisaKuota} kursi
            </option>
          ))}
        </select>
        {errors.prodiId && (
          <p className="text-xs text-destructive">{errors.prodiId.message}</p>
        )}
      </div>

      {/* Pilih Jalur */}
      <div className="space-y-2">
        <Label>
          Jalur Masuk <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {JALUR_OPTIONS.map((jalur) => {
            const isSelected = selectedJalur === jalur.value;
            return (
              <button
                key={jalur.value}
                type="button"
                onClick={() => setValue("jalurMasuk", jalur.value, { shouldValidate: true })}
                className={cn(
                  "flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-[#1B4F72] bg-[#1B4F72]/5"
                    : "border-border hover:border-[#1B4F72]/40"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                      isSelected ? "border-[#1B4F72]" : "border-muted-foreground"
                    )}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-[#1B4F72]" />
                    )}
                  </div>
                  <span className="font-semibold text-sm">{jalur.label}</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">{jalur.desc}</p>
              </button>
            );
          })}
        </div>
        {/* hidden input untuk register jalurMasuk */}
        <input type="hidden" {...register("jalurMasuk")} />
        {errors.jalurMasuk && (
          <p className="text-xs text-destructive">{errors.jalurMasuk.message}</p>
        )}
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
