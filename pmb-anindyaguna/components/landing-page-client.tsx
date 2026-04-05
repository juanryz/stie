"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Info,
  CheckCircle2,
  FileText,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingPageClient({ periode, prodiList, isPmbOpen }: any) {
  return (
    <>
      {/* HERO SECTION MATCHING material.io/m3 */}
      <section className="pt-24 pb-20 px-8 sm:px-16 lg:px-24">
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="max-w-[900px]"
        >
           <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-[#EAC956]/20">
             <span className="w-2 h-2 rounded-full bg-[#EAC956] animate-pulse"></span>
             Penerimaan Mahasiswa Baru 2025/2026 Dibuka
           </div>

           <h1 className="text-[60px] sm:text-[80px] leading-[1.05] font-normal tracking-[-0.02em] text-white mb-6">
             STIE <br/> Anindyaguna
           </h1>
           
           <p className={`text-[20px] sm:text-[24px] text-[#D2CEBE] mb-12 max-w-[700px] leading-relaxed font-normal`}>
             Masa depan dimulai dari sini. Kampus pencetak profesional unggul di bidang Manajemen dan Akuntansi. Sistem pendaftaran 100% online, cepat, dan transparan.
           </p>

           <div className="flex flex-col sm:flex-row gap-4">
             <Link href="/register">
               <Button className={`bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] h-14 rounded-full px-10 text-[18px] font-medium transition-colors w-full sm:w-auto shadow-xl`}>
                  Mulai Pendaftaran
               </Button>
             </Link>
             <Link href="/login">
               <Button variant="outline" className={`border-[#6A685F] text-[#EAC956] bg-transparent hover:bg-[#2B2A23] h-14 rounded-full px-10 text-[18px] font-medium transition-colors w-full sm:w-auto`}>
                  Masuk ke Dasbor
               </Button>
             </Link>
           </div>
        </motion.div>
      </section>

      {/* VISUAL GRID (MIMICKING THE M3 IMAGES AT THE BOTTOM OF HERO) */}
      <section className="px-8 sm:px-16 lg:px-24 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="h-[400px] rounded-[32px] bg-[#111111] bg-[url('/images/hero_student.png')] bg-cover bg-center p-8 flex flex-col justify-end relative overflow-hidden group border border-[#494841]">
             {/* Dark gradient overlay to ensure text is readable */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
             
             <div className="relative z-10 transition-transform group-hover:translate-y-[-5px]">
               <h3 className="text-3xl font-normal text-[#F8F6F1] mb-2">Lulusan Kompetitif</h3>
               <p className="text-[#D2CEBE]">Menjadi profesional Siap Kerja</p>
             </div>
          </div>
          
          <div className="h-[400px] rounded-[32px] bg-[#111111] bg-[url('/images/hero_campus.png')] bg-cover bg-center p-8 flex flex-col justify-between overflow-hidden group border border-[#494841] relative">
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
             
             <div className="flex justify-between items-start relative z-10">
                <div className="bg-[#EAC956] text-[#3A2E00] px-3 py-1 rounded-full text-xs font-bold shadow-lg">INFO AKADEMIK</div>
                <Info className="text-white drop-shadow-md" />
             </div>
             <div className="relative z-10">
               <h3 className="text-2xl font-normal text-white mb-2 drop-shadow-lg">Kurikulum Standar Industri</h3>
               <p className="text-[#E6E1E5] drop-shadow-md">Kurikulum adaptif yang menyesuaikan perubahan.</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* PRODI SECTION */}
      <section id="prodi" className="px-8 sm:px-16 lg:px-24 py-24 bg-[#14130F] border-t border-[#2D2A26]">
        <h2 className="text-4xl text-white mb-12 font-normal">Pilih Program Studi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {prodiList && prodiList.length > 0 ? (
            prodiList.map((prodi: any) => (
              <div key={prodi.id} className="bg-[#2B2A23] p-8 rounded-[28px] border border-[#494841] hover:bg-[#33312A] transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAC956]/5 rounded-bl-[100px] -z-0" />
                <span className="bg-[#5A4800] text-[#FFDF99] px-3 py-1 rounded-full text-xs mb-4 inline-block relative z-10">{prodi.jenjang}</span>
                <h3 className="text-2xl text-white font-normal mb-8 relative z-10">{prodi.nama.replace(/^S1 |^D3 /, "")}</h3>
                <div className="pt-4 border-t border-[#494841] relative z-10">
                  <div className="flex justify-between text-sm mb-2 text-[#D2CEBE]">
                     <span>Ketersediaan</span>
                     <span className="text-[#EAC956]">{prodi.kuota - prodi._count.pendaftar} Kursi</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1C1A17] rounded-full overflow-hidden">
                     <div className="h-full bg-[#EAC956] rounded-full shadow-[0_0_8px_rgba(234,201,86,0.5)]" style={{ width: `${Math.min(Math.round((prodi._count.pendaftar / prodi.kuota) * 100), 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-[#D2CEBE]">Data program studi sedang dimuat...</div>
          )}
        </div>
      </section>

      {/* JALUR & SYARAT */}
      <section id="jalur" className="px-8 sm:px-16 lg:px-24 py-24 bg-[#1C1A17]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
             <h2 className="text-4xl text-white mb-8 font-normal">Kualifikasi Pendaftaran</h2>
             <p className="text-xl text-[#D2CEBE] mb-8 max-w-lg">Sistem penerimaan dirancang transparan dengan standar kompetitif.</p>
             
             <div className="space-y-4">
                {[
                  { N: "01", title: "Lulusan SMA/SMK", desc: "Berlaku untuk semua tahun kelulusan jenjang sederajat." },
                  { N: "02", title: "Kelengkapan Berkas", desc: "Pastikan dokumen format PDF & JPG tidak melebihi batas." },
                  { N: "03", title: "Tes Potensi", desc: "Dilakukan menggunakan Computer Based Test online." },
                ].map(q => (
                   <div key={q.N} className="flex gap-6 items-start bg-[#2B2A23] p-6 rounded-[24px]">
                     <div className="text-[#EAC956] font-bold text-2xl">{q.N}</div>
                     <div>
                       <h4 className="text-white text-xl mb-1">{q.title}</h4>
                       <p className="text-[#D2CEBE]">{q.desc}</p>
                     </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="bg-[#EAC956] rounded-[32px] p-10 sm:p-14 text-[#3A2E00] flex flex-col justify-center relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 opacity-10">
                 <FileText className="w-80 h-80 text-[#3A2E00]" />
             </div>
             
             <FileText className="w-16 h-16 mb-8 text-[#5A4800] relative z-10" />
             <h3 className="text-4xl font-semibold mb-6 relative z-10">Dokumen Wajib</h3>
             <ul className="space-y-4 mb-12 relative z-10 font-medium">
               <li className="flex gap-3"><CheckCircle2 className="text-[#5A4800] shrink-0" /> Kartu Pelajar / KTP</li>
               <li className="flex gap-3"><CheckCircle2 className="text-[#5A4800] shrink-0" /> Akta Kelahiran dan KK</li>
               <li className="flex gap-3"><CheckCircle2 className="text-[#5A4800] shrink-0" /> Transkrip / SKL Sekolah</li>
             </ul>
             <Link href="/register" className="relative z-10">
               <Button className="bg-[#3A2E00] hover:bg-[#111111] text-[#EAC956] h-14 rounded-full px-8 text-lg w-full sm:w-auto shadow-xl">
                  Unggah Dokumen Area
               </Button>
             </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 sm:px-16 lg:px-24 py-12 border-t border-[#2D2A26] flex flex-col md:flex-row justify-between items-center gap-6 bg-[#1C1A17]">
         <div className="flex items-center gap-3 text-white">
            <GraduationCap className="w-6 h-6 text-[#EAC956]" />
            <span className="font-medium text-[#EAC956]">STIE Anindyaguna</span>
         </div>
         <div className="text-[#D2CEBE] text-sm">
            &copy; {new Date().getFullYear()} STIE PMB Online. Dark Amber M3 Theme.
         </div>
      </footer>
    </>
  );
}
