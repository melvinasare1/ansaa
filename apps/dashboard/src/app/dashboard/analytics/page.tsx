import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";

// TODO: aggregate from `daily_metrics` where seller_id == current seller
const mockMetrics = [
  { date: "Week 1", revenue: 2100, impressions: 1800 },
  { date: "Week 2", revenue: 3400, impressions: 2600 },
  { date: "Week 3", revenue: 2800, impressions: 2100 },
  { date: "Week 4", revenue: 4600, impressions: 3300 },
];

export default function AnalyticsPage() {
  return (
    <div className="px-4 py-4 md:py-6 lg:px-6">
      <p className="text-sm text-ink-700/50">This month, storefront + dashboard combined.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Store visits" value="9,842" delta="+18.2%" />
        <StatCard label="Impressions" value="12,340" delta="+9.4%" />
        <StatCard label="Orders placed" value="118" delta="+6.1%" />
        <StatCard label="Avg. order value" value="GHS 122" delta="+2.0%" />
      </div>

      <div className="mt-6 rounded-xl border border-wire bg-white p-5">
        <h2 className="font-display text-base font-semibold text-ink-950">Revenue by week</h2>
        <div className="mt-4 h-72">
          <RevenueChart data={mockMetrics} />
        </div>
      </div>
    </div>
  );
}
