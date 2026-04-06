"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  BarChart2,
  Megaphone,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: string;
  nama?: string | null;
  email?: string | null;
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "PANITIA"],
    exact: true,
  },
  {
    href: "/pendaftar",
    label: "Data Pendaftar",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN", "PANITIA"],
  },
  {
    href: "/verifikasi",
    label: "Verifikasi",
    icon: ShieldCheck,
    roles: ["SUPER_ADMIN", "ADMIN", "PANITIA"],
  },
  {
    href: "/laporan",
    label: "Laporan",
    icon: BarChart2,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    href: "/pengumuman",
    label: "Pengumuman",
    icon: Megaphone,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    href: "/settings",
    label: "Pengaturan",
    icon: Settings,
    roles: ["SUPER_ADMIN"],
  },
];

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  PANITIA: "Panitia",
};

export function Sidebar({ role, nama, email }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 shrink-0 bg-[#1B4F72] min-h-screen flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <p className="text-white font-bold text-base leading-tight">PMB STIE Anindyaguna</p>
        <p className="text-white/50 text-xs mt-0.5">Panel Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="h-3 w-3 text-white/50" />}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 mb-2">
          <p className="text-white text-sm font-medium truncate">{nama ?? "—"}</p>
          <p className="text-white/50 text-xs truncate">{email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">
            {ROLE_LABEL[role] ?? role}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
