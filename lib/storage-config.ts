export const MAX_FILE_SIZE: Record<string, number> = {
  FOTO: 2 * 1024 * 1024,
  KTP: 2 * 1024 * 1024,
  KARTU_KELUARGA: 2 * 1024 * 1024,
  IJAZAH_ATAU_SKL: 5 * 1024 * 1024,
  TRANSKRIP_NILAI: 5 * 1024 * 1024,
  SERTIFIKAT_PRESTASI: 5 * 1024 * 1024,
};

const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
const docTypes = ["application/pdf", ...imageTypes];

export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  FOTO: imageTypes,
  KTP: docTypes,
  KARTU_KELUARGA: docTypes,
  IJAZAH_ATAU_SKL: docTypes,
  TRANSKRIP_NILAI: docTypes,
  SERTIFIKAT_PRESTASI: docTypes,
};
