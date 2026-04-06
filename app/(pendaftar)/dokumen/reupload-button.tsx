"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from "@/lib/storage-config";
import type { JenisDokumen } from "@prisma/client";
import { formatUkuranFile } from "@/lib/utils";

interface Props {
  dokumenId: string;
  jenis: JenisDokumen;
}

export function ReuploadButton({ dokumenId, jenis }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const allowedMimes = ALLOWED_MIME_TYPES[jenis] as readonly string[];
  const maxSize = MAX_FILE_SIZE[jenis];

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedMimes.includes(file.type)) {
      toast.error(`Format file tidak valid. Gunakan: ${allowedMimes.map(t => t.split('/')[1] || t).join(", ").toUpperCase()}`);
      return;
    }
    
    if (file.size > maxSize) {
      toast.error(`Ukuran file terlalu besar. Maks. ${formatUkuranFile(maxSize)}`);
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/dokumen/${dokumenId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengunggah dokumen baru.");
      }

      toast.success("Dokumen berhasil diperbarui.");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah dokumen baru.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input 
        type="file" 
        className="hidden" 
        ref={inputRef} 
        onChange={handleFileChange} 
        accept={allowedMimes.join(",")} 
        disabled={isUploading} 
      />
      <button 
        type="button" 
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-[#EAC956]/50 bg-transparent text-[#EAC956] text-xs font-bold uppercase tracking-widest hover:bg-[#EAC956] hover:text-[#3A2E00] transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#EAC956] disabled:cursor-not-allowed group/reupload"
      >
        {isUploading ? (
           <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
           <UploadCloud className="w-4 h-4 group-hover/reupload:-translate-y-px transition-transform" />
        )}
        Re-Upload
      </button>
    </>
  );
}
