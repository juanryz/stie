import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FormPendaftaran } from "./form-pendaftaran";

export const metadata: Metadata = {
  title: "Formulir Pendaftaran — PMB STIE Anindyaguna",
};

async function getProdiList() {
  const list = await prisma.programStudi.findMany({
    where: { aktif: true },
    include: { _count: { select: { pendaftar: true } } },
  });
  return list.map((p) => ({
    id: p.id,
    kode: p.kode,
    nama: p.nama,
    jenjang: p.jenjang,
    kuota: p.kuota,
    sisaKuota: Math.max(0, p.kuota - p._count.pendaftar),
  }));
}

export default async function DaftarPage() {
  const prodiList = await getProdiList();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#1B4F72] text-white py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-bold">Formulir Pendaftaran Mahasiswa Baru</h1>
          <p className="text-white/70 mt-1 text-sm">
            STIE Anindyaguna Semarang — Isi semua data dengan lengkap dan benar
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <FormPendaftaran prodiList={prodiList} />
      </div>
    </div>
  );
}
