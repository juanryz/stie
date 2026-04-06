import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendUpdateStatus } from "@/lib/email";
import type { StatusPMB } from "@prisma/client";

const bodySchema = z.object({
  statusBaru: z.enum([
    "MENUNGGU_VERIFIKASI", "DOKUMEN_TIDAK_LENGKAP", "TERVERIFIKASI",
    "TERDAFTAR_TES", "LULUS_TES", "TIDAK_LULUS_TES",
    "DITERIMA", "DITOLAK", "DAFTAR_ULANG", "MENGUNDURKAN_DIRI",
  ]),
  catatan: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "PANITIA"];
  if (!ALLOWED_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { statusBaru, catatan } = parsed.data;

  const pendaftar = await prisma.pendaftar.findUnique({
    where: { id },
    include: { user: { select: { email: true } } },
  });

  if (!pendaftar) {
    return NextResponse.json({ error: "Pendaftar tidak ditemukan." }, { status: 404 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const p = await tx.pendaftar.update({
      where: { id },
      data: {
        status: statusBaru as StatusPMB,
        catatanVerifikasi: catatan ?? null,
        riwayatStatus: {
          create: {
            statusLama: pendaftar.status,
            statusBaru: statusBaru as StatusPMB,
            catatan: catatan ?? null,
            diubahOleh: session.user.id,
          },
        },
      },
    });
    return p;
  });

  // Kirim email notifikasi ke pendaftar (non-blocking)
  sendUpdateStatus({
    to: pendaftar.user.email ?? pendaftar.email,
    nama: pendaftar.nama,
    noPendaftaran: pendaftar.noPendaftaran,
    statusBaru: statusBaru as StatusPMB,
    catatan,
  }).catch((err) => console.error("[email] Update status gagal:", err));

  return NextResponse.json({ status: updated.status });
}
