import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getDashboardSession } from "@/lib/seller";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getDashboardSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardShell
      user={session.user}
      seller={session.seller}
      sellerError={session.sellerError}
    >
      {children}
    </DashboardShell>
  );
}
