"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Layers,
  Menu,
  X,
  UserCircle2,
  LayoutDashboard,
  ShieldCheck,
  Users,
  BarChart3,
  Megaphone,
  Settings,
  LogOut,
  FileText,
  Clock,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  const activeColor = "#EAC956";
  const contrastColor = "#3A2E00";

  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer group relative">
      <div className="relative">
        <AnimatePresence>
          {active && (
            <motion.div 
              layoutId="nav-pill"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="absolute inset-0 rounded-[20px] -z-10"
              style={{ backgroundColor: activeColor }}
            />
          )}
        </AnimatePresence>
        
        <div className={`w-16 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${active ? "" : "text-[#D2CEBE] group-hover:bg-[#2B2A23] group-hover:text-white"}`}
             style={active ? { color: contrastColor } : {}}>
          {React.cloneElement(icon as any, { className: 'w-6 h-6' })}
        </div>
      </div>
      <span className={`text-[12px] font-medium tracking-tight transition-all duration-300 ${active ? "text-[#F8F6F1]" : "text-[#D2CEBE] group-hover:text-[#F8F6F1]"}`}>{label}</span>
      {active && <motion.div layoutId="dot" className="w-1 h-1 rounded-full absolute -bottom-3" style={{ backgroundColor: activeColor }} />}
    </div>
  )
}

