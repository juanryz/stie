"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    pertanyaan: "Siapa yang bisa mendaftar di STIE Anindyaguna?",
    jawaban:
      "Lulusan SMA/SMK/MA atau sederajat semua jurusan dapat mendaftar. Untuk jalur Transfer, terbuka bagi lulusan D3 yang ingin melanjutkan ke S1.",
  },
  {
    pertanyaan: "Berapa biaya pendaftaran PMB?",
    jawaban:
      "Biaya pendaftaran dan informasi lengkap mengenai biaya studi dapat diperoleh melalui panitia PMB. Hubungi kami di nomor yang tertera pada halaman kontak.",
  },
  {
    pertanyaan: "Apakah ada beasiswa yang tersedia?",
    jawaban:
      "Ya, STIE Anindyaguna menyediakan jalur beasiswa bagi pendaftar berprestasi. Dokumen pendukung seperti sertifikat prestasi dan nilai rapor diperlukan untuk seleksi beasiswa.",
  },
  {
    pertanyaan: "Dokumen apa saja yang harus disiapkan untuk mendaftar?",
    jawaban:
      "Dokumen yang dibutuhkan: (1) Pas foto terbaru, (2) KTP/Kartu Keluarga, (3) Ijazah atau Surat Keterangan Lulus (SKL), (4) Transkrip/rapor nilai, dan (5) Sertifikat prestasi (opsional untuk jalur beasiswa).",
  },
  {
    pertanyaan: "Bagaimana alur proses seleksi PMB?",
    jawaban:
      "Alurnya: Daftar online → Upload dokumen → Verifikasi oleh panitia → Jadwal tes masuk → Pengumuman hasil → Daftar ulang. Setiap perubahan status akan dikirimkan notifikasi ke email Anda.",
  },
  {
    pertanyaan: "Berapa lama proses verifikasi dokumen?",
    jawaban:
      "Proses verifikasi dokumen biasanya berlangsung 3–5 hari kerja setelah semua dokumen lengkap diunggah. Anda akan mendapat notifikasi email saat status berubah.",
  },
  {
    pertanyaan: "Apakah bisa mendaftar lebih dari satu program studi?",
    jawaban:
      "Saat ini setiap pendaftar hanya dapat memilih satu program studi per periode PMB. Pilih program studi yang paling sesuai dengan minat dan rencana karier Anda.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i}>
          <button
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/50 transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="font-medium text-sm sm:text-base">
              {item.pertanyaan}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                openIndex === i && "rotate-180"
              )}
            />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed bg-muted/20">
              {item.jawaban}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
