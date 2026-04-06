"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="space-y-4">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={i}
            initial={false}
            animate={{
              backgroundColor: isOpen ? "#D1E4FF" : "#FFFFFF",
            }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-[#E0E2E4] overflow-hidden shadow-sm"
          >
            <button
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className={cn(
                "font-semibold text-base transition-colors duration-300",
                isOpen ? "text-[#001D36]" : "text-[#1A1C1E] hover:text-[#0061A4]"
              )}>
                {item.pertanyaan}
              </span>
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  isOpen ? "bg-[#0061A4] text-white" : "bg-[#FDFBFF] text-[#43474E]"
                )}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto", marginBottom: 20 },
                    collapsed: { opacity: 0, height: 0, marginBottom: 0 }
                  }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number] }}
                >
                  <div className="px-6 pb-2 text-[15px] text-[#001D36]/80 leading-relaxed font-medium">
                    {item.jawaban}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
