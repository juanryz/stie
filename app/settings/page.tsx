"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Laptop, 
  Palette, 
  Save, 
  Search,
  ChevronRight,
  Upload,
  Loader2,
  Trash2,
  LogOut,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function UnifiedSettingsPage() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  
  const [activeTab, setActiveTab] = useState("Profil");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState({
    id: "",
    namaInstansi: "STIE Anindyaguna Semarang",
    emailKontak: "admin@stie-anindyaguna.ac.id",
    logoUrl: null as string | null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
       redirect("/login");
    }
    if (isAdmin) {
       fetchSettings();
    } else {
       setLoading(false);
    }
  }, [status, isAdmin]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.id) {
        setConfig(json);
      }
    } catch (error) {
      toast.error("Gagal memuat pengaturan.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        toast.success("Pengaturan berhasil disimpan!");
      }
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({ ...config, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return null;

  // RENDER PENDAFTAR VIEW
  if (!isAdmin) {
     return (
        <div className="max-w-4xl mx-auto pb-32">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-[#2D2A26] pb-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#EAC956]/20 ring-1 ring-[#EAC956]/10">
                <Settings className="w-4 h-4" />
                Setelan Akun
              </div>
              <h1 className="text-6xl text-white font-normal tracking-tighter uppercase whitespace-nowrap">Pengelolaan Profil</h1>
              <p className="text-xl text-[#D2CEBE] font-light italic">Atur keamanan akun dan preferensi Portal PMB Anda.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 col-span-1">
                <button className="w-full flex items-center gap-4 bg-[#EAC956] text-[#3A2E00] px-8 py-5 rounded-[32px] font-bold shadow-2xl">
                  <User className="w-6 h-6" /> Informasi Akun
                </button>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-8">
                <div className="bg-[#1C1A17] border border-[#2D2A26] rounded-[56px] p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#EAC956]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                  <div className="space-y-10">
                      <div className="border-b border-[#2D2A26] pb-6">
                        <p className="text-[10px] font-bold text-[#EAC956] uppercase tracking-widest mb-1">Nama Pengguna</p>
                        <p className="text-xl text-white font-light italic">{session?.user?.name}</p>
                      </div>
                      <div className="border-b border-[#2D2A26] pb-6">
                        <p className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest mb-1">Email Registrasi</p>
                        <p className="text-xl text-white font-light italic opacity-60">{session?.user?.email}</p>
                      </div>
                  </div>
                  <div className="mt-12 pt-10 border-t border-[#2D2A26] flex items-center justify-between">
                      <Button onClick={() => signOut({ callbackUrl: "/" })} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl h-14 px-8 font-bold flex items-center gap-3 transition-all">
                        <LogOut className="w-5 h-5" /> Keluar Sesi
                      </Button>
                  </div>
                </div>
            </div>
          </div>
        </div>
     );
  }

  // RENDER ADMIN VIEW
  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#2D2A26] pb-8">
        <div>
          <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-[#EAC956]/20">
            <Globe className="w-4 h-4" />
            System Global Settings
          </div>
          <h1 className="text-4xl text-white font-normal tracking-tighter">Pengaturan Sistem</h1>
          <p className="text-[#D2CEBE] font-light mt-1 italic">Sesuaikan identitas dan parameter global aplikasi Anda.</p>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSubmitting}
          className="bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-2xl px-8 h-12 font-bold shadow-2xl transition-all flex items-center gap-2 group"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* SIDEBAR TABS */}
        <div className="lg:col-span-1 space-y-2">
          {["Profil", "Keamanan", "Integrasi", "Tampilan"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
                activeTab === tab 
                  ? "bg-[#EAC956] text-[#3A2E00] font-bold shadow-xl" 
                  : "bg-[#1C1A17] text-[#D2CEBE] border border-[#2D2A26] hover:bg-[#2B2A23]"
              }`}
            >
              <div className="flex items-center gap-3">
                {tab === "Profil" && <User className="w-5 h-5" />}
                {tab === "Keamanan" && <ShieldCheck className="w-5 h-5" />}
                {tab === "Integrasi" && <Globe className="w-5 h-5" />}
                {tab === "Tampilan" && <Palette className="w-5 h-5" />}
                <span className="text-sm tracking-wide">{tab}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeTab === tab ? "rotate-90" : "group-hover:translate-x-1"}`} />
            </button>
          ))}
        </div>

        {/* CONTENT TABS */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1C1A17] border border-[#2D2A26] rounded-[48px] p-10 lg:p-14 relative overflow-hidden"
            >
              {activeTab === "Profil" && (
                <div className="space-y-12">
                   <div>
                      <h3 className="text-2xl text-white font-normal mb-8 flex items-center gap-3">
                         <div className="w-1.5 h-6 bg-[#EAC956] rounded-full" />
                         Identitas Institusi
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#6A685F] uppercase tracking-[0.2em] ml-1">Nama Instansi</label>
                            <input 
                              type="text" 
                              value={config.namaInstansi}
                              onChange={(e) => setConfig({ ...config, namaInstansi: e.target.value })}
                              className="w-full bg-[#2B2A23]/50 border border-[#2D2A26] rounded-2xl h-14 px-6 text-white focus:border-[#EAC956] focus:ring-1 focus:ring-[#EAC956]/30 transition-all font-light" 
                              placeholder="Masukkan nama instansi"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#6A685F] uppercase tracking-[0.2em] ml-1">Email Kontak Utama</label>
                            <input 
                              type="email" 
                              value={config.emailKontak}
                              onChange={(e) => setConfig({ ...config, emailKontak: e.target.value })}
                              className="w-full bg-[#2B2A23]/50 border border-[#2D2A26] rounded-2xl h-14 px-6 text-white focus:border-[#EAC956] focus:ring-1 focus:ring-[#EAC956]/30 transition-all font-light" 
                              placeholder="admin@stie.ac.id"
                            />
                         </div>
                      </div>
                   </div>

                   <div>
                      <h3 className="text-2xl text-white font-normal mb-8 flex items-center gap-3">
                         <div className="w-1.5 h-6 bg-[#EAC956] rounded-full" />
                         Logo Resmi
                      </h3>
                      <div className="flex flex-col md:flex-row items-center gap-10">
                         <div className="w-48 h-48 bg-[#2B2A23] rounded-3xl border-2 border-dashed border-[#2D2A26] flex items-center justify-center relative overflow-hidden group">
                             {config.logoUrl ? (
                                <>
                                   <img src={config.logoUrl} className="w-full h-full object-contain" />
                                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <button onClick={() => setConfig({ ...config, logoUrl: null })} className="p-3 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-6 h-6" /></button>
                                   </div>
                                </>
                             ) : (
                                <div className="text-center">
                                   <Upload className="w-10 h-10 text-[#6A685F] mx-auto mb-2" />
                                   <p className="text-[10px] text-[#6A685F] font-bold">MIN 512x512 PX</p>
                                </div>
                             )}
                         </div>
                         <div className="flex-1 space-y-4">
                            <p className="text-[#D2CEBE] font-light leading-relaxed">Pilih file logo dengan format PNG atau JPG. Logo ini akan digunakan pada kop surat, kartu pendaftaran, dan seluruh bagian navigasi sistem.</p>
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              onChange={handleLogoUpload}
                              className="hidden" 
                              accept="image/*"
                            />
                            <Button 
                              variant="outline" 
                              onClick={() => fileInputRef.current?.click()}
                              className="border-[#2D2A26] text-[#EAC956] hover:bg-[#EAC956] hover:text-[#3A2E00] rounded-xl h-12 px-6"
                            >
                               Pilih File Logo
                            </Button>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab !== "Profil" && (
                 <div className="py-20 text-center">
                    <Laptop className="w-16 h-16 text-[#2D2A26] mx-auto mb-6" />
                    <h3 className="text-xl text-[#6A685F] font-bold uppercase tracking-widest">Fitur Akan Segera Hadir</h3>
                    <p className="text-[#D2CEBE]/50 font-light mt-2 max-w-sm mx-auto">Kami sedang mempersiapkan modul pengaturan lanjutan ini untuk Anda.</p>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
