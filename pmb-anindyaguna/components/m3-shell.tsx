"use client";

import React, { useState } from "react";
import Link from "next/link";
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
      <div className={`w-16 h-10 rounded-full flex items-center justify-center transition-colors ${active ? "bg-[#EAC956] text-[#3A2E00]" : "text-[#D2CEBE] group-hover:bg-[#2B2A23]"}`}>
        {React.cloneElement(icon as any, { className: 'w-6 h-6' })}
      </div>
      <span className={`text-[13px] font-medium tracking-wide ${active ? "text-[#F8F6F1]" : "text-[#D2CEBE]"}`}>{label}</span>
    </div>
  )
}

export function M3Shell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // M3 Yellow/Charcoal Theme Configuration
  const sysBackground = "bg-[#111111]"; 
  const surfaceContainer = "bg-[#1C1A17]";
  const onSurface = "text-[#E6E1E5]";

  return (
    <div className={`min-h-screen ${sysBackground} ${onSurface} font-sans flex flex-col md:flex-row overflow-hidden`}>
      
      {/* MOBILE TOP BAR (Visible only on < md) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111111] border-b border-[#2C2A26]">
         <div className="flex items-center gap-2 text-[#EAC956]">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
               <Menu className="w-6 h-6 text-[#EAC956]" />
            </Button>
            <GraduationCap className="w-6 h-6" />
         </div>
         <div className="text-sm font-medium text-[#EAC956]">STIE Anindyaguna</div>
      </div>

      {/* M3 NAVIGATION RAIL (Visible on desktop) */}
      <nav className="hidden md:flex flex-col w-[120px] h-screen py-8 items-center justify-between bg-[#111111] shrink-0 border-r border-[#2D2A26]">
        {/* LOGO DI ATAS */}
        <div className="bg-[#EAC956]/10 text-[#EAC956] p-4 rounded-xl">
           <GraduationCap className="w-8 h-8" />
        </div>
        
        {/* MENU TEPAT DI TENGAH */}
        <div className="flex flex-col gap-8 flex-1 justify-center items-center -mt-8">
          <Link href="/"><NavItem icon={<Home />} label="Beranda" active /></Link>
          <Link href="/#prodi"><NavItem icon={<BookOpen />} label="Prodi" /></Link>
          <Link href="/#jalur"><NavItem icon={<Layers />} label="Jalur" /></Link>
        </div>

        {/* BAWAH / LOGIN */}
        <div className="flex flex-col gap-6">
           <Link href="/login">
              <NavItem icon={<UserCircle2 />} label="Masuk" />
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
        <div className={`relative w-full h-full ${surfaceContainer} md:rounded-[32px] overflow-y-auto overflow-x-hidden border-t md:border border-[#2D2A26] shadow-xl`}>
           {children}
        </div>
      </main>
    </div>
  );
}
