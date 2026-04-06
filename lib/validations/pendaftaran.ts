import { z } from "zod";

const NIK_REGEX = /^\d{16}$/;
const PHONE_REGEX = /^(\+62|62|0)[8][1-9][0-9]{6,10}$/;

export const dataPribadiSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").max(100),
  nik: z
    .string()
    .regex(NIK_REGEX, "NIK harus 16 digit angka"),
  tempatLahir: z.string().min(2, "Tempat lahir wajib diisi"),
  tanggalLahir: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Format tanggal tidak valid"),
  jenisKelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"]),
  agama: z.enum([
    "Islam",
    "Kristen",
    "Katolik",
    "Hindu",
    "Buddha",
    "Konghucu",
  ]),
  alamat: z.string().min(10, "Alamat minimal 10 karakter"),
  kota: z.string().min(2, "Kota wajib diisi"),
  provinsi: z.string().min(2, "Provinsi wajib diisi"),
  kodePos: z.string().regex(/^\d{5}$/, "Kode pos harus 5 digit").optional().or(z.literal("")),
  noHp: z
    .string()
    .regex(PHONE_REGEX, "Format nomor HP tidak valid (contoh: 08xxxxxxxxxx)"),
  email: z.string().email("Format email tidak valid"),
});

export const dataPendidikanSchema = z.object({
  asalSekolah: z.string().min(3, "Nama sekolah wajib diisi"),
  jurusanSekolah: z.string().min(2, "Jurusan wajib diisi"),
  tahunLulus: z
    .number()
    .int()
    .min(2000, "Tahun lulus tidak valid")
    .max(new Date().getFullYear() + 1, "Tahun lulus tidak valid"),
  nilaiRataRata: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .or(z.nan().transform(() => undefined)),
});

export const dataOrangTuaSchema = z.object({
  namaAyah: z.string().optional(),
  namaIbu: z.string().optional(),
  pekerjaanOrtu: z.string().optional(),
  noHpOrtu: z
    .string()
    .regex(PHONE_REGEX, "Format nomor HP orang tua tidak valid")
    .optional()
    .or(z.literal("")),
});

export const dataProgramSchema = z.object({
  prodiId: z.string().min(1, "Program studi wajib dipilih"),
  jalurMasuk: z.enum(["REGULER", "BEASISWA", "TRANSFER", "KERJASAMA"]),
});

export const submitPendaftaranSchema = dataPribadiSchema
  .merge(dataPendidikanSchema)
  .merge(dataOrangTuaSchema)
  .merge(dataProgramSchema);

export type DataPribadiInput = z.infer<typeof dataPribadiSchema>;
export type DataPendidikanInput = z.infer<typeof dataPendidikanSchema>;
export type DataOrangTuaInput = z.infer<typeof dataOrangTuaSchema>;
export type DataProgramInput = z.infer<typeof dataProgramSchema>;
export type SubmitPendaftaranInput = z.infer<typeof submitPendaftaranSchema>;
