import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pinOnly = searchParams.get("pin") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const where = {
       aktif: true,
       ...(pinOnly && { pin: true })
    };

    if (!(prisma as any).pengumuman) {
       return NextResponse.json([]);
    }

    const data = await (prisma as any).pengumuman.findMany({
      where,
      orderBy: [
        { pin: "desc" },
        { createdAt: "desc" }
      ],
      take: limit
    });
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch: Pengumuman model not yet available." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role as string)) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { judul, konten, ringkasan, gambarUrls, kategori, pin } = body;

    if (!(prisma as any).pengumuman) {
       return NextResponse.json({ error: "Prisma client not yet updated. Please run npx prisma generate." }, { status: 500 });
    }

    const data = await (prisma as any).pengumuman.create({
      data: {
        judul,
        konten,
        ringkasan,
        gambarUrls: Array.isArray(gambarUrls) ? gambarUrls : [],
        kategori,
        pin: Boolean(pin),
        diubahOleh: session.user.name ?? "Admin"
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role as string)) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
       return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const body = await req.json();
    const { judul, konten, ringkasan, gambarUrls, kategori, pin, aktif } = body;

    if (!(prisma as any).pengumuman) {
       return NextResponse.json({ error: "Prisma client failure" }, { status: 500 });
    }

    const data = await (prisma as any).pengumuman.update({
      where: { id },
      data: {
        judul,
        konten,
        ringkasan,
        gambarUrls: Array.isArray(gambarUrls) ? gambarUrls : undefined,
        kategori,
        pin: pin !== undefined ? Boolean(pin) : undefined,
        aktif: aktif !== undefined ? Boolean(aktif) : undefined,
        diubahOleh: session.user.name ?? "Admin"
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role as string)) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
       return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    if (!(prisma as any).pengumuman) {
       return NextResponse.json({ error: "Prisma client failure" }, { status: 500 });
    }

    // Try deleting first from database
    await (prisma as any).pengumuman.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

