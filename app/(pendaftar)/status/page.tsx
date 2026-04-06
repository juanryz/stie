import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

import { 
  CheckCircle2, Clock, FileText, CreditCard, AlertCircle, XCircle, 
  ArrowRight, ShieldCheck, Calendar, MapPin, GraduationCap, 
  User, Mail, Phone, Fingerprint, Sparkles, Pin
} from "lucide-react";
import { LABEL_STATUS, LABEL_JALUR, WARNA_STATUS } from "@/types";
import { formatTanggal } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { StatusPMB } from "@prisma/client";

export const metadata: Metadata = {
  title: "Status Pendaftaran — PMB STIE Anindyaguna",
};

const STATUS_ICON: Record<StatusPMB, React.ElementType> = {
  MENUNGGU_VERIFIKASI: Clock,
  DOKUMEN_TIDAK_LENGKAP: AlertCircle,
  TERVERIFIKASI: CheckCircle2,
  TERDAFTAR_TES: CheckCircle2,
  LULUS_TES: Sparkles,
  TIDAK_LULUS_TES: XCircle,
  DITERIMA: ShieldCheck,
  DITOLAK: XCircle,
  DAFTAR_ULANG: Sparkles,
  MENGUNDURKAN_DIRI: XCircle,
};

async function getPendaftar(userId: string) {
  return prisma.pendaftar.findUnique({
    where: { userId },
    include: {
      prodi: true,
      periode: true,
      riwayatStatus: { orderBy: { createdAt: "desc" } },
      dokumen: { orderBy: { uploadedAt: "asc" } },
    },
  });
}

