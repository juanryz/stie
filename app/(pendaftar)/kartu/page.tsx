import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LABEL_JALUR, LABEL_STATUS } from "@/types";
import { formatTanggal } from "@/lib/utils";
import { PrintButton } from "./print-button";
import { 
  CreditCard, 
  Printer, 
  ShieldCheck, 
  Info, 
  Fingerprint, 
  GraduationCap, 
  Calendar,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kartu Pendaftaran — PMB STIE Anindyaguna",
};

async function getPendaftarFull(userId: string) {
  return prisma.pendaftar.findUnique({
    where: { userId },
    include: { prodi: true, periode: true },
  });
}

export default async function KartuPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const pendaftar = await getPendaftarFull(session.user.id);
  if (!pendaftar) redirect("/daftar");

  // Fetch config for branding
  const config = await (prisma as any).systemConfig.findFirst().catch(() => null);

  return (
    <div className="max-w-5xl mx-auto pb-32">
       {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#2D2A26] pb-10 print:hidden">
        <div>
          <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#EAC956]/20 ring-1 ring-[#EAC956]/10">
            <CreditCard className="w-4 h-4" />
            Kartu Identitas
          </div>
          <h1 className="text-5xl text-white font-normal tracking-tight">Kartu Pendaftaran</h1>
          <p className="text-[#D2CEBE] font-light mt-2 italic">Gunakan kartu ini sebagai tanda pengenal resmi selama proses seleksi PMB.</p>
        </div>
        
        <PrintButton />
      </div>

      {/* KARTU PREVIEW */}
      <div className="relative group max-w-2xl mx-auto">
         {/* Atmospheric Glow */}
         <div className="absolute inset-0 bg-[#EAC956]/5 blur-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
         
         <div
            id="kartu-pendaftaran"
            className="bg-[#1C1A17] border-2 border-[#2D2A26] rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] relative z-10 print:border print:shadow-none print:rounded-none print:bg-white print:text-black"
         >
            {/* Header kartu */}
            <div className="bg-[#EAC956] p-10 flex flex-col md:flex-row justify-between items-center gap-6 print:bg-gray-100 print:text-black">
               <div className="flex items-center gap-6">
                   <div className="w-20 h-20 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl bg-transparent border-2 border-white/20 ring-4 ring-white/5">
                      {config?.logoUrl ? (
                         <img src={config.logoUrl} className="w-full h-full object-cover scale-[1.02]" />
                      ) : (
                         <GraduationCap className="w-10 h-10 text-[#3A2E00]" />
                      )}
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-[#3A2E00] uppercase tracking-tighter leading-none mb-1">{config?.namaInstansi || "STIE Anindyaguna"}</h2>
                      <p className="text-xs font-bold text-[#3A2E00]/60 uppercase tracking-widest">Penerimaan Mahasiswa Baru</p>
                   </div>
               </div>
               
               <div className="text-center md:text-right">
                  <div className="bg-black/10 px-4 py-2 rounded-2xl mb-2">
                     <p className="text-[10px] font-bold text-[#3A2E00] uppercase tracking-widest opacity-60">ID Registrasi</p>
                     <p className="text-2xl font-mono font-bold text-[#3A2E00] tracking-tighter">{pendaftar.noPendaftaran}</p>
                  </div>
               </div>
            </div>

            {/* Status Strip */}
            <div className="bg-black/20 px-10 py-3 border-b border-[#2D2A26] flex items-center justify-between">
               <span className="text-[10px] font-bold text-[#EAC956] uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Terdaftar {LABEL_JALUR[pendaftar.jalurMasuk]}
               </span>
               <span className="text-xs font-bold text-white uppercase italic">TA {pendaftar.periode.tahunAjaran}</span>
            </div>

            {/* Body kartu */}
            <div className="p-10 lg:p-14 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
               <KartuInfo label="Nama Pendaftar" value={pendaftar.nama} span />
               <KartuInfo label="Identitas (NIK)" value={pendaftar.nik} />
               <KartuInfo label="Jenis Kelamin" value={pendaftar.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"} />
               <KartuInfo label="Program Studi" value={pendaftar.prodi.nama} span />
               
               <div className="col-span-full border-t border-dashed border-[#2D2A26] py-2" />
               
               <KartuInfo label="Gelombang" value={pendaftar.periode.nama} />
               <KartuInfo label="Tahun Lulus" value={String(pendaftar.tahunLulus)} />
               <KartuInfo label="Asal Sekolah" value={pendaftar.asalSekolah} span />
            </div>

            {/* Footer kartu */}
            <div className="bg-black/30 p-10 border-t border-[#2D2A26] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2D2A26] rounded-xl flex items-center justify-center">
                     <Sparkles className="w-6 h-6 text-[#EAC956]" />
                  </div>
                  <p className="text-xs text-[#D2CEBE] font-light leading-relaxed">Kartu ini diterbitkan secara otomatis oleh sistem PMB online STIE Anindyaguna.</p>
               </div>
               <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest mb-1">Diterbitkan Pada</p>
                  <p className="text-xs text-white font-bold">{new Date(pendaftar.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
               </div>
            </div>
         </div>
      </div>

      <div className="mt-16 bg-[#2B2A23]/30 border border-[#2D2A26] rounded-[48px] p-10 flex items-center gap-6 print:hidden">
         <div className="w-16 h-16 bg-[#EAC956]/10 rounded-3xl flex items-center justify-center text-[#EAC956] shrink-0">
            <Info className="w-8 h-8" />
         </div>
         <p className="text-sm text-[#D2CEBE] font-light leading-relaxed">
            <strong>Catatan Penting:</strong> Harap simpan kartu ini dalam format PDF atau cetak pada kertas A4. Kartu ini wajib dibawa saat mengikuti seleksi wawancara atau verifikasi berkas fisik di kampus.
         </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .print\\:hidden { display: none !important; }
          #kartu-pendaftaran { 
            border: 1px solid #ddd !important; 
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          #kartu-pendaftaran * { color: black !important; }
        }
      `}} />
    </div>
  );
}

function KartuInfo({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={cn("space-y-1.5", span ? "col-span-full" : "col-span-1")}>
      <p className="text-[10px] font-bold text-[#6A685F] uppercase tracking-widest transition-colors group-hover:text-[#EAC956]">{label}</p>
      <p className="text-xl text-white font-light tracking-tight">{value}</p>
    </div>
  );
}
