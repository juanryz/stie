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
