"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
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

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(_data: ForgotPasswordInput) {
    setIsLoading(true);
    // TODO: Implementasi kirim email reset password (Step 8 - Email notifikasi)
    // Untuk sekarang simulasi delay
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
    toast.info("Jika email terdaftar, instruksi reset password telah dikirim.");
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-6 text-center">
          <div className="rounded-full bg-blue-100 p-4">
            <MailCheck className="h-8 w-8 text-[#1B4F72]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Cek Email Anda</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Jika email Anda terdaftar, kami telah mengirimkan instruksi untuk
              mereset password. Periksa folder spam jika tidak ada di inbox.
            </p>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              className="mt-2 border-[#1B4F72] text-[#1B4F72]"
            >
              Kembali ke Halaman Masuk
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Lupa Password</CardTitle>
        <CardDescription>
          Masukkan email Anda dan kami akan mengirimkan instruksi reset password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-[#1B4F72] hover:bg-[#154060]"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Mengirim..." : "Kirim Instruksi Reset"}
          </Button>

          <Link
            href="/login"
            className="text-sm text-center text-[#1B4F72] hover:underline"
          >
            Kembali ke halaman masuk
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
