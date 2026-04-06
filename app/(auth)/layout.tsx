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
    <div className="pt-16 pb-20 px-8 sm:px-16 lg:px-24 w-full h-full text-white">
      {children}
    </div>
  );
}
