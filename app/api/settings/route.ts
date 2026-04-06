import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    let config = await (prisma as any).systemConfig.findFirst();
    if (!config) {
      config = await (prisma as any).systemConfig.create({
        data: {
          namaInstansi: "STIE Anindyaguna Semarang",
          emailKontak: "admin@stie-anindyaguna.ac.id",
          logoUrl: null,
          primaryColor: "#EAC956"
        }
      });
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role as string)) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { namaInstansi, emailKontak, logoUrl, primaryColor } = body;

    let config = await (prisma as any).systemConfig.findFirst();
    
    if (config) {
      config = await (prisma as any).systemConfig.update({
        where: { id: config.id },
        data: { namaInstansi, emailKontak, logoUrl, primaryColor }
      });
    } else {
      config = await (prisma as any).systemConfig.create({
        data: { namaInstansi, emailKontak, logoUrl, primaryColor }
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
