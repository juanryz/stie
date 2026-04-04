import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PMB STIE Anindyaguna — Autentikasi",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block">
          <h1 className="text-2xl font-bold text-[#1B4F72]">
            PMB STIE Anindyaguna
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Penerimaan Mahasiswa Baru
          </p>
        </Link>
      </div>
      {children}
    </div>
  );
}
