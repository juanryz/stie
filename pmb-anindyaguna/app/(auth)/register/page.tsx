"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      // Buat akun baru
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

      // Otomatis login setelah register berhasil
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
    <Card className="w-full max-w-md bg-[#2B2A23] border-[#494841] text-white">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-normal">Buat Akun</CardTitle>
        <CardDescription className="text-[#D2CEBE]">
          Daftar akun untuk memulai proses pendaftaran mahasiswa baru
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#EAC956]">Nama Lengkap</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nama sesuai KTP"
              autoComplete="name"
              aria-invalid={!!errors.name}
              className="bg-[#1C1A17] border-[#494841] focus-visible:ring-[#EAC956] text-white"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#EAC956]">Email Aktif</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className="bg-[#1C1A17] border-[#494841] focus-visible:ring-[#EAC956] text-white"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#EAC956]">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 karakter, huruf besar & angka"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="bg-[#1C1A17] border-[#494841] focus-visible:ring-[#EAC956] text-white"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#EAC956]">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ulangi password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              className="bg-[#1C1A17] border-[#494841] focus-visible:ring-[#EAC956] text-white"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-full h-12 text-lg font-medium shadow-md"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Membuat akun..." : "Buat Akun"}
          </Button>

          <p className="text-sm text-center text-[#D2CEBE]">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-[#EAC956] font-medium hover:text-[#FCE68A]"
            >
              Masuk di sini
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
