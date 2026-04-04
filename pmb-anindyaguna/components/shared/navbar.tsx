"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardHref =
    session?.user?.role === "PENDAFTAR" ? "/status" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B4F72]">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-none text-[#1B4F72]">
              STIE Anindyaguna
            </p>
            <p className="text-xs text-muted-foreground">
              Penerimaan Mahasiswa Baru
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="#jalur"
            className="text-muted-foreground hover:text-[#1B4F72] transition-colors"
          >
            Jalur Masuk
          </Link>
          <Link
            href="#persyaratan"
            className="text-muted-foreground hover:text-[#1B4F72] transition-colors"
          >
            Persyaratan
          </Link>
          <Link
            href="#timeline"
            className="text-muted-foreground hover:text-[#1B4F72] transition-colors"
          >
            Alur PMB
          </Link>
          <Link
            href="#faq"
            className="text-muted-foreground hover:text-[#1B4F72] transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="#kontak"
            className="text-muted-foreground hover:text-[#1B4F72] transition-colors"
          >
            Kontak
          </Link>
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <Link href={dashboardHref}>
              <Button className="bg-[#1B4F72] hover:bg-[#154060]">
                {session.user.role === "PENDAFTAR"
                  ? "Status Saya"
                  : "Dashboard"}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-[#1B4F72]">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#1B4F72] hover:bg-[#154060]">
                  Daftar Sekarang
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
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
              className="block text-sm text-muted-foreground hover:text-[#1B4F72]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-border">
            {session ? (
              <Link href={dashboardHref} onClick={() => setMenuOpen(false)}>
                <Button className="w-full bg-[#1B4F72] hover:bg-[#154060]">
                  {session.user.role === "PENDAFTAR"
                    ? "Status Saya"
                    : "Dashboard"}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full bg-[#1B4F72] hover:bg-[#154060]">
                    Daftar Sekarang
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
