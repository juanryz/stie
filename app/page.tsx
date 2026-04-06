import { prisma } from "@/lib/prisma";
import { LandingPageClient } from "@/components/landing-page-client";

async function getPmbData() {
  const [periode, prodiList] = await Promise.all([
    prisma.periodePMB.findFirst({ where: { aktif: true } }),
    prisma.programStudi.findMany({
      where: { aktif: true },
      include: { _count: { select: { pendaftar: true } } },
    }),
  ]);
  return { periode, prodiList };
}

export default async function LandingPage() {
  const { periode, prodiList } = await getPmbData();

  const isPmbOpen =
    periode &&
    new Date() >= new Date(periode.tanggalBuka) &&
    new Date() <= new Date(periode.tanggalTutup);

  return (
    <LandingPageClient 
      periode={periode} 
      prodiList={prodiList} 
      isPmbOpen={isPmbOpen} 
    />
  );
}
