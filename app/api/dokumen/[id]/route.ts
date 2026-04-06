import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dokumen = await prisma.dokumen.findUnique({
      where: { id },
      include: { pendaftar: true },
    });

    if (!dokumen) {
      return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
    }

    if (dokumen.pendaftar.userId !== session.user.id) {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    if (dokumen.status === "VALID") {
      return NextResponse.json({ error: "Dokumen yang sudah valid tidak dapat diubah." }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "File tidak valid." }, { status: 400 });
    }

    const userId = session.user.id;
    const ext = file.name.split(".").pop() ?? "bin";
    const filePath = `${userId}/${dokumen.jenis}/${Date.now()}-reupload.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await uploadFile(buffer, filePath, file.type);

    const updated = await prisma.dokumen.update({
      where: { id },
      data: {
        namaFile: file.name,
        urlFile: filePath,
        ukuranFile: file.size,
        status: "MENUNGGU",
        catatan: null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Gagal mengupdate dokumen:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
