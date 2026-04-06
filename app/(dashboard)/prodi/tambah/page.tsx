"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  BookOpen, 
  Fingerprint, 
  Layers, 
  Users, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TambahProdiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    jenjang: "S1",
    kuota: "100",
    aktif: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/prodi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menambah prodi");
      }

      toast.success("Program Studi Berhasil Ditambahkan!");
      router.push("/prodi");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-40">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8 border-b border-[#2D2A26] pb-12">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-[#6A685F] hover:text-[#EAC956] transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali
          </button>
          
          <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#EAC956]/20 ring-1 ring-[#EAC956]/10 shadow-[0_0_15px_rgba(234,201,86,0.1)]">
            <BookOpen className="w-4 h-4" />
            Manajemen Akademik
          </div>
          <h1 className="text-6xl text-white font-normal uppercase tracking-[-0.04em]">Tambah Prodi</h1>
          <p className="text-xl text-[#D2CEBE] font-light italic opacity-80 leading-relaxed max-w-lg">Inisialisasi program studi baru untuk sistem pendaftaran mahasiswa.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* LEFT COLUMN: GUIDELINES */}
        <div className="col-span-1 space-y-8">
           <div className="bg-[#EAC956]/5 border border-[#EAC956]/10 p-8 rounded-[48px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#EAC956]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 text-[#EAC956]" /> Panduan Input
              </h4>
              <ul className="space-y-4 text-xs text-[#D2CEBE] font-light leading-relaxed">
                 <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-[#EAC956] rounded-full mt-1.5 shrink-0" /> Kode prodi bersifat unik dan tidak dapat diubah setelah disimpan.</li>
                 <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-[#EAC956] rounded-full mt-1.5 shrink-0" /> Kuota akan menjadi pembatas otomatis pada landing page.</li>
                 <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-[#EAC956] rounded-full mt-1.5 shrink-0" /> Status aktif menentukan visibilitas di form pendaftaran.</li>
              </ul>
           </div>

           <div className="p-8 bg-[#1C1A17] border border-[#2D2A26] rounded-[48px] space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest ml-2">Status Publikasi</label>
                 <div 
                   onClick={() => setFormData({ ...formData, aktif: !formData.aktif })}
                   className={`h-14 rounded-2xl border flex items-center px-6 gap-4 cursor-pointer transition-all ${formData.aktif ? "bg-[#EAC956]/10 border-[#EAC956]/40 text-[#EAC956]" : "bg-white/5 border-white/10 text-[#6A685F]"}`}
                 >
                    {formData.aktif ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
                    <span className="font-bold uppercase tracking-tight">{formData.aktif ? "Aktif & Terbuka" : "Non-Aktif / Draft"}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* MAIN FORM */}
        <div className="col-span-1 md:col-span-2 space-y-10">
           <div className="bg-[#1C1A17] border border-[#2D2A26] rounded-[64px] p-12 lg:p-16 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#EAC956]/3 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
              
              <div className="space-y-12 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                          <Fingerprint className="w-3 h-3 text-[#EAC956]" /> Kode Prodi
                       </label>
                       <input 
                         required
                         type="text" 
                         value={formData.kode}
                         onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                         className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[#EAC956] transition-all font-light" 
                         placeholder="E.g. INF-S1"
                       />
                    </div>
                    
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                          <Layers className="w-3 h-3 text-[#EAC956]" /> Jenjang Studi
                       </label>
                       <select 
                         value={formData.jenjang}
                         onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                         className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[#EAC956] transition-all font-light appearance-none cursor-pointer"
                       >
                          <option value="S1">S1 (Sarjana)</option>
                          <option value="D3">D3 (Diploma)</option>
                          <option value="D4">D4 (Sarjana Terapan)</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                       <BookOpen className="w-3 h-3 text-[#EAC956]" /> Nama Program Studi
                    </label>
                    <input 
                      required
                      type="text" 
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[#EAC956] transition-all font-light" 
                      placeholder="Masukkan nama lengkap prodi"
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                       <Users className="w-3 h-3 text-[#EAC956]" /> Kapasitas Kuota (Pendaftar)
                    </label>
                    <div className="flex items-center gap-6">
                       <input 
                         required
                         type="number" 
                         value={formData.kuota}
                         onChange={(e) => setFormData({ ...formData, kuota: e.target.value })}
                         className="flex-1 bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl font-mono text-white focus:border-[#EAC956] transition-all" 
                       />
                       <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.2em]">MAX PER GELOMBANG</div>
                    </div>
                 </div>

                 <div className="pt-10 flex items-center justify-end">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-3xl px-12 h-16 font-bold shadow-3xl text-lg flex items-center gap-4 transition-all hover:scale-105"
                    >
                       {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                       SIMPAN PROGRAM STUDI
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
