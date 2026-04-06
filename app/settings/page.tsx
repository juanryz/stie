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
  CheckCircle2,
  AlertCircle
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
    logoUrl: null as string | null,
    primaryColor: "#EAC956"
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

  const handleSaveIdentitas = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        toast.success("Identitas Institusi Berhasil Diperbarui!");
        window.dispatchEvent(new Event("config-updated"));
      }
    } catch (error) {
      toast.error("Gagal menyimpan identitas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!security.oldPass || !security.newPass || !security.confirmPass) {
       toast.error("Harap isi semua field password!");
       return;
    }
    if (security.newPass !== security.confirmPass) {
       toast.error("Konfirmasi password baru tidak cocok!");
       return;
    }
    
    setIsSubmitting(true);
    try {
       const res = await fetch("/api/auth/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPass: security.oldPass, newPass: security.newPass })
       });
       const data = await res.json();
       if (res.ok) {
          toast.success("Password Anda berhasil diperbarui!");
          setSecurity({ oldPass: "", newPass: "", confirmPass: "" });
       } else {
          toast.error(data.error || "Gagal memperbarui password.");
       }
    } catch (error) {
       toast.error("Terjadi kesalahan sistem.");
    } finally {
       setIsSubmitting(false);
    }
  };

  const handleChangeColor = async (color: string) => {
     const newConfig = { ...config, primaryColor: color };
     setConfig(newConfig);
     // Auto save color change
     try {
        await fetch("/api/settings", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(newConfig)
        });
        window.dispatchEvent(new Event("config-updated"));
        toast.success("Skema Warna Diperbarui!");
     } catch (e) {}
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
     <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#EAC956]" />
     </div>
  );

  const pColor = config.primaryColor || "#EAC956";

  // RENDER PENDAFTAR VIEW
  if (!isAdmin) {
     return (
        <div className="max-w-4xl mx-auto pb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-[#2D2A26] pb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border ring-1"
                   style={{backgroundColor: `${pColor}11`, color: pColor, borderColor: `${pColor}33`, "--tw-ring-color": `${pColor}11`} as any}>
                <Settings className="w-4 h-4" />
                Manajemen Profil
              </div>
              <h1 className="text-6xl text-white font-normal tracking-[-0.03em] uppercase">Profil Saya</h1>
              <p className="text-xl text-[#D2CEBE] font-light italic opacity-80 leading-relaxed max-w-lg">Informasi akun yang terdaftar pada sistem portal pendaftaran.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6 col-span-1">
                <div className="p-8 bg-[#1C1A17] border border-[#2D2A26] rounded-[48px] text-center space-y-6">
                   <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center ring-1 ring-offset-4 ring-offset-[#111111]"
                        style={{backgroundColor: `${pColor}11`, color: pColor, "--tw-ring-color": `${pColor}33`} as any}>
                      <User className="w-10 h-10" />
                   </div>
                   <div>
                      <p className="text-white font-bold text-lg">{session?.user?.name}</p>
                      <p className="text-[#6A685F] text-xs font-medium tracking-wide">Pendaftar Mahasiswa</p>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <button className="w-full flex items-center justify-between text-[#3A2E00] px-8 py-5 rounded-3xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                           style={{backgroundColor: pColor}}>
                      <div className="flex items-center gap-4"><Fingerprint className="w-5 h-5"/> Akun Utama</div>
                      <ChevronRight className="w-4 h-4" />
                   </button>
                   <button onClick={() => setActiveTab("KeamananPendaftar")} className="w-full flex items-center justify-between bg-[#1C1A17] text-[#D2CEBE] border border-[#2D2A26] px-8 py-5 rounded-3xl font-bold hover:bg-[#2B2A23] transition-all">
                      <div className="flex items-center gap-4"><Lock className="w-5 h-5"/> Keamanan</div>
                   </button>
                </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-8">
                {activeTab === "KeamananPendaftar" ? (
                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1C1A17] border border-[#2D2A26] rounded-[64px] p-12 space-y-10">
                      <div className="flex items-center gap-4 mb-6">
                         <Button onClick={() => setActiveTab("Profil")} variant="ghost" className="p-0 hover:bg-transparent"><ArrowRight className="w-6 h-6 rotate-180" /></Button>
                         <h3 className="text-3xl text-white font-normal">Ganti Password</h3>
                      </div>
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] text-[#6A685F] font-bold uppercase tracking-widest ml-2">Password Saat Ini</label>
                            <input type="password" value={security.oldPass} onChange={(e) => setSecurity({...security, oldPass: e.target.value})} className="w-full bg-[#111111] border border-[#2D2A26] rounded-2xl h-14 px-6 text-white focus:border-[var(--primary)] transition-all" style={{"--primary": pColor} as any} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] text-[#6A685F] font-bold uppercase tracking-widest ml-2">Password Baru</label>
                            <input type="password" value={security.newPass} onChange={(e) => setSecurity({...security, newPass: e.target.value})} className="w-full bg-[#111111] border border-[#2D2A26] rounded-2xl h-14 px-6 text-white focus:border-[var(--primary)] transition-all" style={{"--primary": pColor} as any} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] text-[#6A685F] font-bold uppercase tracking-widest ml-2">Konfirmasi Password</label>
                            <input type="password" value={security.confirmPass} onChange={(e) => setSecurity({...security, confirmPass: e.target.value})} className="w-full bg-[#111111] border border-[#2D2A26] rounded-2xl h-14 px-6 text-white focus:border-[var(--primary)] transition-all" style={{"--primary": pColor} as any} />
                         </div>
                         <Button onClick={handleUpdatePassword} disabled={isSubmitting} className="w-full h-14 rounded-2xl font-bold text-[#3A2E00]" style={{backgroundColor: pColor}}>
                           {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Perbarui Password Sekarang"}
                         </Button>
                      </div>
                   </motion.div>
                ) : (
                   <div className="bg-[#1C1A17] border border-[#2D2A26] rounded-[64px] p-12 relative overflow-hidden group shadow-2xl">
                     <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:scale-125 transition-transform duration-1000" style={{backgroundColor: `${pColor}11`}} />
                     <div className="space-y-12 relative z-10">
                         <div className="border-b border-white/5 pb-8">
                           <label className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{color: pColor}}>DATA PENDAFTAR RESMI</label>
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
                               <ShieldCheck className="w-4 h-4" /> Portability Logged In
                            </div>
                            <Button onClick={() => signOut({ callbackUrl: "/" })} variant="ghost" className="text-red-500 hover:bg-red-500/10 rounded-2xl h-14 px-8 font-bold flex items-center gap-3 transition-all">
                              <LogOut className="w-5 h-5" /> Keluar Sesi
                            </Button>
                         </div>
                     </div>
                   </div>
                )}
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
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border ring-1 shadow-lg"
               style={{backgroundColor: `${pColor}11`, color: pColor, borderColor: `${pColor}33`, "--tw-ring-color": `${pColor}11`} as any}>
            <Globe className="w-4 h-4" />
            Core System Control Center
          </div>
          <h1 className="text-6xl text-white font-normal uppercase tracking-[-0.04em]">Pengaturan</h1>
          <p className="text-xl text-[#D2CEBE] font-light italic opacity-80 leading-relaxed max-w-2xl">Pusat kendali operasional untuk mengelola identitas, keamanan, dan visual platform.</p>
        </div>
        
        <div className="flex gap-4">
           {activeTab === "Profil" && (
             <Button 
               onClick={handleSaveIdentitas} 
               disabled={isSubmitting}
               className="text-[#3A2E00] rounded-3xl px-10 h-14 font-bold shadow-3xl transition-all flex items-center gap-3 group relative overflow-hidden"
               style={{backgroundColor: pColor}}
             >
               {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
               <span className="text-lg uppercase tracking-tight">Perbarui Branding</span>
             </Button>
           )}
           {activeTab === "Keamanan" && (
             <Button 
               onClick={handleUpdatePassword} 
               disabled={isSubmitting}
               className="text-[#3A2E00] rounded-3xl px-10 h-14 font-bold shadow-3xl transition-all flex items-center gap-3"
               style={{backgroundColor: pColor}}
             >
               {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
               <span className="text-lg uppercase tracking-tight">Update Password</span>
             </Button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
        {/* SIDEBAR TABS */}
        <div className="lg:col-span-1 space-y-3">
          {[
            { id: "Profil", icon: <User />, label: "Identitas", sub: "Logo & Nama" },
            { id: "Keamanan", icon: <ShieldCheck />, label: "Otentikasi", sub: "Akses & Password" },
            { id: "Integrasi", icon: <Globe />, label: "Konektivitas", sub: "API Cloud" },
            { id: "Tampilan", icon: <Palette />, label: "Visualisasi", sub: "Tema Warna" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-8 py-5 rounded-[32px] transition-all duration-500 group relative ${
                activeTab === tab.id 
                  ? "text-[#3A2E00] shadow-xl" 
                  : "bg-[#1C1A17] text-[#D2CEBE] border border-[#2D2A26] hover:bg-[#2B2A23]"
              }`}
              style={activeTab === tab.id ? {backgroundColor: pColor} : {}}
            >
              <div className="flex items-center gap-5 relative z-10 text-left">
                <div className={`p-3 rounded-2xl transition-colors ${activeTab === tab.id ? "bg-black/5" : "bg-white/5"}`}>
                   {React.cloneElement(tab.icon as any, { className: 'w-6 h-6' })}
                </div>
                <div>
                   <span className={`text-[10px] font-bold uppercase tracking-[0.2em] block mb-0.5 ${activeTab === tab.id ? "text-black/40" : "text-[#6A685F]"}`}>{tab.sub}</span>
                   <span className="text-xl tracking-tight leading-none block">{tab.label}</span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-all ${activeTab === tab.id ? "rotate-90 scale-125" : "opacity-30 group-hover:opacity-100 group-hover:translate-x-1"}`} />
            </button>
          ))}
        </div>

        {/* CONTENT TABS */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#1C1A17] border border-[#2D2A26] rounded-[64px] p-12 lg:p-16 relative overflow-hidden shadow-2xl min-h-[620px]"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-0" 
                   style={{backgroundColor: `${pColor}08`}} />
              
              <div className="relative z-10">
                 <div className="mb-14">
                    <h3 className="text-4xl text-white font-normal uppercase tracking-tight mb-2">{activeTab}</h3>
                    <div className="h-1 w-24 rounded-full" style={{backgroundColor: pColor}} />
                 </div>

                 {activeTab === "Profil" && (
                   <div className="space-y-16">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-3">
                            <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] ml-2">Nama Instansi</label>
                            <input type="text" value={config.namaInstansi} onChange={(e) => setConfig({...config, namaInstansi: e.target.value})} className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[var(--primary)] transition-all font-light" style={{"--primary": pColor} as any} />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] ml-2">Email Admin</label>
                            <input type="email" value={config.emailKontak} onChange={(e) => setConfig({...config, emailKontak: e.target.value})} className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[var(--primary)] transition-all font-light" style={{"--primary": pColor} as any} />
                         </div>
                      </div>

                      <div className="pt-10 border-t border-white/5">
                         <div className="flex flex-col md:flex-row items-center gap-14">
                            <div className="w-56 h-56 bg-[#111111] rounded-[48px] border-4 border-dashed border-[#2D2A26] flex items-center justify-center relative overflow-hidden group">
                                {config.logoUrl ? (
                                   <>
                                      <img src={config.logoUrl} className="w-full h-full object-contain p-6" alt="Logo" />
                                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                         <button onClick={() => setConfig({...config, logoUrl: null})} className="p-5 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 transition-all"><Trash2 className="w-6 h-6" /></button>
                                      </div>
                                   </>
                                ) : (
                                   <div className="text-center">
                                      <CloudUpload className="w-14 h-14 text-[#2D2A26] mx-auto mb-3" />
                                      <p className="text-[10px] text-[#2D2A26] font-bold uppercase tracking-widest">Upload Logo</p>
                                   </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-6">
                               <h4 className="text-white text-2xl font-light">Identitas Visual</h4>
                               <p className="text-[#D2CEBE] font-light leading-relaxed">Format PNG transparan sangat direkomendasikan. Logo ini akan digunakan pada kop surat dan kartu pendaftaran.</p>
                               <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                               <Button 
                                 variant="outline" 
                                 onClick={() => fileInputRef.current?.click()} 
                                 className="rounded-2xl h-14 px-8 text-lg font-bold transition-all hover:scale-105"
                                 style={{ borderColor: `${pColor}44`, color: pColor } as any}
                               >
                                  Pilih Berkas Logo
                               </Button>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}

                 {activeTab === "Keamanan" && (
                    <div className="space-y-12 max-w-xl mx-auto">
                       <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-3xl flex gap-4 items-center">
                           <AlertCircle className="text-red-400 w-6 h-6" />
                           <p className="text-red-200/60 text-sm font-light">Peringatan: Perubahan password akan langsung memutuskan sesi login lainnya.</p>
                       </div>
                       <div className="space-y-8">
                         <div className="space-y-3 relative">
                            <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest ml-2">Password Saat Ini</label>
                            <input type={showPass ? "text" : "password"} value={security.oldPass} onChange={(e) => setSecurity({...security, oldPass: e.target.value})} className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[var(--primary)] transition-all" style={{"--primary": pColor} as any} />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest ml-2">Password Baru</label>
                            <input type="password" value={security.newPass} onChange={(e) => setSecurity({...security, newPass: e.target.value})} className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[var(--primary)] transition-all" style={{"--primary": pColor} as any} />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest ml-2">Konfirmasi Password</label>
                            <input type="password" value={security.confirmPass} onChange={(e) => setSecurity({...security, confirmPass: e.target.value})} className="w-full bg-[#111111] border border-[#2D2A26] rounded-3xl h-16 px-8 text-xl text-white focus:border-[var(--primary)] transition-all" style={{"--primary": pColor} as any} />
                         </div>
                       </div>
                    </div>
                 )}

                 {activeTab === "Tampilan" && (
                    <div className="space-y-12">
                       <div>
                          <label className="text-[10px] font-bold text-[#6A685F] uppercase tracking-[0.25em] mb-10 block ml-2">Skema Warna Primer (Brand Color)</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                             {[
                                { name: "Dark Amber", color: "#EAC956" },
                                { name: "Ocean Blue", color: "#3B82F6" },
                                { name: "Deep Purple", color: "#A855F7" },
                                { name: "Cyber Emerald", color: "#10B981" },
                                { name: "Crimson Red", color: "#EF4444" },
                                { name: "Hot Pink", color: "#EC4899" },
                                { name: "Burnt Orange", color: "#F97316" },
                                { name: "Pure White", color: "#FFFFFF" }
                             ].map((c) => (
                                <button key={c.color} onClick={() => handleChangeColor(c.color)} className={`p-6 rounded-[32px] border transition-all text-left group overflow-hidden relative ${config.primaryColor === c.color ? "border-white/20 bg-white/5" : "bg-[#111111] border-[#2D2A26] hover:border-white/10"}`}>
                                   <div className="w-12 h-12 rounded-2xl mb-4 transition-transform group-hover:scale-110 shadow-lg" style={{backgroundColor: c.color}} />
                                   <p className="text-white text-sm font-bold tracking-tight mb-1">{c.name}</p>
                                   <div className="flex items-center gap-2 opacity-40 text-[10px] uppercase font-bold text-[#6A685F]">
                                      {config.primaryColor === c.color ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : null}
                                      {c.color}
                                   </div>
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === "Integrasi" && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                       <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-8 border border-white/5">
                          <Globe className="w-12 h-12 text-[#2D2A26]" />
                       </div>
                       <h3 className="text-3xl text-white font-normal mb-4">Cloud API Modules</h3>
                       <p className="text-[#D2CEBE] font-light max-w-sm italic opacity-40">Integrasi Cloudinary, AWS, dan WhatsApp Gateway akan segera tersedia untuk institusi Anda.</p>
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
