"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, FileText, CreditCard, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/status", label: "Status", icon: LayoutDashboard },
  { href: "/dokumen", label: "Dokumen", icon: FileText },
  { href: "/kartu", label: "Kartu", icon: CreditCard },
];

export function PendaftarNav({ nama }: { nama?: string | null }) {
  const pathname = usePathname();

  return (
    <header className="bg-[#1B4F72] text-white sticky top-0 z-10 shadow-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link href="/status" className="font-semibold text-sm sm:text-base">
            PMB STIE Anindyaguna
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith(href)
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4 hidden sm:block" />
                {label}
              </Link>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="ml-2 text-white/70 hover:text-white hover:bg-white/10 gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </nav>
        </div>

        {nama && (
          <div className="pb-2 text-xs text-white/60 truncate">
            Halo, <span className="text-white/90 font-medium">{nama}</span>
          </div>
        )}
      </div>
    </header>
  );
}
