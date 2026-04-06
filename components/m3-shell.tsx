"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Home,
  BookOpen,
  Layers,
  Menu,
  X,
  UserCircle2,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 cursor-pointer group`}>
      <div className={`w-16 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${active ? "bg-[#EAC956] text-[#3A2E00]" : "text-[#D2CEBE] group-hover:bg-[#2B2A23] group-hover:text-[#EAC956]"}`}>
        {React.cloneElement(icon as any, { className: 'w-6 h-6' })}
      </div>
      <span className={`text-[13px] font-medium tracking-wide transition-colors ${active ? "text-[#F8F6F1]" : "text-[#D2CEBE] group-hover:text-[#F8F6F1]"}`}>{label}</span>
    </div>
  )
}

export function M3Shell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/login" || pathname === "/register") {
      setActiveSection("login");
    } else if (pathname.includes("/dashboard")) {
      setActiveSection("dashboard");
    } else if (pathname === "/") {
      setActiveSection("home");
    }
  }, [pathname]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (pathname !== "/") return;
    
    const container = e.currentTarget;
    const scrollY = container.scrollTop;
    const sections = ["home", "prodi", "jalur"];
    
    let current = "home";
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        // If element is near top
        if (element.offsetTop <= scrollY + 300) {
          current = section;
        }
      }
    }
    setActiveSection(current);
  };

  // M3 Yellow/Charcoal Theme Configuration
  const sysBackground = "bg-[#111111]"; 
  const surfaceContainer = "bg-[#1C1A17]";
  const onSurface = "text-[#E6E1E5]";

  const navigateTo = (path: string, hash: string) => {
    setActiveSection(hash.replace("#", "") || "home");
    router.push(path);
  };

  return (
    <div className={`min-h-screen ${sysBackground} ${onSurface} font-sans flex flex-col md:flex-row overflow-hidden`}>
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111111] border-b border-[#2C2A26] z-50">
         <div className="flex items-center gap-2 text-[#EAC956]">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
               <Menu className="w-6 h-6 text-[#EAC956]" />
            </Button>
            <GraduationCap className="w-6 h-6" />
         </div>
         <div className="text-sm font-medium text-[#EAC956]">STIE Anindyaguna</div>
      </div>

      {/* M3 NAVIGATION RAIL */}
      <nav className="hidden md:flex flex-col w-[120px] h-screen py-8 items-center justify-between bg-[#111111] shrink-0 border-r border-[#2D2A26] z-50 relative">
        <div className="flex flex-col items-center">
            <div className="bg-[#EAC956]/10 text-[#EAC956] p-4 rounded-xl mb-2">
               <GraduationCap className="w-8 h-8" />
            </div>
        </div>
        
        <div className="flex flex-col gap-8 flex-1 justify-center items-center">
          <div onClick={() => navigateTo('/', '#home')}><NavItem icon={<Home />} label="Beranda" active={activeSection === "home"} /></div>
          <div onClick={() => navigateTo('/#prodi', '#prodi')}><NavItem icon={<BookOpen />} label="Prodi" active={activeSection === "prodi"} /></div>
          <div onClick={() => navigateTo('/#jalur', '#jalur')}><NavItem icon={<Layers />} label="Jalur" active={activeSection === "jalur"} /></div>
        </div>

        <div className="flex flex-col gap-6">
           <Link href="/login" onClick={() => setActiveSection("login")}>
              <NavItem icon={<UserCircle2 />} label="Masuk" active={activeSection === "login"} />
           </Link>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-50 bg-[#111111] p-6 flex flex-col"
          >
             <div className="flex justify-between items-center mb-12">
               <div className="flex items-center gap-3 text-[#EAC956]">
                 <GraduationCap className="w-8 h-8" />
                 <span className="text-xl font-bold">PMB STIE</span>
               </div>
               <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                 <X className="w-8 h-8 text-white" />
               </Button>
             </div>
             <div className="flex flex-col gap-6 text-2xl font-medium">
               <Link href="/" onClick={() => setMobileMenuOpen(false)}>Beranda</Link>
               <Link href="/#prodi" onClick={() => setMobileMenuOpen(false)}>Program Studi</Link>
               <Link href="/#jalur" onClick={() => setMobileMenuOpen(false)}>Jalur & Syarat</Link>
               <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Masuk (Login)</Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA - THE HUGE ROUNDED CONTAINER */}
      <main className="flex-1 h-[calc(100vh-64px)] md:h-screen md:p-3 overflow-hidden">
        <div 
          onScroll={handleScroll}
          className={`relative w-full h-full ${surfaceContainer} md:rounded-[32px] overflow-y-auto overflow-x-hidden border-t md:border border-[#2D2A26] shadow-xl scroll-smooth`}
        >
           {children}
        </div>
      </main>
    </div>
  );
}
