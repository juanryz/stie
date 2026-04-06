import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FormPendaftaran } from "./form-pendaftaran";

export const dynamic = "force-dynamic";
import { GraduationCap, Sparkles } from "lucide-react";

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
    <div className="max-w-6xl mx-auto pb-32">
       {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 border-b border-[#2D2A26] pb-12">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#EAC956]/20 ring-1 ring-[#EAC956]/10">
             <Sparkles className="w-4 h-4" />
             Registration Intake
           </div>
           <h1 className="text-6xl text-white font-normal tracking-tighter">Mulai Masa Depan Anda</h1>
           <p className="text-xl text-[#D2CEBE] font-light italic">Isi data Anda secara bertahap dan rapi untuk bergabung ke STIE Anindyaguna.</p>
        </div>

        <div className="px-8 py-4 rounded-3xl border border-[#EAC956]/30 bg-[#EAC956]/10 text-[#EAC956] flex items-center gap-4 shadow-2xl transition-all">
          <div className="w-12 h-12 rounded-2xl bg-current/10 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">PMB Online</p>
            <p className="text-xl font-bold">STIE Anindyaguna</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <FormPendaftaran prodiList={prodiList} />
      </div>
    </div>
  );
}
