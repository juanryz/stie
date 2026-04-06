"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, FileText, ImageIcon, Trash2, UploadCloud } from "lucide-react";

import { usePendaftaranFormStore, type DokumenFiles } from "@/store/pendaftaran-form";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/storage";
import { formatUkuranFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="bg-[#1B4F72] hover:bg-[#154060] gap-2"
        >
          Lanjut <ArrowRight className="h-4 w-4" />
        </Button>
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
    <div className="rounded-lg border border-border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            {field.label}
            {field.wajib ? (
              <span className="text-destructive ml-1">*</span>
            ) : (
              <span className="ml-1.5 text-xs text-muted-foreground">(opsional)</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">{field.hint}</p>
        </div>
        {file ? (
          <button
            type="button"
            onClick={() => { onFileChange(undefined); if (inputRef.current) inputRef.current.value = ""; }}
            className="text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Hapus file"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-[#1B4F72] font-medium hover:underline"
          >
            <UploadCloud className="h-4 w-4" />
            Pilih File
          </button>
        )}
      </div>

      {/* Preview / file info */}
      {file && (
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="h-10 w-10 object-cover rounded"
            />
          ) : (
            <FileText className="h-8 w-8 text-[#1B4F72] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatUkuranFile(file.size)}</p>
          </div>
          {!isImage && <ImageIcon className="h-4 w-4 text-muted-foreground hidden" />}
        </div>
      )}

      {displayError && (
        <p className="text-xs text-destructive">{displayError}</p>
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
