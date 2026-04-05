import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PMB STIE Anindyaguna Semarang",
  description:
    "Sistem Penerimaan Mahasiswa Baru STIE Anindyaguna Semarang — Daftarkan diri Anda sekarang",
};

import { M3Shell } from "@/components/m3-shell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#111111]">
        <Providers>
          <M3Shell>
            {children}
          </M3Shell>
        </Providers>
      </body>
    </html>
  );
}
