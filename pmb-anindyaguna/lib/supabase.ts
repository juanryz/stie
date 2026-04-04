import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client untuk sisi browser (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client untuk sisi server (service role — bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const STORAGE_BUCKET = "pmb-dokumen";

/**
 * Generate signed URL untuk akses dokumen (berlaku 1 jam)
 */
export async function getSignedUrl(filePath: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filePath, 3600); // 1 jam

  if (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }

  return data.signedUrl;
}

/**
 * Upload file ke Supabase Storage, return path file
 */
export async function uploadFile(
  file: Buffer,
  filePath: string,
  contentType: string
): Promise<string> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      contentType,
      upsert: false,
    });

  if (error) throw new Error(`Upload gagal: ${error.message}`);

  return filePath;
}

/**
 * Hapus file dari Supabase Storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([filePath]);

  if (error) throw new Error(`Hapus file gagal: ${error.message}`);
}

// Tipe MIME yang diizinkan per jenis dokumen
export const ALLOWED_MIME_TYPES = {
  FOTO: ["image/jpeg", "image/png", "image/webp"],
  KTP: ["image/jpeg", "image/png", "application/pdf"],
  KARTU_KELUARGA: ["image/jpeg", "image/png", "application/pdf"],
  IJAZAH_ATAU_SKL: ["application/pdf"],
  TRANSKRIP_NILAI: ["application/pdf"],
  SERTIFIKAT_PRESTASI: ["image/jpeg", "image/png", "application/pdf"],
} as const;

// Ukuran maksimal per jenis dokumen (dalam bytes)
export const MAX_FILE_SIZE = {
  FOTO: 1 * 1024 * 1024, // 1 MB
  KTP: 2 * 1024 * 1024, // 2 MB
  KARTU_KELUARGA: 2 * 1024 * 1024, // 2 MB
  IJAZAH_ATAU_SKL: 5 * 1024 * 1024, // 5 MB
  TRANSKRIP_NILAI: 5 * 1024 * 1024, // 5 MB
  SERTIFIKAT_PRESTASI: 2 * 1024 * 1024, // 2 MB
} as const;
