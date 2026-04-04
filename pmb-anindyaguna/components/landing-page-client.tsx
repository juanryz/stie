"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

import { formatTanggal } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import { FaqAccordion } from "@/components/shared/faq-accordion";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const JALUR_MASUK = [
  {
    nama: "Reguler",
    deskripsi: "Jalur umum untuk lulusan SMA/SMK/MA semua jurusan.",
    warna: "bg-surface-variant text-on-surface-variant",
    badge: "bg-primary text-on-primary",
  },
  {
    nama: "Beasiswa",
    deskripsi: "Keringanan biaya untuk pendaftar berprestasi akademik atau non-akademik.",
    warna: "bg-tertiary-container text-on-tertiary-container",
    badge: "bg-tertiary text-on-tertiary",
  },
  {
    nama: "Transfer",
    deskripsi: "Khusus lulusan D3 yang ingin melanjutkan studi ke jenjang S1.",
    warna: "bg-secondary-container text-on-secondary-container",
    badge: "bg-secondary text-on-secondary",
  },
  {
    nama: "Kerjasama",
    deskripsi: "Jalur khusus bagi karyawan atau mitra institusi yang bekerjasama.",
    warna: "bg-error-container text-on-error-container",
    badge: "bg-error text-on-error",
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

export function LandingPageClient({ periode, prodiList, isPmbOpen }: any) {
  return (
    <div className="min-h-screen bg-[#FDFBFF] text-[#1A1C1E] selection:bg-[#0061A4] selection:text-white font-sans overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#FDFBFF] pt-24 pb-16 sm:pt-32 sm:pb-24">
        {/* M3 Background Shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#D1E4FF] blur-3xl opacity-50 -z-10"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute top-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#FFD9E2] blur-3xl opacity-40 -z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            {periode && (
              <motion.div variants={fadeInUp}>
                <Badge className="mb-6 bg-[#D1E4FF] text-[#001D36] hover:bg-[#B4D6FF] border-0 px-4 py-1.5 text-sm rounded-full shadow-sm">
                  {isPmbOpen ? "🟢 Pendaftaran Dibuka" : "🔴 Pendaftaran Ditutup"} — {periode.nama}
                </Badge>
              </motion.div>
            )}

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1A1C1E] mb-6 leading-[1.15]"
            >
              Wujudkan Impianmu <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0061A4] to-[#004A7E]">
                Bersama STIE Anindyaguna
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-[#43474E] mb-10 leading-relaxed max-w-2xl"
            >
              Pendidikan berkualitas untuk masa depan cemerlang. Proses pendaftaran Anda kini 100% online, elegan, dan mudah dinavigasi.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 text-base font-medium bg-[#0061A4] hover:bg-[#004A7E] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                  Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full h-14 px-8 text-base font-medium border-[#73777F] text-[#43474E] hover:bg-[#E2E2E9] rounded-full transition-all duration-300">
                  Cek Status Pendaftaran
                </Button>
              </Link>
            </motion.div>

            {periode && (
              <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-[#43474E] bg-white/60 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-[#E0E2E4]">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#0061A4]" />
                  <span>Buka: <span className="font-semibold text-[#1A1C1E]">{formatTanggal(periode.tanggalBuka)}</span></span>
                </div>
                <div className="hidden sm:block w-px h-5 bg-[#C4C6D0]" />
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#0061A4]" />
                  <span>Tutup: <span className="font-semibold text-[#1A1C1E]">{formatTanggal(periode.tanggalTutup)}</span></span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* KUOTA PRODI */}
      {prodiList.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 pb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {prodiList.map((prodi: any) => {
              const sisa = prodi.kuota - prodi._count.pendaftar;
              const persen = Math.round((prodi._count.pendaftar / prodi.kuota) * 100);
              return (
                <motion.div key={prodi.id} variants={scaleIn}>
                  <Card className="h-full rounded-3xl border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                    <CardContent className="p-6 relative">
                      {/* Subtle hover effect background */}
                      <div className="absolute inset-0 bg-[#D1E4FF] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div>
                          <Badge variant="outline" className="mb-2 text-[#0061A4] border-[#0061A4] rounded-full px-3">
                            {prodi.jenjang}
                          </Badge>
                          <h3 className="font-bold text-xl text-[#1A1C1E]">{prodi.nama.replace(/^S1 |^D3 /, "")}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#Edf3fa] flex items-center justify-center text-[#0061A4]">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="space-y-3 relative z-10">
                        <div className="flex justify-between text-sm text-[#43474E] font-medium">
                          <span>Terisi: {prodi._count.pendaftar}</span>
                          <span>Total: {prodi.kuota}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#E2E2E9] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min(persen, 100)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                            className="h-full rounded-full bg-[#0061A4]"
                          />
                        </div>
                        <p className="text-sm text-right text-[#43474E]">
                          Tersedia <span className="font-bold text-[#146C2E]">{sisa}</span> kursi
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* JALUR MASUK */}
      <section id="jalur" className="py-24 bg-[#F4F3F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-[#0061A4] font-semibold tracking-wider uppercase text-sm mb-2 block">Pilihan Jalur</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1C1E]">Pilih Jalur Pendaftaranmu</h2>
            <p className="text-[#43474E] mt-4 max-w-2xl mx-auto text-lg">
              Sesuaikan dengan kondisi dan prestasi Anda. Kami menyediakan berbagai pilihan jalur masuk.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {JALUR_MASUK.map((jalur, idx) => {
              // Map M3 colors
              const m3Colors = [
                { bg: "bg-[#D1E4FF]", text: "text-[#001D36]", badgeBg: "bg-[#0061A4]", badgeText: "text-white" },
                { bg: "bg-[#FFD9E2]", text: "text-[#31111D]", badgeBg: "bg-[#8B5061]", badgeText: "text-white" },
                { bg: "bg-[#D7E3CE]", text: "text-[#111F0B]", badgeBg: "bg-[#386665]", badgeText: "text-white" },
                { bg: "bg-[#FDE29F]", text: "text-[#261900]", badgeBg: "bg-[#7A5900]", badgeText: "text-white" },
              ];
              const color = m3Colors[idx % 4];

              return (
                <motion.div key={jalur.nama} variants={scaleIn} whileHover={{ y: -5 }}>
                  <Card className={`h-full rounded-3xl border-0 shadow-sm ${color.bg} transition-all duration-300`}>
                    <CardContent className="p-8">
                      <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-semibold mb-6 ${color.badgeBg} ${color.badgeText}`}>
                        {jalur.nama}
                      </div>
                      <p className={`text-base leading-relaxed ${color.text} font-medium`}>
                        {jalur.deskripsi}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* PERSYARATAN */}
      <section id="persyaratan" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-[#0061A4] font-semibold tracking-wider uppercase text-sm mb-2 block">Dokumen</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1C1E]">Persyaratan Dokumen</h2>
            <p className="text-[#43474E] mt-4 max-w-2xl mx-auto text-lg">
              Persiapkan dokumen berikut untuk melancarkan proses pendaftaran Anda.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="bg-[#FDFBFF] p-8 rounded-3xl border border-[#E0E2E4] shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E0E2E4]">
                <div className="w-10 h-10 rounded-full bg-[#D1E4FF] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-[#0061A4]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1C1E]">Dokumen Wajib</h3>
              </div>
              <ul className="space-y-6">
                {DOKUMEN_WAJIB.map((dok) => (
                  <motion.li key={dok.nama} variants={fadeInUp} className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-[#0061A4] shrink-0" />
                    <div>
                      <p className="text-base font-semibold text-[#1A1C1E]">{dok.nama}</p>
                      <p className="text-sm text-[#43474E]">{dok.format}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[#FDFBFF] p-8 rounded-3xl border border-[#E0E2E4] shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E0E2E4]">
                <div className="w-10 h-10 rounded-full bg-[#E2E2E9] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-[#43474E]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1C1E]">Dokumen Opsional</h3>
              </div>
              <ul className="space-y-6 flex-grow">
                {DOKUMEN_OPSIONAL.map((dok) => (
                  <motion.li key={dok.nama} variants={fadeInUp} className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-[#43474E] shrink-0" />
                    <div>
                      <p className="text-base font-semibold text-[#1A1C1E]">{dok.nama}</p>
                      <p className="text-sm text-[#43474E]">{dok.format}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 bg-[#D1E4FF] rounded-2xl p-5 text-left">
                <p className="text-sm font-bold text-[#001D36] mb-1 flex items-center gap-2">
                  <span>💡</span> Tips Upload
                </p>
                <p className="text-sm text-[#001D36]/80 leading-relaxed">
                  Pastikan foto/scan terlihat jelas, tidak buram. File dengan kualitas buruk akan memperlambat verifikasi.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" className="py-24 bg-[#FDFBFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-[#0061A4] font-semibold tracking-wider uppercase text-sm mb-2 block">Alur Pendaftaran</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1C1E]">Langkah Mudah Bergabung</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative"
          >
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-1 bg-[#E2E2E9] -z-10" />

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-y-12 gap-x-6">
              {TIMELINE_STEPS.map((step) => (
                <motion.div key={step.no} variants={fadeInUp} className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-[#0061A4] text-white flex items-center justify-center text-xl font-bold mb-6 shadow-md shadow-[#0061A4]/30 ring-8 ring-[#FDFBFF]"
                  >
                    {step.no}
                  </motion.div>
                  <h4 className="font-bold text-[#1A1C1E] mb-2">{step.judul}</h4>
                  <p className="text-sm text-[#43474E] leading-relaxed px-2">{step.ket}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-20 text-center"
          >
            <Link href="/register">
              <Button size="lg" className="h-14 px-10 text-base font-semibold bg-[#0061A4] hover:bg-[#004A7E] rounded-full shadow-md text-white">
                Mulai Pendaftaran Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white border-y border-[#E0E2E4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <span className="text-[#0061A4] font-semibold tracking-wider uppercase text-sm mb-2 block">Bantuan</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1C1E]">Pertanyaan Umum</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <FaqAccordion />
          </motion.div>
        </div>
      </section>

      {/* KONTAK & CTA */}
      <section id="kontak" className="py-24 bg-[#F4F3F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <motion.div variants={fadeInUp}>
                <span className="text-[#0061A4] font-semibold tracking-wider uppercase text-sm mb-2 block">Hubungi Kami</span>
                <h2 className="text-3xl sm:text-5xl font-bold text-[#1A1C1E] mb-6">Butuh Bantuan?</h2>
                <p className="text-xl text-[#43474E] mb-10">Tim layanan penerimaan mahasiswa kami selalu siap membantu Anda dengan pertanyaan apa pun.</p>
              </motion.div>

              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Telepon / WhatsApp", value: "(024) 8505025" },
                  { icon: Mail, label: "Email", value: "pmb@anindyaguna.ac.id" },
                  { icon: MapPin, label: "Lokasi", value: "Jl. Durian Raya No.1, Banyumanik, Semarang" },
                ].map(({ icon: Icon, label, value }, idx) => (
                  <motion.div key={label} variants={fadeInUp} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-white transition-colors duration-300">
                    <div className="w-14 h-14 rounded-full bg-[#D1E4FF] flex items-center justify-center text-[#0061A4] shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1C1E]">{label}</h4>
                      <p className="text-[#43474E] text-lg">{value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div variants={scaleIn}>
              <div className="bg-[#0061A4] rounded-[2.5rem] p-10 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -ml-20 -mb-20" />

                <Users className="h-16 w-16 mx-auto mb-6 text-[#D1E4FF] relative z-10" />
                <h3 className="text-3xl font-bold mb-4 relative z-10">Siap Bergabung?</h3>
                <p className="text-[#D1E4FF] text-lg mb-10 relative z-10">
                  Langkah pertama untuk masa depan yang lebih baik dimulai di sini.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full h-14 px-8 text-[#001D36] bg-[#D1E4FF] hover:bg-white rounded-full font-bold">
                      Daftar Sekarang
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full h-14 px-8 border-white/30 text-white hover:bg-white/10 rounded-full">
                      Masuk
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1C1E] text-[#C4C6D0] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#313033] flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-[#D1E4FF]" />
              </div>
              <span className="font-bold text-white text-lg tracking-wide">STIE Anindyaguna</span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} STIE Anindyaguna Semarang. Hak cipta dilindungi.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="hover:text-white transition-colors">Privasi</Link>
              <Link href="#" className="hover:text-white transition-colors">Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
