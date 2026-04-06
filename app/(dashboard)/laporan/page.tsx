"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Download, Calendar, Filter, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function LaporanPage() {
  return (
    <div className="p-8 lg:p-12 max-w-[1400px] mx-auto min-h-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
           <div className="flex items-center gap-3 mb-4 text-[#EAC956]">
             <BarChart3 className="w-8 h-8" />
             <span className="text-sm font-bold tracking-[0.2em] uppercase">Pusat Data</span>
           </div>
           <h1 className="text-5xl text-white font-normal tracking-tight mb-2">Laporan & Statistik</h1>
           <p className="text-[#D2CEBE] font-light italic">Analisis real-time pendaftar mahasiswa baru 2025/2026</p>
        </div>
        
        <div className="flex gap-3">
           <Button variant="outline" className="border-[#2D2A26] text-[#D2CEBE] hover:bg-[#2B2A23] rounded-2xl flex items-center gap-2">
             <Filter className="w-4 h-4" /> Filter
           </Button>
           <Button className="bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-2xl flex items-center gap-2 font-bold px-6 shadow-xl shadow-[#EAC956]/10">
             <Download className="w-4 h-4" /> Export CSV
           </Button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* STAT CARDS */}
        {[
          { label: "Rasio Konversi", value: "84.2%", icon: TrendingUp, trend: "+2.4% MoM", color: "text-[#EAC956]" },
          { label: "Target Kuota", value: "625/800", icon: Users, trend: "78% Terpenuhi", color: "text-blue-400" },
          { label: "Lulus Administrasi", value: "412", icon: CheckCircle2, trend: "Verifikasi Cepat", color: "text-green-400" },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="bg-[#2B2A23]/50 border border-[#2D2A26] p-8 rounded-[32px] hover:bg-[#2B2A23] transition-colors group relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#EAC956]/5 rounded-bl-[60px]" />
             <stat.icon className={`w-8 h-8 ${stat.color} mb-6`} />
             <p className="text-[#D2CEBE] text-sm font-medium uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-4xl text-white font-light group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>
             <p className={`mt-4 text-xs font-bold ${stat.color} bg-white/5 inline-block px-3 py-1 rounded-full`}>{stat.trend}</p>
          </motion.div>
        ))}

        {/* CHART PLACEHOLDER 1 */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#1C1A17] border border-[#2D2A26] rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl text-white font-normal">Tren Pendaftaran Mingguan</h3>
              <div className="flex items-center gap-2 text-xs text-[#D2CEBE] bg-[#2B2A23] px-4 py-2 rounded-xl">
                 <Calendar className="w-4 h-4" /> Terakhir: April 2026
              </div>
           </div>

           <div className="h-64 flex items-end gap-3 lg:gap-6">
              {[40, 65, 30, 85, 55, 95, 70, 45, 60, 35].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                   <div 
                    className="w-full bg-[#2B2A23] rounded-t-xl relative overflow-hidden transition-all duration-700 hover:bg-[#EAC956]/20" 
                    style={{ height: `${h}%` }}
                   >
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#EAC956] to-[#FCE68A] group-hover:opacity-100 opacity-80" 
                      />
                   </div>
                   <span className="text-[10px] text-[#6A685F] group-hover:text-[#EAC956] font-medium">M{i+1}</span>
                </div>
              ))}
           </div>
        </motion.div>

        {/* RECENT RECORDS */}
        <motion.div variants={itemVariants} className="bg-[#1C1A17] border border-[#2D2A26] rounded-[40px] p-10">
           <h3 className="text-2xl text-white font-normal mb-8">Distribusi Prodi</h3>
           <div className="space-y-6">
              {[
                { name: "Manajemen S1", count: 184, p: 45, color: "bg-[#EAC956]" },
                { name: "Akuntansi S1", count: 126, p: 30, color: "bg-blue-400" },
                { name: "Manajemen D3", count: 68, p: 15, color: "bg-green-400" },
                { name: "Lainnya", count: 34, p: 10, color: "bg-purple-400" },
              ].map((p, i) => (
                 <div key={i} className="space-y-2 group">
                    <div className="flex justify-between text-sm">
                       <span className="text-white group-hover:text-[#EAC956] transition-colors">{p.name}</span>
                       <span className="text-[#D2CEBE] font-bold">{p.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#2B2A23] rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${p.p}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`h-full ${p.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} 
                       />
                    </div>
                 </div>
              ))}
           </div>
           
           <div className="mt-12 p-6 rounded-3xl bg-[#2B2A23]/30 border border-[#2D2A26] text-center italic text-[#D2CEBE] text-sm">
              Laporan otomatis diperbarui setiap 15 menit.
           </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
