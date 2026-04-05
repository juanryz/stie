"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { loginSchema, type LoginInput } from "@/lib/validations/auth";
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
    <Card className="w-full max-w-md bg-[#2B2A23] border-[#494841] text-white">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-normal">Masuk</CardTitle>
        <CardDescription className="text-[#D2CEBE]">
          Masukkan email dan password untuk masuk ke akun Anda
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#EAC956]">Email</Label>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[#EAC956]">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#EAC956] hover:text-[#FCE68A]"
              >
                Lupa password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
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
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-full h-12 text-lg font-medium shadow-md"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>

          <p className="text-sm text-center text-[#D2CEBE]">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-[#1B4F72] font-medium hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-[#1B4F72]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
