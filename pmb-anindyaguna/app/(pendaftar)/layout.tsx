import { auth } from "@/lib/auth";
import { PendaftarNav } from "@/components/pendaftar/pendaftar-nav";

export default async function PendaftarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PendaftarNav nama={session?.user?.name} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
