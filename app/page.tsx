import { prisma } from "@/lib/prisma";
import { LandingPageClient } from "@/components/landing-page-client";

export const dynamic = "force-dynamic";

async function getPmbData() {
  const [periode, prodiList, announcements] = await Promise.all([
    prisma.periodePMB.findFirst({ where: { aktif: true } }),
    prisma.programStudi.findMany({
      where: { aktif: true },
      include: { _count: { select: { pendaftar: true } } },
    }),
    (prisma as any).pengumuman 
      ? (prisma as any).pengumuman.findMany({
          where: { aktif: true },
          orderBy: [{ pin: "desc" }, { createdAt: "desc" }],
          take: 4,
        })
      : Promise.resolve([]),
  ]);
  return { periode, prodiList, announcements };
}

export default async function LandingPage() {
  const { periode, prodiList, announcements } = await getPmbData();

  const isPmbOpen =
    periode &&
    new Date() >= new Date(periode.tanggalBuka) &&
    new Date() <= new Date(periode.tanggalTutup);

  return (
    <LandingPageClient 
      periode={periode} 
      prodiList={prodiList} 
      isPmbOpen={isPmbOpen} 
      announcements={announcements}
    />
  );
}
