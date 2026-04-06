"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  dataOrangTuaSchema,
  type DataOrangTuaInput,
} from "@/lib/validations/pendaftaran";
import { usePendaftaranFormStore } from "@/store/pendaftaran-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Semua field di langkah ini bersifat opsional.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nama Ayah */}
        <div className="space-y-1.5">
          <Label htmlFor="namaAyah">Nama Ayah</Label>
          <Input id="namaAyah" placeholder="Nama lengkap ayah" {...register("namaAyah")} />
        </div>

        {/* Nama Ibu */}
        <div className="space-y-1.5">
          <Label htmlFor="namaIbu">Nama Ibu</Label>
          <Input id="namaIbu" placeholder="Nama lengkap ibu" {...register("namaIbu")} />
        </div>

        {/* Pekerjaan Ortu */}
        <div className="space-y-1.5">
          <Label htmlFor="pekerjaanOrtu">Pekerjaan Orang Tua</Label>
          <Input id="pekerjaanOrtu" placeholder="Contoh: Wiraswasta" {...register("pekerjaanOrtu")} />
        </div>

        {/* No HP Ortu */}
        <div className="space-y-1.5">
          <Label htmlFor="noHpOrtu">No. HP Orang Tua</Label>
          <Input
            id="noHpOrtu"
            type="tel"
            placeholder="08xxxxxxxxxx"
            aria-invalid={!!errors.noHpOrtu}
            {...register("noHpOrtu")}
          />
          {errors.noHpOrtu && <p className="text-xs text-destructive">{errors.noHpOrtu.message}</p>}
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
