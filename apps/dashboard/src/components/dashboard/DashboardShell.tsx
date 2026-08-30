"use client";

import { AppSidebar } from "@/components/app-sidebar";
import TrialBanner from "@/components/dashboard/TrialBanner";
import TrialExpiryModal from "@/components/dashboard/TrialExpiryModal";
import { DashboardHeading, SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { AnsaaMomoDetails } from "@/lib/billing";
import { SellerProvider } from "@/lib/seller-context";
import type { TrialBannerState } from "@/lib/trial";
import type { Seller, SellerUser } from "@ansaa/shared/types";

export default function DashboardShell({
  children,
  user,
  seller,
  sellerError,
  trial,
  showExpiryModal,
  momo,
}: {
  children: React.ReactNode;
  user: SellerUser;
  seller: Seller | null;
  sellerError: string | null;
  trial: TrialBannerState | null;
  showExpiryModal: boolean;
  momo: AnsaaMomoDetails;
}) {
  return (
    <SellerProvider user={user} seller={seller} sellerError={sellerError}>
      <SidebarProvider
        className="flex-col"
        style={
          {
            "--sidebar-width": "16rem",
            "--header-height": "4rem",
          } as React.CSSProperties
        }
      >
        <SiteHeader />
        <TrialExpiryModal
          open={showExpiryModal}
          billingReference={seller?.billingReference ?? "Not available"}
          momo={momo}
        />
        <div className="flex min-h-0 flex-1">
          <AppSidebar className="top-(--header-height)! bottom-0! h-auto!" />
          <SidebarInset className="bg-mist">
            <TrialBanner trial={trial} />
            <DashboardHeading />
            <div className="flex flex-1 flex-col">
              {sellerError ? (
                <p className="mx-4 mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive lg:mx-6">
                  {sellerError}
                </p>
              ) : null}
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SellerProvider>
  );
}