export default async function StatusPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const pendaftar = await getPendaftar(session.user.id);

  if (!pendaftar) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-24 h-24 bg-[#EAC956]/5 rounded-full flex items-center justify-center mb-8 border border-[#EAC956]/20 shadow-2xl">
           <GraduationCap className="h-10 w-10 text-[#EAC956]" />
        </div>
        <h2 className="text-4xl text-white font-normal mb-4 tracking-tight">Belum Ada Pendaftaran</h2>
        <p className="text-[#D2CEBE] font-light max-w-md mx-auto mb-10 leading-relaxed">
          Anda belum memulai proses pendaftaran di portal PMB. Daftarkan diri Anda sekarang untuk bergabung bersama STIE Anindyaguna.
        </p>
        <Link href="/daftar">
          <Button className="bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] h-14 px-10 rounded-2xl font-bold text-lg shadow-3xl hover:scale-105 transition-all">
            Mulai Pendaftaran Sekarang <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    );
  }

  const Icon = STATUS_ICON[pendaftar.status];
  const dokumenValid = pendaftar.dokumen.filter((d) => d.status === "VALID").length;
  const dokumenTotal = pendaftar.dokumen.length;

  return (
    <div className="max-w-6xl mx-auto pb-32">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 border-b border-[#2D2A26] pb-12">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#EAC956]/20 ring-1 ring-[#EAC956]/10">
             <Fingerprint className="w-4 h-4" />
             Nomor Registrasi: {pendaftar.noPendaftaran}
           </div>
           <h1 className="text-7xl md:text-8xl text-white font-normal tracking-tighter mb-4 flex items-center gap-4">
              Halo, <span className="text-[#EAC956] drop-shadow-[0_0_15px_rgba(234,201,86,0.2)]">{pendaftar.nama.split(' ')[0]}</span>! <span className="animate-wave origin-bottom-right inline-block">👋</span>
           </h1>
           <p className="text-2xl text-[#D2CEBE] font-light italic opacity-80 decoration-[#EAC956]/20 underline decoration-2 underline-offset-8">Selamat datang kembali di portal pendaftaran Anda.</p>
        </div>

        <div className={cn(
          "px-8 py-4 rounded-3xl border flex items-center gap-4 shadow-2xl transition-all",
          pendaftar.status === "DITERIMA" || pendaftar.status === "TERVERIFIKASI" 
            ? "bg-green-500/10 border-green-500/30 text-green-400" 
            : "bg-[#EAC956]/10 border-[#EAC956]/30 text-[#EAC956]"
        )}>
          <div className="w-12 h-12 rounded-2xl bg-current/10 flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">Status Saat Ini</p>
            <p className="text-xl font-bold">{LABEL_STATUS[pendaftar.status]}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: PRIMARY INFO */}
        <div className="lg:col-span-2 space-y-10">
           
           {/* ALERTS */}
           {pendaftar.status === "DOKUMEN_TIDAK_LENGKAP" && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-[40px] p-8 flex items-start gap-6 shadow-2xl">
                 <AlertCircle className="w-10 h-10 text-orange-400 shrink-0" />
                 <div>
                    <h4 className="text-xl text-white font-bold mb-2">Dokumen Butuh Perbaikan</h4>
                    <p className="text-orange-200/80 font-light leading-relaxed mb-6">{pendaftar.catatanVerifikasi}</p>
                    <Link href="/dokumen">
                       <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">Perbaiki Dokumen →</Button>
                    </Link>
                 </div>
              </div>
           )}

           {/* SUMMARY CARDS */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1C1A17] border border-[#2D2A26] rounded-[48px] p-10 hover:bg-[#2B2A23] transition-all group overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAC956]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform" />
                 <GraduationCap className="w-10 h-10 text-[#EAC956] mb-8" />
                 <h4 className="text-[#6A685F] text-[10px] font-bold uppercase tracking-widest mb-2">Program Studi Pilihan</h4>
                 <p className="text-2xl text-white font-normal mb-1">{pendaftar.prodi.nama}</p>
                 <p className="text-sm text-[#EAC956] font-medium">{pendaftar.prodi.jenjang} · Gelombang {pendaftar.periode.nama}</p>
              </div>

              <div className="bg-[#1C1A17] border border-[#2D2A26] rounded-[48px] p-10 hover:bg-[#2B2A23] transition-all group overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform" />
                 <FileText className="w-10 h-10 text-blue-400 mb-8" />
                 <h4 className="text-[#6A685F] text-[10px] font-bold uppercase tracking-widest mb-2">Progres Pemberkasan</h4>
                 <p className="text-3xl text-white font-normal mb-2">{dokumenValid} <span className="text-lg text-[#6A685F]">/ {dokumenTotal}</span></p>
                 <div className="w-full h-1.5 bg-[#2D2A26] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000" 
                      style={{ width: `${dokumenTotal > 0 ? (dokumenValid / dokumenTotal) * 100 : 0}%` }}
                    />
                 </div>
              </div>
           </div>

           {/* DETAILED DATA */}
           <div className="bg-[#1C1A17] border border-[#2D2A26] rounded-[56px] p-10 lg:p-16 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-12">
                 <div className="w-12 h-12 bg-[#EAC956]/10 rounded-2xl flex items-center justify-center text-[#EAC956]">
                    <User className="w-6 h-6" />
                 </div>
                 <h3 className="text-3xl text-white font-normal tracking-tight">Data Profil Registrasi</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                 <DetailField label="Nama Lengkap" value={pendaftar.nama} icon={<User className="w-4 h-4" />} />
                 <DetailField label="Nomor Induk Kependudukan (NIK)" value={pendaftar.nik} icon={<Fingerprint className="w-4 h-4" />} />
                 <DetailField label="Email Terdaftar" value={pendaftar.email} icon={<Mail className="w-4 h-4" />} />
                 <DetailField label="Nomor WhatsApp" value={pendaftar.noHp} icon={<Phone className="w-4 h-4" />} />
                 <DetailField label="Alamat Domisili" value={pendaftar.alamat} icon={<MapPin className="w-4 h-4" />} secondary={pendaftar.kota} />
                 <DetailField label="Periode Pendaftaran" value={pendaftar.periode.nama} icon={<Calendar className="w-4 h-4" />} secondary={pendaftar.periode.tahunAjaran} />
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: TIMELINE & ACTIONS */}
        <div className="space-y-8">
           {/* QUICK ACTIONS */}
           <div className="bg-[#EAC956] rounded-[48px] p-8 shadow-3xl">
              <h4 className="text-[#3A2E00] text-xl font-bold mb-6 flex items-center gap-3">
                 <ShieldCheck className="w-6 h-6" /> Langkah Selanjutnya
              </h4>
              <div className="space-y-4">
                 <Link href="/dokumen" className="block p-5 bg-white/20 hover:bg-white/30 rounded-3xl border border-white/10 transition-all group">
                    <div className="flex items-center justify-between text-[#3A2E00] font-bold">
                       Lengkapi Dokumen
                       <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[#3A2E00]/60 text-xs mt-1">Upload berkas persyaratan Anda</p>
                 </Link>
                 <Link href="/kartu" className="block p-5 bg-white/20 hover:bg-white/30 rounded-3xl border border-white/10 transition-all group">
                    <div className="flex items-center justify-between text-[#3A2E00] font-bold">
                       Unduh Kartu
                       <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </div>
                    <p className="text-[#3A2E00]/60 text-xs mt-1">Gunakan untuk seleksi & administrasi</p>
                 </Link>
              </div>
           </div>

           {/* TIMELINE */}
           <div className="bg-[#1C1A17] border border-[#2D2A26] rounded-[48px] p-10">
              <h4 className="text-white text-xl font-normal mb-10 flex items-center gap-3">
                 <Clock className="w-6 h-6 text-[#EAC956]" /> Log Aktivitas
              </h4>
              <div className="space-y-10 relative">
                 <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#2D2A26]" />
                 {pendaftar.riwayatStatus.map((r, i) => (
                    <div key={r.id} className="relative pl-10">
                       <div className={cn(
                         "absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-[#1C1A17] ring-4 ring-current/10 transition-all",
                         i === 0 ? "bg-[#EAC956] scale-125" : "bg-[#6A685F]"
                       )} />
                       <p className={cn("text-base font-bold mb-1 transition-colors", i === 0 ? "text-[#EAC956]" : "text-white/60")}>
                          {LABEL_STATUS[r.statusBaru]}
                       </p>
                       {r.catatan && <p className="text-xs text-[#D2CEBE] font-light mb-2">{r.catatan}</p>}
                       <p className="text-[10px] font-bold text-[#6A685F] uppercase tracking-tighter">
                          {new Date(r.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })} · {new Date(r.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, icon, secondary }: { label: string; value: any, icon: React.ReactNode, secondary?: string }) {
  return (
    <div className="group border-b border-[#2D2A26] pb-6 hover:border-[#EAC956]/30 transition-all">
       <div className="flex items-center gap-2 mb-3 text-[#6A685F] group-hover:text-[#EAC956] transition-colors">
          {icon}
          <span className="text-[10px] font-bold text-[#6A685F] group-hover:text-[#EAC956] uppercase tracking-widest">{label}</span>
       </div>
       <p className="text-xl text-white font-light group-hover:pl-2 transition-all">{value || '-'}</p>
       {secondary && <p className="text-xs text-[#6A685F] mt-1">{secondary}</p>}
    </div>
  );
}
