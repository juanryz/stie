import type {
  User,
  Pendaftar,
  Dokumen,
  RiwayatStatus,
  ProgramStudi,
  PeriodePMB,
  Role,
  StatusPMB,
  JalurMasuk,
  JenisKelamin,
  JenisDokumen,
  StatusDokumen,
  Jenjang,
} from "@prisma/client";

// Re-export Prisma enums
export type {
  Role,
  StatusPMB,
  JalurMasuk,
  JenisKelamin,
  JenisDokumen,
  StatusDokumen,
  Jenjang,
};

// Extended types with relations
export type PendaftarWithRelasi = Pendaftar & {
  user: Pick<User, "id" | "email" | "name">;
  prodi: ProgramStudi;
  periode: PeriodePMB;
  dokumen: Dokumen[];
  riwayatStatus: RiwayatStatus[];
};

export type DokumenWithPendaftar = Dokumen & {
  pendaftar: Pick<Pendaftar, "id" | "nama" | "noPendaftaran">;
};

// Session user type (diperluas dari Auth.js)
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

// Form types untuk multi-step form
export interface FormDataPribadi {
  nama: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: JenisKelamin;
  agama: string;
  alamat: string;
  kota: string;
  provinsi: string;
  kodePos?: string;
  noHp: string;
  email: string;
}

export interface FormDataPendidikan {
  asalSekolah: string;
  jurusanSekolah: string;
  tahunLulus: number;
  nilaiRataRata?: number;
}

export interface FormDataOrangTua {
  namaAyah?: string;
  namaIbu?: string;
  pekerjaanOrtu?: string;
  noHpOrtu?: string;
}

export interface FormDataProgram {
  prodiId: string;
  jalurMasuk: JalurMasuk;
}

export interface FormDataDokumen {
  foto?: File;
  ktp?: File;
  kartuKeluarga?: File;
  ijazahAtauSkl?: File;
  transkripNilai?: File;
  sertifikatPrestasi?: File;
}

export type FormDataPendaftaran = FormDataPribadi &
  FormDataPendidikan &
  FormDataOrangTua &
  FormDataProgram;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Dashboard statistik
export interface StatistikPMB {
  totalPendaftar: number;
  menungguVerifikasi: number;
  terverifikasi: number;
  diterima: number;
  ditolak: number;
  perProdi: Array<{
    nama: string;
    kode: string;
    jumlah: number;
    kuota: number;
  }>;
  perJalur: Array<{
    jalur: JalurMasuk;
    jumlah: number;
  }>;
  trenHarian: Array<{
    tanggal: string;
    jumlah: number;
  }>;
}

// Label mapping untuk enum
export const LABEL_STATUS: Record<StatusPMB, string> = {
  MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
  DOKUMEN_TIDAK_LENGKAP: "Dokumen Tidak Lengkap",
  TERVERIFIKASI: "Terverifikasi",
  TERDAFTAR_TES: "Terdaftar Tes",
  LULUS_TES: "Lulus Tes",
  TIDAK_LULUS_TES: "Tidak Lulus Tes",
  DITERIMA: "Diterima",
  DITOLAK: "Ditolak",
  DAFTAR_ULANG: "Daftar Ulang",
  MENGUNDURKAN_DIRI: "Mengundurkan Diri",
};

export const LABEL_JALUR: Record<JalurMasuk, string> = {
  REGULER: "Reguler",
  BEASISWA: "Beasiswa",
  TRANSFER: "Transfer",
  KERJASAMA: "Kerjasama",
};

export const LABEL_DOKUMEN: Record<JenisDokumen, string> = {
  FOTO: "Pas Foto",
  KTP: "KTP",
  KARTU_KELUARGA: "Kartu Keluarga",
  IJAZAH_ATAU_SKL: "Ijazah / SKL",
  TRANSKRIP_NILAI: "Transkrip Nilai",
  SERTIFIKAT_PRESTASI: "Sertifikat Prestasi",
};

export const LABEL_STATUS_DOKUMEN: Record<StatusDokumen, string> = {
  MENUNGGU: "Menunggu",
  VALID: "Valid",
  DITOLAK: "Ditolak",
};

export const WARNA_STATUS: Record<StatusPMB, string> = {
  MENUNGGU_VERIFIKASI: "bg-yellow-100 text-yellow-800",
  DOKUMEN_TIDAK_LENGKAP: "bg-orange-100 text-orange-800",
  TERVERIFIKASI: "bg-blue-100 text-blue-800",
  TERDAFTAR_TES: "bg-purple-100 text-purple-800",
  LULUS_TES: "bg-emerald-100 text-emerald-800",
  TIDAK_LULUS_TES: "bg-red-100 text-red-800",
  DITERIMA: "bg-green-100 text-green-800",
  DITOLAK: "bg-red-100 text-red-800",
  DAFTAR_ULANG: "bg-teal-100 text-teal-800",
  MENGUNDURKAN_DIRI: "bg-gray-100 text-gray-800",
};