export function M3Shell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [config, setConfig] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loadConfig = () => {
      fetch("/api/settings").then(res => res.json()).then(data => {
        if (data && !data.error) setConfig(data);
      });
    };

    loadConfig();

    window.addEventListener("config-updated", loadConfig);
    return () => window.removeEventListener("config-updated", loadConfig);
  }, [pathname]);

  const navigateTo = (path: string, hash: string) => {
    setActiveSection(hash.replace("#", "") || "home");
    router.push(path);
  };

  // DEFINE LINKS BASED ON ROLE
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const getLinks = () => {
    const isAuth = status === "authenticated";
    
    if (isAuth && pathname !== "/") {
       if (isAdmin) {
          return [
             { icon: <LayoutDashboard />, label: "Dasbor", path: "/dashboard", hash: "dashboard" },
             { icon: <BookOpen />, label: "Prodi", path: "/prodi", hash: "prodi" },
             { icon: <Users />, label: "Pendaftar", path: "/pendaftar", hash: "pendaftar" },
             { icon: <ShieldCheck />, label: "Verifikasi", path: "/verifikasi", hash: "verifikasi" },
             { icon: <BarChart3 />, label: "Laporan", path: "/laporan", hash: "laporan" },
             { icon: <Megaphone />, label: "Informasi", path: "/pengumuman", hash: "pengumuman" },
          ];
       } else {
          return [
             { icon: <Clock />, label: "Dashboard", path: "/status", hash: "status" },
             { icon: <FileText />, label: "Dokumen", path: "/dokumen", hash: "dokumen" },
             { icon: <CreditCard />, label: "Kartu", path: "/kartu", hash: "kartu" },
             { icon: <Home />, label: "Beranda", path: "/", hash: "home" },
          ];
       }
    }
    
    const baseLinks = [
      { icon: <Home />, label: "Beranda", path: "/", hash: "home" },
      { icon: <BookOpen />, label: "Prodi", path: "/#prodi", hash: "prodi" },
      { icon: <Layers />, label: "Jalur", path: "/#jalur", hash: "jalur" },
      { icon: <Megaphone />, label: "Informasi", path: "/#announcements", hash: "announcements" },
    ];

    if (isAuth && pathname === "/") {
       const shortcut = isAdmin 
         ? { icon: <LayoutDashboard />, label: "Dasbor", path: "/dashboard", hash: "dashboard" }
         : { icon: <Clock />, label: "Dashboard", path: "/status", hash: "status" };
       return [shortcut, ...baseLinks];
    }
    return baseLinks;
  };

  const links = getLinks();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (pathname !== "/") return;
    const container = e.currentTarget;
    const scrollY = container.scrollTop;
    
    const navLinks = links.filter(l => l.hash && document.getElementById(l.hash));
    let current = "home";
    for (const link of navLinks) {
      const element = document.getElementById(link.hash);
      if (element && element.offsetTop <= scrollY + 400) {
        current = link.hash;
      }
    }
    setActiveSection(current);
  };
  
  useEffect(() => {
    const hash = window.location.hash.split("#")[1];
    if (hash) {
       setActiveSection(hash);
    } else {
       if (pathname.includes("dashboard")) setActiveSection("dashboard");
       else if (pathname.includes("prodi")) setActiveSection("prodi");
       else if (pathname.includes("pendaftar")) setActiveSection("pendaftar");
       else if (pathname.includes("verifikasi")) setActiveSection("verifikasi");
       else if (pathname.includes("status")) setActiveSection("status");
       else if (pathname.includes("dokumen")) setActiveSection("dokumen");
       else if (pathname.includes("kartu")) setActiveSection("kartu");
       else if (pathname.includes("settings")) setActiveSection("settings");
       else if (pathname === "/") setActiveSection("home");
       else if (pathname === "/login") setActiveSection("login");
       else if (pathname === "/register") setActiveSection("register");
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#111111] text-[#E6E1E5] font-sans flex flex-col md:flex-row overflow-hidden selection:bg-[#EAC956]/30">
       <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-0 opacity-40">
        <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] rounded-full blur-[120px] bg-[#EAC956]/20" />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full blur-[100px] bg-[#EAC956]/10" />
      </div>

      <div className="md:hidden flex items-center justify-between p-4 bg-[#111111]/80 backdrop-blur-xl border-b border-white/5 z-50">
         <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="hover:bg-white/5 rounded-xl text-[#EAC956]"><Menu className="w-6 h-6" /></Button>
            <div onClick={() => navigateTo("/", "home")} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="rounded-xl shrink-0 flex items-center justify-center w-12 h-12 overflow-hidden bg-white">
                <img src={config?.logoUrl || "/images/logo.jpg"} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-[#F8F6F1] tracking-tight truncate max-w-[120px]">{config?.namaInstansi || "STIE PMB"}</span>
            </div>
         </div>
      </div>

      <nav className="hidden md:flex flex-col w-[100px] h-screen py-10 items-center justify-between bg-[#111111] shrink-0 border-r border-[#2D2A26] z-50 relative">
        <div onClick={() => navigateTo("/", "home")} className="flex flex-col items-center group/logo hover:opacity-80 transition-opacity cursor-pointer">
            <div className="rounded-2xl mb-4 w-20 h-20 flex items-center justify-center overflow-hidden bg-white">
               <img src={config?.logoUrl || "/images/logo.jpg"} className="w-full h-full object-cover" />
            </div>
            <div className="text-[10px] font-bold tracking-tighter uppercase px-2 text-center leading-none mt-1 text-[#EAC956]">
               {config?.namaInstansi?.split(' ')?.[0] || 'STIE'}
            </div>
        </div>

        <div className="flex flex-col gap-8 flex-1 justify-center items-center">
          {links.map((link) => (
             <div key={link.hash} onClick={() => navigateTo(link.path, link.hash)}>
                <NavItem icon={link.icon} label={link.label} active={activeSection === link.hash} />
             </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 mb-4">
           {status === "authenticated" ? (
             <>
               <div onClick={() => navigateTo("/settings", "settings")}>
                 <NavItem 
                    icon={isAdmin ? <Settings /> : <UserCircle2 />} 
                    label="Profil Saya" 
                    active={activeSection === "settings"} 
                 />
               </div>
               <button onClick={() => signOut({ callbackUrl: "/" })} className="flex flex-col items-center gap-1.5 cursor-pointer group relative">
                  <div className="w-16 h-8 rounded-full flex items-center justify-center text-[#D2CEBE] group-hover:bg-red-500/10 group-hover:text-red-500 transition-all duration-300"><LogOut className="w-6 h-6" /></div>
                  <span className="text-[10px] font-bold tracking-widest text-[#6A685F] group-hover:text-red-500 uppercase">Keluar</span>
               </button>
             </>
           ) : (
             <Link href="/login" onClick={() => setActiveSection("login")}><NavItem icon={<UserCircle2 />} label="Masuk" active={activeSection === "login"} /></Link>
           )}
           <div className="p-2.5 bg-green-500/5 text-green-500 rounded-xl border border-green-500/10 opacity-30 mx-auto"><ShieldCheck className="w-4 h-4" /></div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="fixed inset-0 z-50 bg-[#111111]/95 backdrop-blur-2xl p-8 flex flex-col">
             <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-4">
                   <div className="rounded-2xl w-16 h-16 flex items-center justify-center overflow-hidden shrink-0 bg-white">
                      <img src={config?.logoUrl || "/images/logo.jpg"} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-2xl font-bold text-white tracking-tight leading-none mb-1">{config?.namaInstansi || "STIE PMB"}</span>
                     <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#EAC956]">Portal Akademik</span>
                   </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="hover:bg-white/5 text-white rounded-2xl"><X className="w-8 h-8" /></Button>
             </div>
             
             <div className="flex flex-col gap-6 text-[32px] font-normal tracking-tight text-[#D2CEBE]">
               {links.map((item, idx) => (
                 <motion.div key={item.hash} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                   <div onClick={() => { setMobileMenuOpen(false); navigateTo(item.path, item.hash); }} className="transition-colors flex items-center justify-between group cursor-pointer hover:text-white">
                     <span className="group-hover:translate-x-2 transition-transform">{item.label}</span>
                     <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#EAC956] group-hover:border-[#EAC956] group-hover:text-[#3A2E00] transition-all ring-[#EAC956]">
                        {React.cloneElement(item.icon as any, { className: 'w-6 h-6' })}
                     </div>
                   </div>
                 </motion.div>
               ))}
               
               {status === "authenticated" ? (
                 <div className="flex flex-col gap-8 pt-8 border-t border-white/5 mt-4">
                   <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                     <div onClick={() => { setMobileMenuOpen(false); navigateTo("/settings", "settings"); }} className="transition-colors flex items-center justify-between group cursor-pointer hover:text-white">
                       <span className="group-hover:translate-x-2 transition-transform text-white font-bold">Setelan & Profil</span>
                       <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#EAC956] group-hover:border-[#EAC956] group-hover:text-[#3A2E00] transition-all">
                          <Settings className="w-6 h-6"/>
                       </div>
                     </div>
                   </motion.div>
                   <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center justify-between text-red-400 font-bold hover:text-red-300 transition-all group">
                      <span className="group-hover:translate-x-2 transition-transform">Keluar Sesi</span> 
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all"><LogOut className="w-6 h-6" /></div>
                   </motion.button>
                 </div>
               ) : (
                 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                   <div onClick={() => { setMobileMenuOpen(false); navigateTo("/login", "login"); }} className="flex items-center justify-between font-bold cursor-pointer transition-colors text-[#EAC956]">
                      Login Admin <div className="w-12 h-12 rounded-full border flex items-center justify-center border-[#EAC956]"><UserCircle2 className="w-6 h-6" /></div>
                   </div>
                 </motion.div>
               )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 h-[calc(100vh-64px)] md:h-screen md:p-3 overflow-hidden relative z-10 transition-all">
        <div onScroll={handleScroll} className="relative w-full h-full bg-[#1C1A17] md:rounded-[36px] overflow-y-auto overflow-x-hidden border-t md:border border-[#2D2A26] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] scroll-smooth group content-area">
           <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="w-full h-full">
              {children}
           </motion.div>
        </div>
      </main>

    </div>
  );
}
