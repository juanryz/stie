"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardHref =
    session?.user?.role === "PENDAFTAR" ? "/status" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E0E2E4] bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-[72px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0061A4] text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-extrabold tracking-tight text-[#1A1C1E]">
              STIE Anindyaguna
            </p>
            <p className="text-[11px] font-medium tracking-wide uppercase text-[#43474E]">
              Penerimaan Mahasiswa Baru
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium border border-[#E0E2E4] rounded-full px-8 h-12 bg-[#FDFBFF]/50 shadow-sm">
          {["Jalur", "Persyaratan", "Timeline", "FAQ", "Kontak"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-[#43474E] hover:text-[#0061A4] transition-colors py-1 group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0061A4] transition-all group-hover:w-full rounded-full"></span>
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link href={dashboardHref}>
              <Button className="bg-[#0061A4] hover:bg-[#004A7E] text-white rounded-full h-11 px-6 shadow-md transition-all">
                {session.user.role === "PENDAFTAR"
                  ? "Status Saya"
                  : "Dashboard"}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-[#0061A4] font-medium hover:bg-[#D1E4FF] rounded-full h-11 px-6">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#0061A4] hover:bg-[#004A7E] text-white rounded-full h-11 px-6 shadow-md transition-all">
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-full text-[#43474E] hover:bg-[#E2E2E9] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[#E0E2E4] bg-white overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {[
                { href: "#jalur", label: "Jalur Masuk" },
                { href: "#persyaratan", label: "Persyaratan" },
                { href: "#timeline", label: "Alur PMB" },
                { href: "#faq", label: "FAQ" },
                { href: "#kontak", label: "Kontak" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-base font-medium text-[#43474E] hover:text-[#0061A4] transition-colors py-2 border-b border-[#E0E2E4]/50"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {session ? (
                  <Link href={dashboardHref} onClick={() => setMenuOpen(false)}>
                    <Button className="w-full h-12 bg-[#0061A4] hover:bg-[#004A7E] text-white rounded-full">
                      {session.user.role === "PENDAFTAR"
                        ? "Status Saya"
                        : "Dashboard"}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-12 border-[#73777F] text-[#43474E] rounded-full">
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMenuOpen(false)}>
                      <Button className="w-full h-12 bg-[#0061A4] hover:bg-[#004A7E] text-white rounded-full shadow-md">
                        Daftar Sekarang
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
