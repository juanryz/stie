import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Program Studi ────────────────────────────────────────────
  const programStudi = await prisma.programStudi.createMany({
    data: [
      {
        kode: "MNJ",
        nama: "S1 Manajemen",
        jenjang: "S1",
        kuota: 150,
        aktif: true,
      },
      {
        kode: "AKT",
        nama: "S1 Akuntansi",
        jenjang: "S1",
        kuota: 120,
        aktif: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Program Studi: ${programStudi.count} dibuat`);

  // ─── Periode PMB ──────────────────────────────────────────────
  const periodeExisting = await prisma.periodePMB.findFirst({
    where: { tahunAjaran: "2025/2026" },
  });

  if (!periodeExisting) {
    await prisma.periodePMB.create({
      data: {
        nama: "PMB 2025/2026",
        tahunAjaran: "2025/2026",
        tanggalBuka: new Date("2025-01-01"),
        tanggalTutup: new Date("2025-08-31"),
        aktif: true,
      },
    });
    console.log("✅ Periode PMB 2025/2026 dibuat");
  } else {
    console.log("⏭️  Periode PMB sudah ada");
  }

  // ─── User Super Admin ─────────────────────────────────────────
  const adminExists = await prisma.user.findUnique({
    where: { email: "superadmin@anindyaguna.ac.id" },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        email: "superadmin@anindyaguna.ac.id",
        name: "Super Admin PMB",
        password: await hash("Admin@1234", 12),
        role: "SUPER_ADMIN",
      },
    });
    console.log("✅ Super Admin dibuat: superadmin@anindyaguna.ac.id / Admin@1234");
  } else {
    console.log("⏭️  Super Admin sudah ada");
  }

  // ─── User Admin ───────────────────────────────────────────────
  const adminUserExists = await prisma.user.findUnique({
    where: { email: "admin@anindyaguna.ac.id" },
  });

  if (!adminUserExists) {
    await prisma.user.create({
      data: {
        email: "admin@anindyaguna.ac.id",
        name: "Admin PMB",
        password: await hash("Admin@1234", 12),
        role: "ADMIN",
      },
    });
    console.log("✅ Admin dibuat: admin@anindyaguna.ac.id / Admin@1234");
  }

  // ─── User Panitia ─────────────────────────────────────────────
  const panitiaExists = await prisma.user.findUnique({
    where: { email: "panitia@anindyaguna.ac.id" },
  });

  if (!panitiaExists) {
    await prisma.user.create({
      data: {
        email: "panitia@anindyaguna.ac.id",
        name: "Panitia PMB",
        password: await hash("Admin@1234", 12),
        role: "PANITIA",
      },
    });
    console.log("✅ Panitia dibuat: panitia@anindyaguna.ac.id / Admin@1234");
  }

  console.log("\n🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
