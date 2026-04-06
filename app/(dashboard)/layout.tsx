import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const role = session.user.role as string;
  const DASHBOARD_ROLES = ["SUPER_ADMIN", "ADMIN", "PANITIA"];
  if (!DASHBOARD_ROLES.includes(role)) redirect("/status");

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        role={role}
        nama={session.user.name}
        email={session.user.email}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
