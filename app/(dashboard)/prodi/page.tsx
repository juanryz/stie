import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  BookOpen, Plus, Trash2, Edit, CheckCircle2, XCircle, 
  ChevronRight, LayoutDashboard, Sparkles, GraduationCap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Program Studi — PMB STIE Anindyaguna",
};

async function getProdiList() {
  return prisma.programStudi.findMany({
    orderBy: { jenjang: "asc" },
    include: { _count: { select: { pendaftar: true } } }
  });
}

export default async function ProdiPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const prodiList = await getProdiList();

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-[1400px] mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#2D2A26] pb-12">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-3 bg-[#EAC956]/10 text-[#EAC956] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#EAC956]/20 ring-1 ring-[#EAC956]/10">
             <BookOpen className="w-4 h-4" />
             Master Data Akademik
           </div>
           <h1 className="text-6xl text-white font-normal tracking-tighter uppercase">Program Studi</h1>
           <p className="text-xl text-[#D2CEBE] font-light italic opacity-80">Kelola daftar jurusan, jenjang, dan kuota penerimaan mahasiswa baru.</p>
        </div>

        <Link href="/prodi/tambah">
          <Button className="bg-[#EAC956] hover:bg-[#FCE68A] text-[#3A2E00] h-16 px-10 rounded-3xl font-bold text-lg shadow-3xl hover:scale-105 transition-all flex items-center gap-3 group">
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" /> Tambah Prodi Baru
          </Button>
        </Link>
      </div>

      {/* GRID LISTING */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prodiList.map((prodi) => (
          <div key={prodi.id} className="bg-[#1C1A17] border border-[#2D2A26] rounded-[48px] p-10 hover:bg-[#2B2A23] transition-all group relative overflow-hidden flex flex-col shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAC956]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-16 h-16 bg-[#EAC956]/10 rounded-2xl flex items-center justify-center text-[#EAC956] group-hover:bg-[#EAC956] group-hover:text-[#3A2E00] transition-all">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                prodi.aktif ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
              )}>
                {prodi.aktif ? "Aktif" : "Non-aktif"}
              </div>
            </div>

            <div className="space-y-2 mb-8 flex-1">
              <p className="text-[10px] font-bold text-[#EAC956] uppercase tracking-[0.2em]">{prodi.jenjang} · KODE: {prodi.kode}</p>
              <h3 className="text-3xl text-white font-normal tracking-tight group-hover:text-[#EAC956] transition-colors leading-[1.1]">{prodi.nama}</h3>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5 relative z-10">
              <div className="flex justify-between items-center">
                 <span className="text-[#6A685F] text-xs font-bold uppercase tracking-widest">Kapasitas Kuota</span>
                 <span className="text-white font-bold text-lg">{prodi.kuota} Kursi</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[#6A685F] text-xs font-bold uppercase tracking-widest">Total Pendaftar</span>
                 <span className="text-white font-bold text-lg">{prodi._count.pendaftar} Mahasiswa</span>
              </div>
              
              <div className="flex gap-3 pt-4">
                 <Button variant="ghost" className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-2xl h-14 border border-white/5 flex items-center gap-2">
                    <Edit className="w-4 h-4" /> Edit
                 </Button>
                 <Button variant="ghost" className="w-14 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl h-14 border border-red-500/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                 </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* ADD NEW PLACEHOLDER */}
        <Link href="/prodi/tambah" className="border-2 border-dashed border-[#2D2A26] rounded-[48px] p-10 flex flex-col items-center justify-center gap-6 hover:bg-[#EAC956]/5 hover:border-[#EAC956]/30 transition-all h-[420px] group">
           <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#EAC956] group-hover:text-[#3A2E00] transition-all">
              <Plus className="w-8 h-8" />
           </div>
           <div className="text-center">
              <p className="text-white font-bold text-xl mb-1">Tambah Program Studi</p>
              <p className="text-[#6A685F] text-sm">Klik di sini untuk membuat jurusan baru</p>
           </div>
        </Link>
      </div>
    </div>
  );
}
