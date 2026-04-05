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
    <div className="flex flex-col items-center justify-center p-4 min-h-[80vh]">
      <div className="mb-8 text-center mt-12">
        <Link href="/" className="inline-block">
          <h1 className="text-3xl font-normal text-[#EAC956]">
            STIE Anindyaguna
          </h1>
          <p className="text-sm text-[#D2CEBE] mt-1">
            Penerimaan Mahasiswa Baru
          </p>
        </Link>
      </div>
      {children}
    </div>
  );
}
