import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const DASHBOARD_ROLES = ["SUPER_ADMIN", "ADMIN", "PANITIA"];

export async function GET() {
  try {
    const list = await prisma.programStudi.findMany({
      include: {
        _count: {
          select: { pendaftar: true }
        }
      }
    });
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat prodi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const role = session.user.role as string;
    if (!DASHBOARD_ROLES.includes(role)) {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { kode, nama, jenjang, kuota, aktif } = body;

    if (!kode || !nama || !jenjang) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prodi = await prisma.programStudi.create({
      data: {
        kode,
        nama,
        jenjang,
        kuota: parseInt(kuota) || 100,
        aktif: aktif !== undefined ? aktif : true
      }
    });

    return NextResponse.json(prodi);
  } catch (error: any) {
    if (error.code === 'P2002') {
       return NextResponse.json({ error: "Kode Prodi sudah digunakan" }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal menambah prodi" }, { status: 500 });
  }
}
