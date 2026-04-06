"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StepIndicator } from "@/components/forms/step-indicator";
import { StepDataPribadi } from "@/components/forms/step-data-pribadi";
import { StepDataPendidikan } from "@/components/forms/step-data-pendidikan";
import { StepDataOrangTua } from "@/components/forms/step-data-orangtua";
import { StepDataProgram } from "@/components/forms/step-data-program";
import { StepUploadDokumen } from "@/components/forms/step-upload-dokumen";
import { StepReview } from "@/components/forms/step-review";
import { usePendaftaranFormStore } from "@/store/pendaftaran-form";

interface Prodi {
  id: string;
  kode: string;
  nama: string;
  jenjang: string;
  kuota: number;
  sisaKuota: number;
}

const STEP_META = [
  { title: "Data Pribadi", desc: "Isi data diri sesuai KTP" },
  { title: "Data Pendidikan", desc: "Informasi sekolah asal" },
  { title: "Data Orang Tua", desc: "Informasi orang tua / wali" },
  { title: "Pilihan Program", desc: "Pilih prodi dan jalur masuk" },
  { title: "Upload Dokumen", desc: "Unggah dokumen persyaratan" },
  { title: "Review & Kirim", desc: "Periksa ulang sebelum mengirim" },
];

export function FormPendaftaran({ prodiList }: { prodiList: Prodi[] }) {
  const { step } = usePendaftaranFormStore();
  const meta = STEP_META[step - 1];

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={step} />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-[#1B4F72]">{meta?.title}</CardTitle>
          <CardDescription>{meta?.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && <StepDataPribadi />}
          {step === 2 && <StepDataPendidikan />}
          {step === 3 && <StepDataOrangTua />}
          {step === 4 && <StepDataProgram prodiList={prodiList} />}
          {step === 5 && <StepUploadDokumen />}
          {step === 6 && <StepReview prodiList={prodiList} />}
        </CardContent>
      </Card>
    </div>
  );
}
