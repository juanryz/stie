export default async function PendaftarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <main className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12">
        {children}
      </main>
    </div>
  );
}
