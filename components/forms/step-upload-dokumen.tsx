"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, FileText, ImageIcon, Trash2, UploadCloud } from "lucide-react";

import { usePendaftaranFormStore, type DokumenFiles } from "@/store/pendaftaran-form";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/storage-config";
import { cn } from "@/lib/utils";
import { formatUkuranFile } from "@/lib/utils";
import { JenisDokumen } from "@prisma/client";

interface DokumenField {
  key: keyof DokumenFiles;
  jenis: JenisDokumen;
  label: string;
  wajib: boolean;
  hint: string;
}

const DOKUMEN_FIELDS: DokumenField[] = [
  {
    key: "foto",
    jenis: "FOTO",
    label: "Pas Foto Terbaru",
    wajib: true,
    hint: "JPG/PNG, maks. 1 MB. Foto formal terbaru.",
  },
  {
    key: "ktp",
    jenis: "KTP",
    label: "KTP",
    wajib: true,
    hint: "JPG/PDF, maks. 2 MB. KTP calon mahasiswa.",
  },
  {
    key: "kartuKeluarga",
    jenis: "KARTU_KELUARGA",
    label: "Kartu Keluarga",
    wajib: true,
    hint: "JPG/PDF, maks. 2 MB.",
  },
  {
    key: "ijazahAtauSkl",
    jenis: "IJAZAH_ATAU_SKL",
    label: "Ijazah / SKL",
    wajib: true,
    hint: "PDF, maks. 5 MB. Scan ijazah atau Surat Keterangan Lulus.",
  },
  {
    key: "transkripNilai",
    jenis: "TRANSKRIP_NILAI",
    label: "Transkrip / Rapor Nilai",
    wajib: true,
    hint: "PDF, maks. 5 MB.",
  },
  {
    key: "sertifikatPrestasi",
    jenis: "SERTIFIKAT_PRESTASI",
    label: "Sertifikat Prestasi",
    wajib: false,
    hint: "JPG/PDF, maks. 2 MB. Opsional, untuk jalur Beasiswa.",
  },
];

export function StepUploadDokumen() {
  const { dokumenFiles, setDokumenFile, nextStep, prevStep } =
    usePendaftaranFormStore();
  const [errors, setErrors] = useState<Partial<Record<keyof DokumenFiles, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof DokumenFiles, string>> = {};
    for (const field of DOKUMEN_FIELDS) {
      if (field.wajib && !dokumenFiles[field.key]) {
        newErrors[field.key] = `${field.label} wajib diunggah`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validate()) nextStep();
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Unggah dokumen dalam format yang ditentukan. Pastikan file jelas dan dapat dibaca.
      </p>

      <div className="space-y-3">
        {DOKUMEN_FIELDS.map((field) => (
          <DokumenUploadRow
            key={field.key}
            field={field}
            file={dokumenFiles[field.key]}
            error={errors[field.key]}
            onFileChange={(file) => {
              setDokumenFile(field.key, file);
              if (file) setErrors((e) => ({ ...e, [field.key]: undefined }));
            }}
          />
        ))}
      </div>

      <div className="flex justify-between items-center pt-10 border-t border-[#2D2A26] mt-12">
        <button 
          type="button" 
          onClick={prevStep} 
          className="h-16 px-8 bg-white/5 hover:bg-white/10 text-[#D2CEBE] rounded-[24px] font-bold text-lg flex items-center gap-3 transition-all border border-white/5"
        >
          <ArrowLeft className="w-6 h-6" /> Kembali
        </button>
        <button 
          type="button" 
          onClick={handleNext} 
          className="h-16 px-12 bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] rounded-[24px] font-bold text-lg flex items-center gap-3 shadow-3xl hover:scale-105 transition-all"
        >
          Lanjut ke Review <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function DokumenUploadRow({
  field,
  file,
  error,
  onFileChange,
}: {
  field: DokumenField;
  file: File | undefined;
  error: string | undefined;
  onFileChange: (f: File | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string>();

  const allowedMimes = ALLOWED_MIME_TYPES[field.jenis] as readonly string[];
  const maxSize = MAX_FILE_SIZE[field.jenis];

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!allowedMimes.includes(f.type)) {
      setLocalError(`Format file tidak valid. Gunakan: ${allowedMimes.join(", ")}`);
      return;
    }
    if (f.size > maxSize) {
      setLocalError(`Ukuran file terlalu besar. Maks. ${formatUkuranFile(maxSize)}`);
      return;
    }

    setLocalError(undefined);
    onFileChange(f);
  }

  const isImage = file?.type.startsWith("image/");
  const displayError = localError ?? error;

  return (
    <div className={cn("rounded-2xl border-2 border-[#2D2A26] bg-black/20 p-5 space-y-4 transition-colors group", file ? "border-[#EAC956]/50" : "hover:border-[#EAC956]/40", displayError && "border-red-400/50")}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-white mb-1">
            {field.label}
            {field.wajib ? (
              <span className="text-red-400 ml-1.5">*</span>
            ) : (
              <span className="ml-2 text-[10px] font-bold text-[#6A685F] uppercase tracking-widest">(opsional)</span>
            )}
          </p>
          <p className="text-xs text-[#D2CEBE] font-light">{field.hint}</p>
        </div>
        {file ? (
          <button
            type="button"
            onClick={() => { onFileChange(undefined); if (inputRef.current) inputRef.current.value = ""; }}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors shrink-0"
            aria-label="Hapus file"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="h-10 px-4 rounded-xl flex items-center gap-2 text-sm font-bold bg-white/5 text-white hover:bg-[#EAC956] hover:text-[#3A2E00] transition-colors shrink-0 border border-white/10"
          >
            <UploadCloud className="h-4 w-4" />
            Upload
          </button>
        )}
      </div>

      {/* Preview / file info */}
      {file && (
        <div className="flex items-center gap-4 rounded-xl bg-black/40 px-4 py-3 border border-[#2D2A26]">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="h-12 w-12 object-cover rounded-lg border border-white/10"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-[#EAC956]/10 flex items-center justify-center text-[#EAC956]">
               <FileText className="h-6 w-6" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{file.name}</p>
            <p className="text-[10px] font-bold text-[#EAC956] tracking-widest uppercase mt-0.5">{formatUkuranFile(file.size)}</p>
          </div>
        </div>
      )}

      {displayError && (
        <p className="text-[10px] font-bold text-red-400 tracking-tighter uppercase">{displayError}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={allowedMimes.join(",")}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
