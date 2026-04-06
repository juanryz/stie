"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Info,
  CheckCircle2,
  FileText,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Users,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
  }
};

export function LandingPageClient({ periode, prodiList, isPmbOpen, announcements }: any) {
  return (
    <div className="relative min-h-screen selection:bg-[#EAC956]/30 selection:text-[#EAC956]">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute top-0 left-0 w-full h-[1000px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#EAC956]/5 blur-[120px]" />
        <div className="absolute top-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-[#EAC956]/3 blur-[100px]" />
      </div>

      {/* HERO SECTION */}
      <section id="home" className="pt-28 pb-20 px-8 sm:px-16 lg:px-24">
        <motion.div 
           initial="hidden"
           animate="visible"
           variants={containerVariants}
           className="max-w-[1000px]"
        >
           <motion.div variants={itemVariants} className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-2 rounded-full text-sm font-semibold mb-10 border border-[#EAC956]/20 backdrop-blur-sm shadow-sm ring-1 ring-[#EAC956]/10">
             <span className="w-2.5 h-2.5 rounded-full bg-[#EAC956] animate-pulse shadow-[0_0_8px_rgba(234,201,86,0.8)]"></span>
             Penerimaan Mahasiswa Baru 2025/2026 Dibuka
           </motion.div>

           <motion.h1 variants={itemVariants} className="text-[64px] sm:text-[92px] leading-[0.95] font-normal tracking-[-0.04em] text-white mb-8">
             Cetak Masa Depan <br/>
             <span className="text-[#EAC956] font-medium italic">Gemilang</span> di STIE.
           </motion.h1>
           
           <motion.p variants={itemVariants} className="text-[20px] sm:text-[26px] text-[#D2CEBE] mb-14 max-w-[720px] leading-relaxed font-light tracking-wide">
             Kampus pencetak profesional unggul di bidang <span className="text-white font-normal underline decoration-[#EAC956]/40 underline-offset-4">Manajemen</span> dan <span className="text-white font-normal underline decoration-[#EAC956]/40 underline-offset-4">Akuntansi</span>. Sistem pendaftaran 100% online yang transparan dan akuntabel.
           </motion.p>

           <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
             <Link href="/register">
               <Button className="bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] h-16 rounded-full px-12 text-[20px] font-semibold transition-all w-full sm:w-auto shadow-[0_10px_30px_rgba(234,201,86,0.2)] hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2">
                  Daftar Sekarang <ArrowRight className="w-5 h-5" />
               </Button>
             </Link>
             <Link href="/login">
               <Button variant="outline" className="border-[#6A685F]/50 text-[#EAC956] bg-transparent hover:bg-[#2B2A23] h-16 rounded-full px-12 text-[20px] font-medium transition-all w-full sm:w-auto backdrop-blur-sm">
                  Masuk Portal
               </Button>
             </Link>
           </motion.div>
        </motion.div>
      </section>

      {/* VISUAL FEATURE GRID */}
      <section className="px-8 sm:px-16 lg:px-24 pb-28">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="h-[480px] rounded-[40px] bg-[#111111] bg-[url('/images/hero_student.png')] bg-cover bg-center p-10 flex flex-col justify-end relative overflow-hidden group border border-[#2D2A26] shadow-2xl transition-all hover:border-[#EAC956]/30">
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/20 transition-all duration-500"></div>
             
             <div className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-8px]">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-12 h-[2px] bg-[#EAC956]"></div>
                 <span className="text-[#EAC956] text-sm font-bold uppercase tracking-[0.2em]">Kualitas Terjamin</span>
               </div>
               <h3 className="text-4xl font-normal text-white mb-3">Lulusan Kompetitif</h3>
               <p className="text-[#D2CEBE] text-lg font-light leading-relaxed max-w-sm">Siap bersaing di industri global dengan sertifikasi standar internasional.</p>
             </div>
             
             <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:rotate-45 duration-500">
                <ArrowUpRight className="text-white w-6 h-6" />
             </div>
          </div>
          
          <div className="h-[480px] rounded-[40px] bg-[#111111] bg-[url('/images/hero_campus.png')] bg-cover bg-center p-10 flex flex-col justify-between overflow-hidden group border border-[#2D2A26] shadow-2xl relative transition-all hover:border-[#EAC956]/30">
             <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-500"></div>
             
             <div className="flex justify-between items-start relative z-10">
                <div className="bg-[#EAC956] text-[#3A2E00] px-5 py-2 rounded-full text-xs font-bold shadow-xl tracking-tighter uppercase">Akreditasi Baik</div>
                <div className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 text-white">
                  <Info className="w-6 h-6" />
                </div>
             </div>
             <div className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-8px]">
               <h3 className="text-4xl font-normal text-white mb-3 drop-shadow-md">Kurikulum Adaptif</h3>
               <p className="text-[#E6E1E5] text-lg font-light leading-relaxed max-w-sm drop-shadow-md">Materi ajar yang terus diperbarui mengikuti tren teknologi dan bisnis masa kini.</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* PRODI SECTION */}
      <section id="prodi" className="px-8 sm:px-16 lg:px-24 py-32 bg-[#14130F] border-t border-[#2D2A26] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EAC956]/2 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
          <div>
            <h2 className="text-14 sm:text-lg text-[#EAC956] font-semibold tracking-[0.3em] uppercase mb-4">Program Studi</h2>
            <h3 className="text-5xl text-white font-normal tracking-tight">Pilih Masa Depanmu</h3>
          </div>
          <p className="text-[#D2CEBE] max-w-md font-light leading-relaxed">Tersedia program unggulan yang disesuaikan dengan minat dan bakat profesional Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {prodiList && prodiList.length > 0 ? (
            prodiList.map((prodi: any, idx: number) => (
              <motion.div 
                key={prodi.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group bg-[#1C1A17] hover:bg-[#2B2A23] p-10 rounded-[36px] border border-[#2D2A26] hover:border-[#EAC956]/40 transition-all duration-300 relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAC956]/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
                
                <div className="flex flex-col h-full">
                  <div className="mb-10 inline-flex">
                    <span className="bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-xl text-xs font-bold ring-1 ring-[#EAC956]/20 uppercase tracking-wider">{prodi.jenjang}</span>
                  </div>
                  
                  <h3 className="text-[28px] leading-tight text-white font-normal mb-10 group-hover:text-[#EAC956] transition-colors">{prodi.nama.replace(/^S1 |^D3 /, "")}</h3>
                  
                  <div className="mt-auto pt-8 border-t border-[#2D2A26]">
                    <div className="flex justify-between items-center text-sm mb-4">
                       <div className="flex items-center gap-2 text-[#D2CEBE]">
                         <Users className="w-4 h-4 text-[#EAC956]" />
                         <span>Sisa Kuota</span>
                       </div>
                       <span className="font-bold text-[#EAC956] bg-[#EAC956]/10 px-2.5 py-0.5 rounded-lg border border-[#EAC956]/20">{prodi.kuota - prodi._count.pendaftar}</span>
                    </div>
                    <div className="h-2 w-full bg-[#33312A] rounded-full overflow-hidden mb-1">
                       <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(Math.round((prodi._count.pendaftar / prodi.kuota) * 100), 100)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#EAC956] to-[#FCE68A] rounded-full shadow-[0_0_12px_rgba(234,201,86,0.3)] relative"
                       >
                         <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]" />
                       </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-[#D2CEBE] border-2 border-dashed border-[#2D2A26] rounded-[40px] font-light">Data program studi sedang dimuat...</div>
          )}
        </div>
      </section>

      {/* JALUR & SYARAT */}
      <section id="jalur" className="px-8 sm:px-16 lg:px-24 py-32 bg-[#1C1A17] relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
             <h2 className="text-lg text-[#EAC956] font-semibold tracking-[0.3em] uppercase mb-4">Alur Masuk</h2>
             <h3 className="text-5xl text-white mb-8 font-normal tracking-tight">Kualifikasi Pendaftaran</h3>
             <p className="text-xl text-[#D2CEBE] mb-12 max-w-lg font-light leading-relaxed">Sistem penerimaan yang dirancang komprehensif untuk menjaring bibit unggul masa depan Indonesia.</p>
             
             <div className="space-y-6">
                {[
                  { N: "01", title: "Lulusan SMA/SMK", desc: "Menerima lulusan baru maupun gap year dari seluruh sekolah terakreditasi." },
                  { N: "02", title: "Kelengkapan Berkas", desc: "Proses verifikasi dokumen digital yang aman dan terjaga kerahasiaannya." },
                  { N: "03", title: "Tes Potensi Akademik", desc: "Evaluasi berbasis CBT untuk mengukur kemampuan dasar calon mahasiswa." },
                ].map((q, idx) => (
                   <motion.div 
                     key={q.N} 
                     initial={{ opacity: 0, x: -30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: idx * 0.2 }}
                     className="flex gap-8 items-center bg-[#2B2A23]/50 p-8 rounded-[32px] border border-[#2D2A26] hover:bg-[#2B2A23] transition-colors group"
                   >
                     <div className="text-[#EAC956] font-bold text-3xl group-hover:rotate-12 transition-transform">{q.N}</div>
                     <div>
                       <h4 className="text-white text-[22px] mb-2 font-medium">{q.title}</h4>
                       <p className="text-[#D2CEBE] font-light leading-snug">{q.desc}</p>
                     </div>
                   </motion.div>
                ))}
             </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#EAC956] rounded-[48px] p-12 sm:p-20 text-[#3A2E00] flex flex-col justify-center relative overflow-hidden shadow-[0_40px_80px_rgba(234,201,86,0.15)] group"
          >
             <div className="absolute -bottom-20 -right-20 opacity-10 group-hover:scale-110 group-hover:-translate-x-5 group-hover:-translate-y-5 transition-all duration-700">
                 <FileText className="w-[400px] h-[400px] text-[#3A2E00]" />
             </div>
             
             <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-xl flex items-center justify-center mb-10 shadow-inner">
                <FileText className="w-10 h-10 text-[#3A2E00]" />
             </div>
             
             <h3 className="text-5xl font-bold mb-8 relative z-10 tracking-tight leading-tight">Dokumen Pendaftaran</h3>
             <p className="text-[#5A4800] text-lg mb-10 relative z-10 font-medium max-w-sm">Siapkan dokumen pendukung dalam format PDF atau gambar berkualitas tinggi.</p>
             
             <ul className="space-y-6 mb-16 relative z-10 font-semibold text-xl">
               <li className="flex gap-4 items-center"><div className="w-8 h-8 rounded-full bg-[#5A4800]/10 flex items-center justify-center shrink-0"><CheckCircle2 className="text-[#5A4800] w-5 h-5" /></div> Kartu Identitas (KTP/KIA)</li>
               <li className="flex gap-4 items-center"><div className="w-8 h-8 rounded-full bg-[#5A4800]/10 flex items-center justify-center shrink-0"><CheckCircle2 className="text-[#5A4800] w-5 h-5" /></div> Akta Kelahiran & KK</li>
               <li className="flex gap-4 items-center"><div className="w-8 h-8 rounded-full bg-[#5A4800]/10 flex items-center justify-center shrink-0"><CheckCircle2 className="text-[#5A4800] w-5 h-5" /></div> Ijazah / SKL Legalisir</li>
             </ul>

             <Link href="/register" className="relative z-10">
               <Button className="bg-[#111111] hover:bg-[#000000] text-[#EAC956] h-16 rounded-full px-12 text-xl font-bold w-full sm:w-auto shadow-2xl transition-all hover:scale-[1.05] flex items-center justify-center gap-3">
                  Unggah Dokumen <ArrowRight className="w-6 h-6" />
               </Button>
             </Link>
          </motion.div>
        </div>
      </section>

       {/* ANNOUNCEMENTS SECTION */}
       {announcements && announcements.length > 0 && (
         <section id="announcements" className="px-8 sm:px-16 lg:px-24 py-32 bg-[#14130F] border-t border-[#2D2A26] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EAC956]/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
               <div>
                  <h2 className="text-lg text-[#EAC956] font-semibold tracking-[0.3em] uppercase mb-4">Informasi Terbaru</h2>
                  <h3 className="text-5xl text-white font-normal tracking-tight">Berita & Pengumuman</h3>
               </div>
               <Link href="/pengumuman" className="text-[#D2CEBE] font-medium hover:text-white transition-colors flex items-center gap-2">
                  Lihat Seluruh Informasi <ArrowRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
               {Array.isArray(announcements) && announcements.map((item: any, idx: number) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-[#1C1A17] hover:bg-[#2B2A23] rounded-[40px] border border-[#2D2A26] hover:border-[#EAC956]/40 transition-all flex flex-col p-8 lg:p-10 shadow-xl overflow-hidden"
                  >
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-[#EAC956]/10 flex items-center justify-center">
                           <Bell className={`w-5 h-5 ${item.pin ? "text-[#EAC956] animate-pulse" : "text-[#D2CEBE]"}`} />
                        </div>
                        <span className="text-[10px] font-bold text-[#6A685F] group-hover:text-[#D2CEBE] transition-colors">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                     </div>

                     {item.gambarUrls && item.gambarUrls.length > 0 && (
                        <div className="mb-8 rounded-[28px] overflow-hidden border border-[#2D2A26] relative h-48 w-full">
                           <img src={item.gambarUrls[0]} alt={item.judul} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                     )}

                     <h4 className="text-2xl text-white font-normal mb-6 group-hover:text-[#EAC956] transition-colors line-clamp-2 md:h-[60px] leading-tight">{item.judul}</h4>
                     
                     <div className="mt-auto pt-6 border-t border-[#2D2A26] flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#EAC956] bg-[#EAC956]/5 px-3 py-1 rounded-lg border border-[#EAC956]/20 uppercase tracking-widest">{item.kategori}</span>
                        <div className="w-8 h-8 rounded-full border border-[#2D2A26] flex items-center justify-center text-[#D2CEBE] group-hover:bg-[#EAC956] group-hover:text-[#3A2E00] group-hover:border-[#EAC956] transition-all">
                           <ArrowUpRight className="w-4 h-4" />
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </section>
       )}

      {/* FOOTER */}
      <footer className="px-8 sm:px-16 lg:px-24 py-16 border-t border-[#2D2A26] bg-[#111111] relative">
         <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-4 group">
               <div className="p-0.5 bg-[#EAC956]/10 rounded-2xl group-hover:bg-[#EAC956]/20 transition-colors w-14 h-14 overflow-hidden shadow-lg border border-white/5">
                  <img src="/images/logo.jpg" className="w-full h-full object-cover" />
               </div>
               <div>
                  <h4 className="text-white font-bold text-xl tracking-tight">STIE Anindyaguna</h4>
                  <p className="text-[#D2CEBE] text-sm font-light uppercase tracking-widest">Portal PMB Online</p>
               </div>
            </div>
            
            <div className="flex gap-10 text-sm text-[#D2CEBE] font-medium">
               <a href="#" className="hover:text-[#EAC956] transition-colors">Syarat & Ketentuan</a>
               <a href="#" className="hover:text-[#EAC956] transition-colors">Hubungi Kami</a>
            </div>

            <div className="text-[#D2CEBE] text-sm font-light">
               &copy; {new Date().getFullYear()} STIE PMB. <span className="bg-[#EAC956]/10 text-[#EAC956] px-3 py-1 rounded-full text-[10px] font-bold ml-2">M3 DARK AMBER</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
