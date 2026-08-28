import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ansaaMomoDetails } from "@/lib/billing";
import { getDashboardSession } from "@/lib/seller";
import { trialBannerState, trialPaymentOverdue } from "@/lib/trial";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getDashboardSession();
  if (!session) {
    redirect("/login");
  }

  const trial = trialBannerState(session.seller?.trialEndsAt);
  const paid = session.seller?.status === "active";
  const bannerTrial = trial?.expired && paid ? null : trial;

  return (
    <DashboardShell
      user={session.user}
      seller={session.seller}
      sellerError={session.sellerError}
      trial={bannerTrial}
      showExpiryModal={trialPaymentOverdue(session.seller)}
      momo={ansaaMomoDetails()}
    >
      {children}
    </DashboardShell>
  );
}
