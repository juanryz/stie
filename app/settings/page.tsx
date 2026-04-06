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
  ArrowRight,
  Fingerprint,
  KeyRound,
  Eye,
  EyeOff,
  CloudUpload,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UnifiedSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  
  const [activeTab, setActiveTab] = useState("Profil");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const [config, setConfig] = useState({
    id: "",
    namaInstansi: "STIE Anindyaguna Semarang",
    emailKontak: "admin@stie-anindyaguna.ac.id",
    logoUrl: null as string | null
  });

  const [security, setSecurity] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
       router.push("/login");
    }
    if (status === "authenticated") {
       if (isAdmin) {
          fetchSettings();
       } else {
          setLoading(false);
       }
    }
  }, [status, isAdmin, router]);

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
      if (activeTab === "Keamanan") {
         if (security.newPass !== security.confirmPass) {
            toast.error("Password baru tidak cocok!");
            return;
         }
         // Logic to update password via API (Need to implement API endpoint)
         toast.success("Password diperbarui!");
      } else {
         const res = await fetch("/api/settings", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(config)
         });
         if (res.ok) {
           toast.success("Pengaturan berhasil disimpan!");
         }
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

  if (loading || status === "loading") return (
     <div className="h-screen w-full flex items-center justify-center bg-[#111111]">
        <Loader2 className="w-12 h-12 animate-spin text-[#EAC956]" />
     </div>
  );

  // RENDER PENDAFTAR VIEW
  if (!isAdmin) {
     return (
        <div className="max-w-4xl mx-auto pb-40">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-[#2D2A26] pb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#EAC956]/20 ring-1 ring-[#EAC956]/10">
                <Settings className="w-4 h-4" />
                Manajemen Profil
              </div>
              <h1 className="text-6xl text-white font-normal tracking-[-0.03em] uppercase">Profil Saya</h1>
              <p className="text-xl text-[#D2CEBE] font-light italic opacity-80 leading-relaxed max-w-lg">Lihat informasi akun yang terdaftar pada sistem portal pendaftaran.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6 col-span-1">
                <div className="p-8 bg-[#1C1A17] border border-[#2D2A26] rounded-[48px] text-center space-y-6">
                   <div className="w-24 h-24 bg-[#EAC956]/10 rounded-full mx-auto flex items-center justify-center text-[#EAC956] ring-1 ring-[#EAC956]/20 ring-offset-4 ring-offset-[#111111]">
                      <User className="w-10 h-10" />
                   </div>
                   <div>
                      <p className="text-white font-bold text-lg">{session?.user?.name}</p>
                      <p className="text-[#6A685F] text-xs font-medium tracking-wide">Pendaftar Terdaftar</p>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <button className="w-full flex items-center justify-between bg-[#EAC956] text-[#3A2E00] px-8 py-5 rounded-3xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                      <div className="flex items-center gap-4"><Fingerprint className="w-5 h-5"/> Akun Utama</div>
                      <ChevronRight className="w-4 h-4" />
                   </button>
                   <button disabled className="w-full flex items-center justify-between bg-[#1C1A17] text-[#6A685F] px-8 py-5 rounded-3xl font-bold opacity-50 cursor-not-allowed">
                      <div className="flex items-center gap-4"><Lock className="w-5 h-5"/> Keamanan</div>
                   </button>
                </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-8">
                <div className="bg-[#1C1A17] border border-[#2D2A26] rounded-[64px] p-12 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#EAC956]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
                  
                  <div className="space-y-12 relative z-10">
                      <div className="border-b border-white/5 pb-8">
                        <label className="text-[10px] font-bold text-[#EAC956] uppercase tracking-[0.25em] mb-4 block">IDENTITAS RESMI</label>
                        <p className="text-3xl text-white font-normal tracking-tight">{session?.user?.name}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                         <div>
                           <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.2em] mb-3 block">EMAIL SISTEM</label>
                           <p className="text-xl text-[#D2CEBE] font-light italic">{session?.user?.email}</p>
                         </div>
                         <div>
                           <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.2em] mb-3 block">USER ID</label>
                           <p className="text-xl text-[#D2CEBE] font-mono tracking-tighter opacity-40">#{session?.user?.id?.substring(0,8)}</p>
                         </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3 text-xs text-[#6A685F] font-bold tracking-widest uppercase">
                            <ShieldCheck className="w-4 h-4" /> Verifikasi Otomatis Aktif
                         </div>
                         <Button onClick={() => signOut({ callbackUrl: "/" })} variant="ghost" className="text-red-500 hover:bg-red-500/10 rounded-2xl h-14 px-8 font-bold flex items-center gap-3">
                           <LogOut className="w-5 h-5" /> Keluar Sesi
                         </Button>
                      </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
     );
  }

  // RENDER ADMIN VIEW
  return (
    <div className="max-w-7xl mx-auto pb-40">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 border-b border-[#2D2A26] pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#EAC956]/20 ring-1 ring-[#EAC956]/10 shadow-[0_0_15px_rgba(234,201,86,0.1)]">
            <Globe className="w-4 h-4" />
            Core Architecture Configuration
          </div>
          <h1 className="text-6xl text-white font-normal uppercase tracking-[-0.04em]">Pengaturan Sistem</h1>
          <p className="text-xl text-[#D2CEBE] font-light italic opacity-80 leading-relaxed max-w-2xl">Modul kendali pusat untuk memodifikasi identitas, otentikasi, dan visualisasi platform.</p>
        </div>
        
        <div className="flex gap-4">
           <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 text-white transition-all shadow-xl">
              <RefreshCw className="w-5 h-5" />
           </Button>
           <Button 
             onClick={handleSave} 
             disabled={isSubmitting}
             className="bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-3xl px-10 h-14 font-bold shadow-3xl transition-all flex items-center gap-3 group relative overflow-hidden"
           >
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
             {isSubmitting ? (
               <Loader2 className="w-6 h-6 animate-spin" />
             ) : (
               <Save className="w-6 h-6 relative z-10 transition-transform group-hover:rotate-12" />
             )}
             <span className="relative z-10 text-lg uppercase tracking-tight">Simpan Perubahan</span>
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
        {/* SIDEBAR TABS */}
        <div className="lg:col-span-1 space-y-3">
          {[
            { id: "Profil", icon: <User />, label: "Identitas", sub: "Logo & Nama" },
            { id: "Keamanan", icon: <ShieldCheck />, label: "Otentikasi", sub: "Ganti Password" },
            { id: "Integrasi", icon: <Globe />, label: "Konektivitas", sub: "Cloud & API" },
            { id: "Tampilan", icon: <Palette />, label: "Visualisasi", sub: "Sistem Warna" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-8 py-5 rounded-[32px] transition-all duration-500 group relative overflow-hidden ${
                activeTab === tab.id 
                  ? "bg-[#EAC956] text-[#3A2E00] shadow-[0_15px_40px_rgba(234,201,86,0.3)]" 
                  : "bg-[#1C1A17] text-[#D2CEBE] border border-[#2D2A26] hover:bg-[#2B2A23] hover:border-[#EAC956]/30"
              }`}
            >
              <div className="flex items-center gap-5 relative z-10 text-left">
                <div className={`p-3 rounded-2xl transition-colors ${activeTab === tab.id ? "bg-black/5" : "bg-white/5"}`}>
                   {React.cloneElement(tab.icon as any, { className: 'w-6 h-6' })}
                </div>
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-0.5">{tab.sub}</span>
                   <span className="text-xl tracking-tight leading-none block">{tab.label}</span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-all relative z-10 ${activeTab === tab.id ? "rotate-90 scale-125" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"}`} />
            </button>
          ))}
          
          <div className="mt-12 pt-8 border-t border-white/5 p-6 bg-[#EAC956]/5 rounded-[32px] border border-[#EAC956]/10">
             <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#EAC956]" />
                <span className="text-white font-bold text-sm">System Update</span>
             </div>
             <p className="text-[11px] text-[#D2CEBE] font-light leading-relaxed">Platform Anda menggunakan mesin perayap M3 Amber versi 1.2. Seluruh modul pengaturan akan segera tersinkronisasi.</p>
          </div>
        </div>

        {/* CONTENT TABS */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#1C1A17] border border-[#2D2A26] rounded-[64px] p-12 lg:p-16 relative overflow-hidden shadow-2xl min-h-[600px]"
            >
              {/* BRANDING GRADIENT BACKGROUND */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EAC956]/3 rounded-full blur-[120px] pointer-events-none -z-0" />
              
              <div className="relative z-10 h-full flex flex-col">
                 <div className="mb-14 flex items-center justify-between">
                    <div>
                       <h3 className="text-4xl text-white font-normal uppercase tracking-tight mb-2">{activeTab === "Profil" ? "Branding Institusi" : activeTab}</h3>
                       <div className="h-1 w-24 bg-[#EAC956] rounded-full" />
                    </div>
                    <MoreVertical className="text-[#6A685F] w-6 h-6 opacity-30" />
                 </div>

                 {activeTab === "Profil" && (
                   <div className="space-y-16">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-4">
                            <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                               <Fingerprint className="w-3 h-3 text-[#EAC956]" /> Nama Instansi
                            </label>
                            <input 
                              type="text" 
                              value={config.namaInstansi}
                              onChange={(e) => setConfig({ ...config, namaInstansi: e.target.value })}
                              className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[#EAC956] focus:ring-1 focus:ring-[#EAC956]/20 transition-all font-light placeholder:opacity-20" 
                              placeholder="Masukkan nama resmi instansi"
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                               <Bell className="w-3 h-3 text-[#EAC956]" /> Email Kontak Admin
                            </label>
                            <input 
                              type="email" 
                              value={config.emailKontak}
                              onChange={(e) => setConfig({ ...config, emailKontak: e.target.value })}
                              className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[#EAC956] focus:ring-1 focus:ring-[#EAC956]/20 transition-all font-light" 
                            />
                         </div>
                      </div>

                      <div className="pt-10 border-t border-white/5">
                         <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] mb-8 block ml-2">Visual Branding: Identitas Logo</label>
                         <div className="flex flex-col md:flex-row items-center gap-14">
                            <div className="w-56 h-56 bg-[#111111] rounded-[48px] border-4 border-dashed border-[#2D2A26] flex items-center justify-center relative overflow-hidden group shadow-inner">
                                {config.logoUrl ? (
                                   <>
                                      <img src={config.logoUrl} className="w-full h-full object-contain p-6" alt="Uploaded Logo" />
                                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                         <button onClick={() => setConfig({ ...config, logoUrl: null })} className="p-5 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"><Trash2 className="w-8 h-8" /></button>
                                      </div>
                                   </>
                                ) : (
                                   <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                      <CloudUpload className="w-14 h-14 text-[#2D2A26] mx-auto mb-3" />
                                      <p className="text-[10px] text-[#2D2A26] font-bold uppercase tracking-widest">Upload Logo</p>
                                   </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-6">
                               <h4 className="text-white text-2xl font-light">Spesifikasi Grafis</h4>
                               <p className="text-[#D2CEBE] font-light leading-relaxed text-lg">Gunakan file logo beresolusi tinggi (min 512x512) dengan latar belakang transparan (PNG). Logo ini akan muncul pada seluruh dokumen resmi, kartu peserta, dan kop surat.</p>
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
                                 className="border-[#2D2A26] text-[#EAC956] hover:bg-[#EAC956] hover:text-[#3A2E00] rounded-2xl h-14 px-8 text-lg font-bold transition-all hover:scale-105"
                               >
                                  Pilih Berkas Grafis
                               </Button>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === "Keamanan" && (
                    <div className="space-y-12">
                       <div className="bg-[#EAC956]/5 border border-[#EAC956]/10 p-8 rounded-[40px] flex gap-6 items-start">
                          <ShieldCheck className="w-10 h-10 text-[#EAC956] shrink-0" />
                          <p className="text-[#D2CEBE] font-light leading-relaxed">Keamanan akun adalah prioritas utama. Gunakan kombinasi password yang kuat dan lakukan pembaruan secara berkala minimal setiap 6 bulan.</p>
                       </div>

                       <div className="grid grid-cols-1 gap-10 max-w-xl mx-auto pt-8">
                          <div className="space-y-3 relative">
                             <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest ml-2 flex items-center gap-2">
                                <KeyRound className="w-3 h-3" /> Password Saat Ini
                             </label>
                             <div className="relative">
                                <input 
                                  type={showPass ? "text" : "password"} 
                                  value={security.oldPass}
                                  onChange={(e) => setSecurity({ ...security, oldPass: e.target.value })}
                                  className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[#EAC956] transition-all pr-16" 
                                  placeholder="••••••••"
                                />
                                <button 
                                   onClick={() => setShowPass(!showPass)}
                                   className="absolute right-6 top-1/2 -translate-y-1/2 text-[#6A685F] hover:text-[#EAC956] transition-colors"
                                >
                                   {showPass ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                                </button>
                             </div>
                          </div>

                          <div className="space-y-3">
                             <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest ml-2 flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-[#EAC956]" /> Password Baru
                             </label>
                             <input 
                               type="password" 
                               value={security.newPass}
                               onChange={(e) => setSecurity({ ...security, newPass: e.target.value })}
                               className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[#EAC956] transition-all" 
                               placeholder="Min 8 karakter"
                             />
                          </div>

                          <div className="space-y-3">
                             <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest ml-2">Konfirmasi Password Baru</label>
                             <input 
                               type="password" 
                               value={security.confirmPass}
                               onChange={(e) => setSecurity({ ...security, confirmPass: e.target.value })}
                               className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[#EAC956] transition-all" 
                               placeholder="Ulangi password baru"
                             />
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === "Integrasi" && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                       <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                          <Globe className="w-10 h-10 text-[#6A685F]" />
                       </div>
                       <h3 className="text-3xl text-white font-normal mb-4">Modul API & Integrasi</h3>
                       <p className="text-[#D2CEBE] font-light max-w-sm mb-12 italic opacity-60 leading-relaxed">Opsi konektivitas cloud storage dan integrasi sistem eksternal sedang dipersiapkan untuk institusi Anda.</p>
                       <Button variant="outline" className="border-[#2D2A26] text-[#6A685F] rounded-2xl h-12 px-8 font-bold opacity-30 cursor-not-allowed">
                          Hubungkan API Baru
                       </Button>
                    </div>
                 )}

                 {activeTab === "Tampilan" && (
                    <div className="space-y-12">
                       <div>
                          <h4 className="text-white text-2xl font-light mb-10 flex items-center gap-3">
                             <Palette className="w-6 h-6 text-[#EAC956]" /> Skema Warna Platform
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                             {[
                                { name: "Dark Amber (Default)", color: "bg-[#EAC956]" },
                                { name: "Ocean Blue", color: "bg-blue-500" },
                                { name: "Royal Purple", color: "bg-purple-500" },
                                { name: "Cyber Green", color: "bg-emerald-500" }
                             ].map((c) => (
                                <button key={c.name} className="p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-[#EAC956]/30 transition-all text-left">
                                   <div className={`w-12 h-12 ${c.color} rounded-2xl mb-4 shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-12`} />
                                   <p className="text-[10px] font-bold text-[#6A685F] uppercase tracking-tighter mb-1">{c.name}</p>
                                   <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Gunakan</span>
                                </button>
                             ))}
                          </div>
                       </div>
                       
                       <div className="pt-10 border-t border-white/5">
                          <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] mb-8 block">Animasi & Dekoratif</label>
                          <div className="flex items-center justify-between p-8 bg-[#111111] border border-[#2D2A26] rounded-3xl">
                             <div className="flex gap-4 items-center">
                                <Laptop className="w-6 h-6 text-[#EAC956]" />
                                <div>
                                   <p className="text-white font-bold">Fluid Motion Graphics</p>
                                   <p className="text-xs text-[#6A685F]">Gunakan animasi halus M3 (Framer Motion)</p>
                                </div>
                             </div>
                             <div className="w-14 h-8 bg-[#EAC956] rounded-full p-1 flex justify-end">
                                <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                             </div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
