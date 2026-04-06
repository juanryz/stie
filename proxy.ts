import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const { auth } = NextAuth(authConfig);

const DASHBOARD_ROLES = ["SUPER_ADMIN", "ADMIN", "PANITIA"];
const ADMIN_ROLES = ["SUPER_ADMIN"];
const PENDAFTAR_ROLES = ["PENDAFTAR"];

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const userRole = session?.user?.role as string | undefined;

  // Halaman yang butuh auth
  const protectedPaths = [
    "/dashboard", "/admin", "/verifikasi", "/laporan", "/settings", "/pengumuman",
    "/status", "/dokumen", "/kartu", "/daftar",
  ];
  const needsAuth = protectedPaths.some((p) => pathname.startsWith(p));

  if (needsAuth && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!session || !userRole) return NextResponse.next();

  // Proteksi /admin — hanya SUPER_ADMIN
  if (pathname.startsWith("/admin") && !ADMIN_ROLES.includes(userRole)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Proteksi /dashboard — tidak boleh PENDAFTAR
  if (pathname.startsWith("/dashboard") && PENDAFTAR_ROLES.includes(userRole)) {
    return NextResponse.redirect(new URL("/status", req.url));
  }

  // Proteksi /status, /dokumen, /kartu, /daftar — hanya PENDAFTAR
  const pendaftarPaths = ["/status", "/dokumen", "/kartu", "/daftar"];
  if (pendaftarPaths.some((p) => pathname.startsWith(p)) && DASHBOARD_ROLES.includes(userRole)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Proteksi /verifikasi, /laporan, /settings, /pengumuman — hanya DASHBOARD_ROLES
  const adminOnlyPaths = ["/verifikasi", "/laporan", "/settings", "/pengumuman"];
  if (adminOnlyPaths.some((p) => pathname.startsWith(p)) && PENDAFTAR_ROLES.includes(userRole)) {
    return NextResponse.redirect(new URL("/status", req.url));
  }

  // Jika sudah login, redirect dari halaman auth
  const authPaths = ["/login", "/register", "/forgot-password"];
  if (authPaths.includes(pathname)) {
    if (PENDAFTAR_ROLES.includes(userRole)) {
      return NextResponse.redirect(new URL("/status", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)"],
};
