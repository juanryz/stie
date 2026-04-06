"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Gagal membuat akun. Silakan coba lagi.");
        return;
      }

      const loginResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (loginResult?.error) {
        toast.success(
          "Akun berhasil dibuat! Silakan masuk dengan email dan password Anda."
        );
        router.push("/login");
        return;
      }

      toast.success("Akun berhasil dibuat! Selamat datang.");
      router.push("/status");
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
          Tahap 1 Pendaftaran
        </div>
        <h1 className="text-[60px] sm:text-[80px] leading-[1.05] font-normal tracking-[-0.02em] text-white mb-6">
          Buat <br/>Akun Baru
        </h1>
        <p className="text-[20px] text-[#D2CEBE] max-w-lg leading-relaxed mb-6">
          Selamat datang di portal PMB STIE Anindyaguna. Silakan daftarkan diri Anda sebelum bisa memulai pengisian formulir biodata lengkap.
        </p>
        <Link href="/login" className="inline-flex items-center gap-2 text-[#EAC956] hover:text-[#FCE68A] transition-colors font-medium text-lg">
          Saya sudah punya akun <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* KANAN: FORM M3 BESAR */}
      <div className="bg-[#2B2A23] p-8 sm:p-14 rounded-[32px] border border-[#494841] shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-[#EAC956] text-sm font-medium ml-2">Nama Lengkap Sesuai KTP</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              aria-invalid={!!errors.name}
              className="bg-[#1C1A17] border-[#494841] focus-visible:ring-[#EAC956] text-white h-14 rounded-2xl px-5 text-lg"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-400 ml-2">{errors.name.message}</p>
            )}
          </div>

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
            <Label htmlFor="password" className="text-[#EAC956] text-sm font-medium ml-2">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="bg-[#1C1A17] border-[#494841] focus-visible:ring-[#EAC956] text-white h-14 rounded-2xl px-5 text-lg"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-400 ml-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-[#EAC956] text-sm font-medium ml-2">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ulangi password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              className="bg-[#1C1A17] border-[#494841] focus-visible:ring-[#EAC956] text-white h-14 rounded-2xl px-5 text-lg"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400 ml-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-full h-14 text-lg font-medium shadow-md mt-4"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? "Membuat akun..." : "Buat Akun Sekarang"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
