"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { usePendaftaranFormStore } from "@/store/pendaftaran-form";
import { User, Fingerprint, MapPin, Phone, Mail, ArrowRight, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  nik: z.string().length(16, "NIK harus 16 digit"),
  tempatLahir: z.string().min(2, "Tempat lahir wajib diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  jenisKelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"]),
  agama: z.string().min(1, "Agama wajib diisi"),
  alamat: z.string().min(10, "Alamat minimal 10 karakter"),
  kota: z.string().min(2, "Kota wajib diisi"),
  provinsi: z.string().min(2, "Provinsi wajib diisi"),
  kodePos: z.string().optional(),
  noHp: z.string().min(10, "No HP minimal 10 digit"),
  email: z.string().email("Email tidak valid"),
});

export function StepDataPribadi() {
  const { dataPribadi, setDataPribadi, setStep } = usePendaftaranFormStore();
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nama: dataPribadi.nama || "",
      nik: dataPribadi.nik || "",
      tempatLahir: dataPribadi.tempatLahir || "",
      tanggalLahir: dataPribadi.tanggalLahir instanceof Date 
        ? dataPribadi.tanggalLahir.toISOString().split("T")[0] 
        : (typeof dataPribadi.tanggalLahir === 'string' ? dataPribadi.tanggalLahir.split("T")[0] : ""),
      jenisKelamin: dataPribadi.jenisKelamin as any || undefined,
      agama: dataPribadi.agama || "",
      alamat: dataPribadi.alamat || "",
      kota: dataPribadi.kota || "",
      provinsi: dataPribadi.provinsi || "",
      kodePos: dataPribadi.kodePos || "",
      noHp: dataPribadi.noHp || "",
      email: dataPribadi.email || "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    setDataPribadi(values);
    setStep(2);
  };

  const inputClass = "h-14 bg-black/20 border-[#2D2A26] rounded-2xl px-6 text-white text-lg focus:ring-2 focus:ring-[#EAC956]/30 focus:border-[#EAC956] transition-all font-light placeholder:text-[#6A685F]";
  const labelClass = "text-[10px] font-bold text-[#EAC956] uppercase tracking-widest ml-1 mb-2 block";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* NAMA */}
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem className="space-y-1 group">
                <FormLabel className={labelClass}>Nama Sesuai {field.value ? <Sparkles className="inline w-3 h-3 text-[#EAC956]"/> : "KTP"}</FormLabel>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
                  <FormControl>
                    <Input {...field} className={cn(inputClass, "pl-14")} placeholder="Ahmad Jalaluddin..." />
                  </FormControl>
                </div>
                <FormMessage className="text-red-400 text-[10px] uppercase font-bold tracking-tighter" />
              </FormItem>
            )}
          />

          {/* NIK */}
          <FormField
            control={form.control}
            name="nik"
            render={({ field }) => (
              <FormItem className="space-y-1 group">
                <FormLabel className={labelClass}>Nomor Induk Kependudukan</FormLabel>
                <div className="relative">
                  <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
                  <FormControl>
                    <Input {...field} maxLength={16} className={cn(inputClass, "pl-14")} placeholder="33xxxxxxxxxxxxxxx" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tempatLahir"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className={labelClass}>Tempat Lahir</FormLabel>
                  <FormControl>
                    <Input {...field} className={inputClass} placeholder="Kota lahir..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalLahir"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className={labelClass}>Tanggal Lahir</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className={cn(inputClass, "block")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="jenisKelamin"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className={labelClass}>Jenis Kelamin</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1C1A17] border-[#2D2A26] rounded-2xl text-white">
                      <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
                      <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agama"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className={labelClass}>Keyakinan / Agama</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1C1A17] border-[#2D2A26] rounded-2xl text-white">
                      {["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"].map(a => (
                         <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full">
            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className={labelClass}>Alamat Domisili Lengkap</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[120px] bg-black/20 border-[#2D2A26] rounded-[32px] px-8 py-6 text-white text-lg focus:ring-2 focus:ring-[#EAC956]/30 focus:border-[#EAC956] transition-all font-light placeholder:text-[#6A685F]" placeholder="JL. Ahmad Yani No. 12..." />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:col-span-full">
             <FormField control={form.control} name="kota" render={({ field }) => (
                <FormItem className="space-y-1"><FormLabel className={labelClass}>Kota / Kab</FormLabel><FormControl><Input {...field} className={inputClass} /></FormControl></FormItem>
             )} />
             <FormField control={form.control} name="provinsi" render={({ field }) => (
                <FormItem className="space-y-1"><FormLabel className={labelClass}>Provinsi</FormLabel><FormControl><Input {...field} className={inputClass} /></FormControl></FormItem>
             )} />
             <FormField control={form.control} name="kodePos" render={({ field }) => (
                <FormItem className="space-y-1"><FormLabel className={labelClass}>Kode Pos</FormLabel><FormControl><Input {...field} className={inputClass} /></FormControl></FormItem>
             )} />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1 group">
                <FormLabel className={labelClass}>Email Aktif</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
                  <FormControl>
                    <Input {...field} type="email" className={cn(inputClass, "pl-14")} placeholder="anda@contoh.com" />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="noHp"
            render={({ field }) => (
              <FormItem className="space-y-1 group">
                <FormLabel className={labelClass}>WhatsApp Aktif / HP</FormLabel>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A685F] group-focus-within:text-[#EAC956] transition-colors" />
                  <FormControl>
                    <Input {...field} className={cn(inputClass, "pl-14")} placeholder="08xxxxxxxxxx" />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-10 border-t border-[#2D2A26]">
          <Button 
            type="submit" 
            className="h-16 px-12 bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-[24px] font-bold text-lg flex items-center gap-3 shadow-3xl hover:scale-105 transition-all"
          >
            Lanjut ke Pendidikan <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
