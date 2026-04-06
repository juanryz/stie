"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";

import {
  dataPribadiSchema,
  type DataPribadiInput,
} from "@/lib/validations/pendaftaran";
import { usePendaftaranFormStore } from "@/store/pendaftaran-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:opacity-50 aria-invalid:border-destructive";

export function StepDataPribadi() {
  const { dataPribadi, setDataPribadi, nextStep } = usePendaftaranFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataPribadiInput>({
    resolver: zodResolver(dataPribadiSchema),
    defaultValues: dataPribadi as DataPribadiInput,
  });

  function onSubmit(data: DataPribadiInput) {
    setDataPribadi(data);
    nextStep();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nama */}
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="nama">Nama Lengkap <span className="text-destructive">*</span></Label>
          <Input id="nama" placeholder="Sesuai KTP" aria-invalid={!!errors.nama} {...register("nama")} />
          {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
        </div>

        {/* NIK */}
        <div className="space-y-1.5">
          <Label htmlFor="nik">NIK <span className="text-destructive">*</span></Label>
          <Input id="nik" placeholder="16 digit angka" maxLength={16} aria-invalid={!!errors.nik} {...register("nik")} />
          {errors.nik && <p className="text-xs text-destructive">{errors.nik.message}</p>}
        </div>

        {/* Jenis Kelamin */}
        <div className="space-y-1.5">
          <Label htmlFor="jenisKelamin">Jenis Kelamin <span className="text-destructive">*</span></Label>
          <select id="jenisKelamin" className={cn(selectClass, errors.jenisKelamin && "border-destructive")} {...register("jenisKelamin")}>
            <option value="">— Pilih —</option>
            <option value="LAKI_LAKI">Laki-laki</option>
            <option value="PEREMPUAN">Perempuan</option>
          </select>
          {errors.jenisKelamin && <p className="text-xs text-destructive">{errors.jenisKelamin.message}</p>}
        </div>

        {/* Tempat Lahir */}
        <div className="space-y-1.5">
          <Label htmlFor="tempatLahir">Tempat Lahir <span className="text-destructive">*</span></Label>
          <Input id="tempatLahir" placeholder="Kota" aria-invalid={!!errors.tempatLahir} {...register("tempatLahir")} />
          {errors.tempatLahir && <p className="text-xs text-destructive">{errors.tempatLahir.message}</p>}
        </div>

        {/* Tanggal Lahir */}
        <div className="space-y-1.5">
          <Label htmlFor="tanggalLahir">Tanggal Lahir <span className="text-destructive">*</span></Label>
          <Input id="tanggalLahir" type="date" aria-invalid={!!errors.tanggalLahir} {...register("tanggalLahir")} />
          {errors.tanggalLahir && <p className="text-xs text-destructive">{errors.tanggalLahir.message}</p>}
        </div>

        {/* Agama */}
        <div className="space-y-1.5">
          <Label htmlFor="agama">Agama <span className="text-destructive">*</span></Label>
          <select id="agama" className={cn(selectClass, errors.agama && "border-destructive")} {...register("agama")}>
            <option value="">— Pilih —</option>
            {["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          {errors.agama && <p className="text-xs text-destructive">{errors.agama.message}</p>}
        </div>

        {/* Alamat */}
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="alamat">Alamat Lengkap <span className="text-destructive">*</span></Label>
          <textarea
            id="alamat"
            rows={2}
            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
            className={cn("w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm resize-none outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 placeholder:text-muted-foreground", errors.alamat && "border-destructive")}
            {...register("alamat")}
          />
          {errors.alamat && <p className="text-xs text-destructive">{errors.alamat.message}</p>}
        </div>

        {/* Kota */}
        <div className="space-y-1.5">
          <Label htmlFor="kota">Kota <span className="text-destructive">*</span></Label>
          <Input id="kota" placeholder="Kota/Kabupaten" aria-invalid={!!errors.kota} {...register("kota")} />
          {errors.kota && <p className="text-xs text-destructive">{errors.kota.message}</p>}
        </div>

        {/* Provinsi */}
        <div className="space-y-1.5">
          <Label htmlFor="provinsi">Provinsi <span className="text-destructive">*</span></Label>
          <Input id="provinsi" placeholder="Provinsi" aria-invalid={!!errors.provinsi} {...register("provinsi")} />
          {errors.provinsi && <p className="text-xs text-destructive">{errors.provinsi.message}</p>}
        </div>

        {/* Kode Pos */}
        <div className="space-y-1.5">
          <Label htmlFor="kodePos">Kode Pos</Label>
          <Input id="kodePos" placeholder="5 digit" maxLength={5} aria-invalid={!!errors.kodePos} {...register("kodePos")} />
          {errors.kodePos && <p className="text-xs text-destructive">{errors.kodePos.message}</p>}
        </div>

        {/* No HP */}
        <div className="space-y-1.5">
          <Label htmlFor="noHp">No. HP Aktif <span className="text-destructive">*</span></Label>
          <Input id="noHp" type="tel" placeholder="08xxxxxxxxxx" aria-invalid={!!errors.noHp} {...register("noHp")} />
          {errors.noHp && <p className="text-xs text-destructive">{errors.noHp.message}</p>}
        </div>

        {/* Email */}
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="email">Email Aktif <span className="text-destructive">*</span></Label>
          <Input id="email" type="email" placeholder="nama@email.com" aria-invalid={!!errors.email} {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" className="bg-[#1B4F72] hover:bg-[#154060] gap-2">
          Lanjut <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
