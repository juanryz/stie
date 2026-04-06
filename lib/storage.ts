import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Implementasi Storage Lokal Sederhana di /public/uploads
// Untuk penggunaan jangka panjang di hosting seperti Vercel, integrasikan Vercel Blob / AWS S3.

export async function uploadFile(
  file: File | Blob | Buffer,
  filePath: string,
  contentType?: string
) {
  try {
    const pubDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(pubDir, { recursive: true });
    
    const fullDest = path.join(pubDir, filePath);
    await mkdir(path.dirname(fullDest), { recursive: true });
    
    let buffer: Buffer;
    if (Buffer.isBuffer(file)) {
      buffer = file;
    } else {
      buffer = Buffer.from(await (file as File | Blob).arrayBuffer());
    }
    
    await writeFile(fullDest, buffer);
    
    return { path: `/uploads/${filePath}`, error: null };
  } catch (error) {
    console.error("Local upload error:", error);
    return { path: null, error };
  }
}

export async function getSignedUrl(filePath: string) {
  // Dalam penyimpanan lokal, kita cukup mengekspos public direktori
  if (filePath.startsWith("/uploads/")) {
    return filePath;
  }
  return `/uploads/${filePath}`;
}

export * from "./storage-config";
