import { Resend } from "resend";
import { render } from "@react-email/components";
import { KonfirmasiPendaftaran } from "@/emails/konfirmasi-pendaftaran";
import { UpdateStatus } from "@/emails/update-status";
import { LABEL_STATUS, LABEL_JALUR } from "@/types";
import type { StatusPMB, JalurMasuk } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.EMAIL_FROM ?? "PMB STIE Anindyaguna <noreply@pmb.anindyaguna.ac.id>";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.AUTH_URL ??
  "http://localhost:3000";

// ─── Kirim email konfirmasi pendaftaran baru ──────────────────────────────

export async function sendKonfirmasiPendaftaran(params: {
  to: string;
  nama: string;
  noPendaftaran: string;
  namaProdi: string;
  jenjang: string;
  jalurMasuk: JalurMasuk;
  periode: string;
}) {
  const html = await render(
    KonfirmasiPendaftaran({
      nama: params.nama,
      noPendaftaran: params.noPendaftaran,
      namaProdi: params.namaProdi,
      jenjang: params.jenjang,
      jalurMasuk: LABEL_JALUR[params.jalurMasuk],
      periode: params.periode,
      statusUrl: `${APP_URL}/status`,
    })
  );

  const { error } = await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Konfirmasi Pendaftaran — ${params.noPendaftaran}`,
    html,
  });

  if (error) {
    console.error("[email] Gagal kirim konfirmasi:", error);
  }
}

// ─── Kirim email update status ────────────────────────────────────────────

export async function sendUpdateStatus(params: {
  to: string;
  nama: string;
  noPendaftaran: string;
  statusBaru: StatusPMB;
  catatan?: string | null;
}) {
  const html = await render(
    UpdateStatus({
      nama: params.nama,
      noPendaftaran: params.noPendaftaran,
      statusBaru: LABEL_STATUS[params.statusBaru],
      catatan: params.catatan,
      statusUrl: `${APP_URL}/status`,
    })
  );

  const { error } = await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Update Status Pendaftaran — ${LABEL_STATUS[params.statusBaru]}`,
    html,
  });

  if (error) {
    console.error("[email] Gagal kirim update status:", error);
  }
}
