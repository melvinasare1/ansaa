"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeading, SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SellerProvider } from "@/lib/seller-context";
import type { Seller, SellerUser } from "@ansaa/shared/types";

export default function DashboardShell({
  children,
  user,
  seller,
  sellerError,
}: {
  children: React.ReactNode;
  user: SellerUser;
  seller: Seller | null;
  sellerError: string | null;
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
        <div className="flex min-h-0 flex-1">
          <AppSidebar className="top-(--header-height)! bottom-0! h-auto!" />
          <SidebarInset className="bg-mist">
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
