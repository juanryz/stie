"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepIndicator } from "@/components/forms/step-indicator";
import { StepDataPribadi } from "@/components/forms/step-data-pribadi";
import { StepDataPendidikan } from "@/components/forms/step-data-pendidikan";
import { StepDataOrangTua } from "@/components/forms/step-data-orangtua";
import { StepDataProgram } from "@/components/forms/step-data-program";
import { StepUploadDokumen } from "@/components/forms/step-upload-dokumen";
import { StepReview } from "@/components/forms/step-review";
import { usePendaftaranFormStore } from "@/store/pendaftaran-form";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface Prodi {
  id: string;
  kode: string;
  nama: string;
  jenjang: string;
  kuota: number;
  sisaKuota: number;
}

const STEP_META = [
  { title: "Profil Pribadi", desc: "Verifikasi identitas berdasarkan KTP/Dukcapil" },
  { title: "Jejak Pendidikan", desc: "Informasi prestasi dan asal sekolah Anda" },
  { title: "Keluarga & Wali", desc: "Informasi kontak darurat orang tua/wali" },
  { title: "Program Studi", desc: "Pilih jurusan dan skema jalur masuk eksklusif" },
  { title: "Berkas Digital", desc: "Unggah bukti dokumen asli dalam format digital" },
  { title: "Review Terakhir", desc: "Validasi ulang seluruh data sebelum submisi" },
];

export function FormPendaftaran({ prodiList }: { prodiList: Prodi[] }) {
  const { step } = usePendaftaranFormStore();
  const meta = STEP_META[step - 1];

  return (
    <div className="space-y-12">
      <StepIndicator currentStep={step} />

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-[#1C1A17] border border-[#2D2A26] rounded-[56px] p-10 lg:p-16 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EAC956]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
        
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAC956]/10 text-[#EAC956] text-[10px] uppercase font-bold tracking-widest rounded-full border border-[#EAC956]/20 mb-6 group overflow-hidden">
             <div className="w-1.5 h-1.5 rounded-full bg-[#EAC956] animate-pulse" />
             Langkah {step} dari 6
          </div>
          <h2 className="text-4xl text-white font-normal mb-2 tracking-tight flex items-center gap-4">
             {meta?.title} 
             <Sparkles className="w-6 h-6 text-[#EAC956]" />
          </h2>
          <p className="text-xl text-[#D2CEBE] font-light italic">{meta?.desc}</p>
        </div>

        <div className="relative z-10 transition-all duration-500">
          {step === 1 && <StepDataPribadi />}
          {step === 2 && <StepDataPendidikan />}
          {step === 3 && <StepDataOrangTua />}
          {step === 4 && <StepDataProgram prodiList={prodiList} />}
          {step === 5 && <StepUploadDokumen />}
          {step === 6 && <StepReview prodiList={prodiList} />}
        </div>
      </motion.div>

      {/* Safety Footer */}
      <div className="px-10 py-6 bg-[#2B2A23]/30 border border-[#2D2A26] rounded-3xl flex items-center justify-between group">
         <div className="flex items-center gap-4 text-[#D2CEBE]">
            <ShieldCheck className="w-6 h-6 text-[#EAC956]" />
            <p className="text-sm font-light">Data Anda terenkripsi secara otomatis dan dilindungi oleh enkripsi SSL 256-bit.</p>
         </div>
      </div>
    </div>
  );
}
