import { create } from "zustand";
import type {
  DataPribadiInput,
  DataPendidikanInput,
  DataOrangTuaInput,
  DataProgramInput,
} from "@/lib/validations/pendaftaran";

// File upload state (in-memory, tidak di-persist)
export interface DokumenFiles {
  foto?: File;
  ktp?: File;
  kartuKeluarga?: File;
  ijazahAtauSkl?: File;
  transkripNilai?: File;
  sertifikatPrestasi?: File;
}

interface PendaftaranFormState {
  step: number;
  dataPribadi: Partial<DataPribadiInput>;
  dataPendidikan: Partial<DataPendidikanInput>;
  dataOrangTua: Partial<DataOrangTuaInput>;
  dataProgram: Partial<DataProgramInput>;
  dokumenFiles: DokumenFiles;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setDataPribadi: (data: Partial<DataPribadiInput>) => void;
  setDataPendidikan: (data: Partial<DataPendidikanInput>) => void;
  setDataOrangTua: (data: Partial<DataOrangTuaInput>) => void;
  setDataProgram: (data: Partial<DataProgramInput>) => void;
  setDokumenFile: (key: keyof DokumenFiles, file: File | undefined) => void;
  reset: () => void;
}

const TOTAL_STEPS = 6;

export const usePendaftaranFormStore = create<PendaftaranFormState>((set) => ({
  step: 1,
  dataPribadi: {},
  dataPendidikan: {},
  dataOrangTua: {},
  dataProgram: {},
  dokumenFiles: {},

  setStep: (step) => set({ step }),
  nextStep: () =>
    set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

  setDataPribadi: (data) =>
    set((s) => ({ dataPribadi: { ...s.dataPribadi, ...data } })),
  setDataPendidikan: (data) =>
    set((s) => ({ dataPendidikan: { ...s.dataPendidikan, ...data } })),
  setDataOrangTua: (data) =>
    set((s) => ({ dataOrangTua: { ...s.dataOrangTua, ...data } })),
  setDataProgram: (data) =>
    set((s) => ({ dataProgram: { ...s.dataProgram, ...data } })),
  setDokumenFile: (key, file) =>
    set((s) => ({ dokumenFiles: { ...s.dokumenFiles, [key]: file } })),

  reset: () =>
    set({
      step: 1,
      dataPribadi: {},
      dataPendidikan: {},
      dataOrangTua: {},
      dataProgram: {},
      dokumenFiles: {},
    }),
}));
