import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { mockMetrics, overviewTotals } from "@/lib/dashboard-mock";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  PercentIcon,
  ShoppingBagIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

function previousFromDelta(current: number, deltaPercent: number) {
  return current / (1 + deltaPercent / 100);
}

export function SectionCards() {
  const { revenue, impressions, orders, conversion } = overviewTotals(mockMetrics);

  const cards: {
    label: string;
    value: string;
    delta: number;
    icon: LucideIcon;
    comparison: string;
  }[] = [
    {
      label: "Revenue",
      value: `GHS ${revenue.toLocaleString()}`,
      delta: 12.4,
      icon: WalletIcon,
      comparison: `vs. GHS ${Math.round(previousFromDelta(revenue, 12.4)).toLocaleString()} last period`,
    },
    {
      label: "Orders",
      value: String(orders),
      delta: 8.1,
      icon: ShoppingBagIcon,
      comparison: `vs. ${Math.round(previousFromDelta(orders, 8.1)).toLocaleString()} last period`,
    },
    {
      label: "Impressions",
      value: impressions.toLocaleString(),
      delta: 3.6,
      icon: EyeIcon,
      comparison: `vs. ${Math.round(previousFromDelta(impressions, 3.6)).toLocaleString()} last period`,
    },
    {
      label: "Conversion rate",
      value: `${conversion.toFixed(1)}%`,
      delta: -0.4,
      icon: PercentIcon,
      comparison: `vs. ${previousFromDelta(conversion, -0.4).toFixed(1)}% last period`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const positive = card.delta >= 0;
        return (
          <Card
            key={card.label}
            className="gap-0 rounded-[16px] bg-white py-5 shadow-card ring-0"
          >
            <CardHeader className="flex flex-row items-start justify-between px-5">
              <CardDescription className="text-sm">{card.label}</CardDescription>
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent className="mt-3 px-5">
              <div className="flex items-center gap-2.5">
                <p className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
                  {card.value}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                    positive
                      ? "bg-delta-up-soft text-delta-up"
                      : "bg-delta-down-soft text-delta-down"
                  )}
                >
                  {positive ? (
                    <ArrowUpIcon className="size-3" />
                  ) : (
                    <ArrowDownIcon className="size-3" />
                  )}
                  {Math.abs(card.delta)}%
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{card.comparison}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
