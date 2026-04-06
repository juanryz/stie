"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "";
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email atau password salah. Silakan coba lagi.");
        return;
      }

      toast.success("Login berhasil!");

      if (callbackUrl && callbackUrl.startsWith("/")) {
        router.push(callbackUrl);
      } else {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        const role = session?.user?.role;

        if (role === "PENDAFTAR") {
          router.push("/status");
        } else if (["SUPER_ADMIN", "ADMIN", "PANITIA"].includes(role)) {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }

      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-200px)]"
    >
      {/* KIRI: HEADLINE RAKSASA ALA HOME */}
      <div>
        <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-[#EAC956]/20">
          <span className="w-2 h-2 rounded-full bg-[#EAC956] animate-pulse"></span>
          Masuk ke Portal
        </div>
        <h1 className="text-[60px] sm:text-[80px] leading-[1.05] font-normal tracking-[-0.02em] text-white mb-6">
          Akses <br/>Dasbor
        </h1>
        <p className="text-[20px] text-[#D2CEBE] max-w-lg leading-relaxed mb-6">
          Lanjutkan proses pendaftaran Anda yang tertunda atau pantau pengumuman seleksi dari Dasbor Mahasiswa.
        </p>
        <Link href="/register" className="inline-flex items-center gap-2 text-[#EAC956] hover:text-[#FCE68A] transition-colors font-medium text-lg">
          Saya belum punya akun <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* KANAN: FORM M3 BESAR */}
      <div className="bg-[#2B2A23] p-8 sm:p-14 rounded-[32px] border border-[#494841] shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-8">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-[#EAC956] text-sm font-medium ml-2">Email Aktif</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className="bg-[#1C1A17] border-[#494841] focus-visible:ring-[#EAC956] text-white h-14 rounded-2xl px-5 text-lg"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-400 ml-2">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between ml-2 mr-2">
              <Label htmlFor="password" className="text-[#EAC956] text-sm font-medium">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#D2CEBE] hover:text-[#FCE68A] transition-colors"
              >
                Lupa Password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              className="bg-[#1C1A17] border-[#494841] focus-visible:ring-[#EAC956] text-white h-14 rounded-2xl px-5 text-lg cursor-text"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-400 ml-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-full h-14 text-lg font-medium shadow-md mt-6"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? "Proses..." : "Masuk"}
          </Button>
        </form>

        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-[#2D2A26]" />
          <span className="text-[#6A685F] text-sm">atau</span>
          <div className="flex-1 h-px bg-[#2D2A26]" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full border-[#494841] text-white bg-transparent hover:bg-[#1C1A17] rounded-full h-14 text-lg font-medium flex items-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Masuk dengan Google
        </Button>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="animate-spin h-10 w-10 text-[#EAC956]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
