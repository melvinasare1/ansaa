import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { getPageViewStats } from "@/lib/analytics";
import { mockOrders } from "@/lib/dashboard-mock";
import { getDashboardSession } from "@/lib/seller";
import { createClient } from "@ansaa/shared/supabase/server";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";

export default async function DashboardOverviewPage() {
  let impressions = 0;
  let impressionsPrevious = 0;

  const session = await getDashboardSession();
  if (session?.seller && isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const stats = await getPageViewStats(supabase, session.seller.id, "7d");
      impressions = stats.current;
      impressionsPrevious = stats.previous;
    } catch (err) {
      console.error("Failed to load impression stats", err);
    }
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards impressions={impressions} impressionsPrevious={impressionsPrevious} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={mockOrders} />
      </div>
    </div>
  );
}
