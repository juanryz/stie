import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ke format Indonesia
 */
export function formatTanggal(
  tanggal: Date | string,
  withTime = false
): string {
  const d = typeof tanggal === "string" ? new Date(tanggal) : tanggal;
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  };
  return d.toLocaleDateString("id-ID", opts);
}

/**
 * Format ukuran file ke string yang mudah dibaca
 */
export function formatUkuranFile(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Generate nomor pendaftaran
 * Format: ANINDYA-[TAHUN]-[KODE_PRODI]-[NO_URUT_4_DIGIT]
 */
export function generateNoPendaftaran(
  tahun: number,
  kodeProdi: string,
  noUrut: number
): string {
  return `ANINDYA-${tahun}-${kodeProdi}-${String(noUrut).padStart(4, "0")}`;
}

/**
 * Validasi format NIK Indonesia (16 digit angka)
 */
export function isValidNIK(nik: string): boolean {
  return /^\d{16}$/.test(nik);
}

/**
 * Validasi format nomor HP Indonesia
 */
export function isValidNoHp(noHp: string): boolean {
  return /^(\+62|62|0)[8][1-9][0-9]{6,10}$/.test(noHp);
}

/**
 * Truncate teks panjang dengan ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
