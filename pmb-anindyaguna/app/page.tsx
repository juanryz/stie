import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatTanggal } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import { FaqAccordion } from "@/components/shared/faq-accordion";

async function getPmbData() {
  const [periode, prodiList] = await Promise.all([
    prisma.periodePMB.findFirst({ where: { aktif: true } }),
    prisma.programStudi.findMany({
      where: { aktif: true },
      include: { _count: { select: { pendaftar: true } } },
    }),
  ]);
  return { periode, prodiList };
}

const JALUR_MASUK = [
  {
    nama: "Reguler",
    deskripsi: "Jalur umum untuk lulusan SMA/SMK/MA semua jurusan.",
    warna: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    nama: "Beasiswa",
    deskripsi: "Keringanan biaya untuk pendaftar berprestasi akademik atau non-akademik.",
    warna: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    nama: "Transfer",
    deskripsi: "Khusus lulusan D3 yang ingin melanjutkan studi ke jenjang S1.",
    warna: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  {
    nama: "Kerjasama",
    deskripsi: "Jalur khusus bagi karyawan atau mitra institusi yang bekerjasama.",
    warna: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
];

const DOKUMEN_WAJIB = [
  { nama: "Pas foto terbaru", format: "JPG/PNG, maks. 1 MB" },
  { nama: "KTP / Kartu Keluarga", format: "JPG/PDF, maks. 2 MB" },
  { nama: "Ijazah atau SKL", format: "PDF, maks. 5 MB" },
  { nama: "Transkrip / Rapor Nilai", format: "PDF, maks. 5 MB" },
];

const DOKUMEN_OPSIONAL = [
  { nama: "Sertifikat Prestasi", format: "JPG/PDF, maks. 2 MB — untuk jalur Beasiswa" },
];

const TIMELINE_STEPS = [
  { no: 1, judul: "Daftar Akun", ket: "Buat akun dengan email aktif Anda" },
  { no: 2, judul: "Isi Formulir", ket: "Lengkapi data pribadi, pendidikan, dan pilihan prodi" },
  { no: 3, judul: "Upload Dokumen", ket: "Unggah semua dokumen yang dipersyaratkan" },
  { no: 4, judul: "Verifikasi", ket: "Panitia memverifikasi kelengkapan dokumen Anda" },
  { no: 5, judul: "Tes Masuk", ket: "Ikuti tes seleksi masuk sesuai jadwal" },
  { no: 6, judul: "Pengumuman", ket: "Cek hasil seleksi melalui portal & email" },
  { no: 7, judul: "Daftar Ulang", ket: "Konfirmasi kelulusan dan lengkapi daftar ulang" },
];

export default async function LandingPage() {
  const { periode, prodiList } = await getPmbData();

  const isPmbOpen =
    periode &&
    new Date() >= new Date(periode.tanggalBuka) &&
    new Date() <= new Date(periode.tanggalTutup);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B4F72] via-[#1a6091] to-[#154060] text-white">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            {periode && (
              <Badge className="mb-4 bg-[#F39C12] text-white border-0 px-3 py-1">
                {isPmbOpen ? "🟢 Pendaftaran Dibuka" : "🔴 Pendaftaran Ditutup"} — {periode.nama}
              </Badge>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Wujudkan Impianmu<br />
              <span className="text-[#F39C12]">Bersama STIE Anindyaguna</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Daftarkan diri Anda ke program studi unggulan kami. Proses pendaftaran
              100% online, cepat, dan mudah.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-[#F39C12] hover:bg-[#e08e0b] text-white border-0 gap-2">
                  Daftar Sekarang <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 bg-white/10 text-white hover:bg-white/20">
                  Cek Status Pendaftaran
                </Button>
              </Link>
            </div>
            {periode && (
              <div className="mt-10 flex flex-wrap gap-5 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#F39C12]" />
                  <span>Buka: <span className="text-white font-medium">{formatTanggal(periode.tanggalBuka)}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#F39C12]" />
                  <span>Tutup: <span className="text-white font-medium">{formatTanggal(periode.tanggalTutup)}</span></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* KUOTA PRODI */}
      {prodiList.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {prodiList.map((prodi) => {
              const sisa = prodi.kuota - prodi._count.pendaftar;
              const persen = Math.round((prodi._count.pendaftar / prodi.kuota) * 100);
              return (
                <Card key={prodi.id} className="shadow-md border-0">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{prodi.jenjang}</p>
                        <p className="font-semibold text-[#1B4F72]">{prodi.nama.replace(/^S1 |^D3 /, "")}</p>
                      </div>
                      <GraduationCap className="h-5 w-5 text-[#F39C12] mt-0.5" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Kuota terisi</span>
                        <span>{prodi._count.pendaftar}/{prodi.kuota}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-[#1B4F72] transition-all" style={{ width: `${Math.min(persen, 100)}%` }} />
                      </div>
                      <p className="text-xs text-right text-muted-foreground">
                        Sisa <span className="font-medium text-green-600">{sisa}</span> kursi
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* JALUR MASUK */}
      <section id="jalur" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-[#1B4F72]/10 text-[#1B4F72] border-0">Jalur Masuk</Badge>
          <h2 className="text-3xl font-bold text-[#1B4F72]">Pilih Jalur Pendaftaranmu</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Tersedia empat jalur pendaftaran yang bisa dipilih sesuai kondisi dan prestasi Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {JALUR_MASUK.map((jalur) => (
            <div key={jalur.nama} className={`rounded-xl border p-5 transition-shadow hover:shadow-md ${jalur.warna}`}>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${jalur.badge}`}>{jalur.nama}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{jalur.deskripsi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PERSYARATAN */}
      <section id="persyaratan" className="bg-white border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-[#1B4F72]/10 text-[#1B4F72] border-0">Persyaratan</Badge>
            <h2 className="text-3xl font-bold text-[#1B4F72]">Dokumen yang Diperlukan</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Siapkan dokumen berikut sebelum memulai proses pendaftaran online.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-[#1B4F72]" />
                <h3 className="font-semibold text-[#1B4F72]">Dokumen Wajib</h3>
              </div>
              <ul className="space-y-3">
                {DOKUMEN_WAJIB.map((dok) => (
                  <li key={dok.nama} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{dok.nama}</p>
                      <p className="text-xs text-muted-foreground">{dok.format}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-[#F39C12]" />
                <h3 className="font-semibold text-[#F39C12]">Dokumen Opsional</h3>
              </div>
              <ul className="space-y-3">
                {DOKUMEN_OPSIONAL.map((dok) => (
                  <li key={dok.nama} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{dok.nama}</p>
                      <p className="text-xs text-muted-foreground">{dok.format}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-lg bg-[#1B4F72]/5 border border-[#1B4F72]/10 p-4">
                <p className="text-sm text-[#1B4F72] font-medium mb-1">💡 Tips Upload Dokumen</p>
                <p className="text-xs text-muted-foreground">
                  Pastikan foto/scan terlihat jelas, tidak buram, dan semua sudut dokumen terlihat.
                  File dengan kualitas buruk akan memperlambat proses verifikasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-[#1B4F72]/10 text-[#1B4F72] border-0">Alur PMB</Badge>
          <h2 className="text-3xl font-bold text-[#1B4F72]">Proses Pendaftaran</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Ikuti langkah-langkah berikut untuk menyelesaikan proses pendaftaran mahasiswa baru.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
          {TIMELINE_STEPS.map((step) => (
            <div key={step.no} className="flex flex-col items-center text-center gap-2">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1B4F72] text-white font-bold text-lg shadow-lg ring-4 ring-white">
                {step.no}
              </div>
              <p className="font-semibold text-sm text-[#1B4F72]">{step.judul}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.ket}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/register">
            <Button size="lg" className="bg-[#1B4F72] hover:bg-[#154060] gap-2">
              Mulai Pendaftaran <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white border-y border-border py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-[#1B4F72]/10 text-[#1B4F72] border-0">FAQ</Badge>
            <h2 className="text-3xl font-bold text-[#1B4F72]">Pertanyaan yang Sering Diajukan</h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* KONTAK */}
      <section id="kontak" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-[#1B4F72]/10 text-[#1B4F72] border-0">Kontak</Badge>
          <h2 className="text-3xl font-bold text-[#1B4F72]">Hubungi Kami</h2>
          <p className="text-muted-foreground mt-2">Ada pertanyaan? Panitia PMB siap membantu Anda.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Phone, label: "Telepon / WhatsApp", value: "(024) 8505025" },
            { icon: Mail, label: "Email", value: "pmb@anindyaguna.ac.id" },
            { icon: MapPin, label: "Alamat", value: "Jl. Durian Raya No.1, Banyumanik, Semarang" },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label} className="border-0 shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1B4F72]/10">
                  <Icon className="h-5 w-5 text-[#1B4F72]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-muted-foreground text-sm mt-1">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="bg-gradient-to-r from-[#1B4F72] to-[#1a6091] text-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <Users className="h-10 w-10 mx-auto mb-4 text-[#F39C12]" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Siap Bergabung Bersama Kami?</h2>
          <p className="text-white/80 mb-7">
            Daftarkan diri sekarang dan mulai perjalanan akademikmu bersama STIE Anindyaguna Semarang.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-[#F39C12] hover:bg-[#e08e0b] text-white border-0 gap-2">
                Daftar Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 bg-white/10 text-white hover:bg-white/20">
                Cek Status Pendaftaran
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f2d42] text-white/70 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <GraduationCap className="h-4 w-4 text-[#F39C12]" />
              </div>
              <span className="font-semibold text-white">STIE Anindyaguna Semarang</span>
            </div>
            <p className="text-sm text-center">
              © {new Date().getFullYear()} STIE Anindyaguna Semarang. Semua hak dilindungi.
            </p>
            <div className="flex gap-5 text-sm">
              <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
