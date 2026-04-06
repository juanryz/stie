import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hash, compare } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { oldPass, newPass } = body;

    if (!oldPass || !newPass) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || !user.password) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await compare(oldPass, user.password);
    if (!isMatch) {
       return NextResponse.json({ error: "Password saat ini salah" }, { status: 400 });
    }

    const hashed = await hash(newPass, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui password" }, { status: 500 });
  }
}
