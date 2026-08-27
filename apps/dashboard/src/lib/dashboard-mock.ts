import type { OrderStatus } from "@ansaa/shared/types";

export const mockMetrics = [
  { date: "Mon", revenue: 420, impressions: 310, orders: 4 },
  { date: "Tue", revenue: 680, impressions: 405, orders: 6 },
  { date: "Wed", revenue: 250, impressions: 260, orders: 2 },
  { date: "Thu", revenue: 890, impressions: 512, orders: 9 },
  { date: "Fri", revenue: 1120, impressions: 601, orders: 11 },
  { date: "Sat", revenue: 1560, impressions: 740, orders: 15 },
  { date: "Sun", revenue: 940, impressions: 480, orders: 8 },
];

export type DashboardOrder = {
  id: string;
  buyer: string;
  items: number;
  amount: string;
  status: OrderStatus;
  date: string;
};

export const mockOrders: DashboardOrder[] = [
  { id: "ORD-1042", buyer: "Ama Owusu", items: 2, amount: "GHS 180", status: "packed", date: "Today, 9:12am" },
  { id: "ORD-1041", buyer: "Kwesi Mensah", items: 1, amount: "GHS 320", status: "dispatched", date: "Today, 8:40am" },
  { id: "ORD-1040", buyer: "Efua Boateng", items: 3, amount: "GHS 95", status: "paid", date: "Yesterday, 4:02pm" },
  { id: "ORD-1039", buyer: "Yaw Darko", items: 1, amount: "GHS 450", status: "delivered", date: "Yesterday, 11:20am" },
  { id: "ORD-1038", buyer: "Abena Frimpong", items: 2, amount: "GHS 210", status: "return_requested", date: "2 days ago" },
  { id: "ORD-1037", buyer: "Kofi Asante", items: 4, amount: "GHS 560", status: "dispatched", date: "2 days ago" },
  { id: "ORD-1036", buyer: "Akosua Mensah", items: 1, amount: "GHS 75", status: "delivered", date: "3 days ago" },
  { id: "ORD-1035", buyer: "Nana Adjei", items: 2, amount: "GHS 240", status: "paid", date: "3 days ago" },
  { id: "ORD-1034", buyer: "Serwaa Ampofo", items: 1, amount: "GHS 390", status: "packed", date: "4 days ago" },
  { id: "ORD-1033", buyer: "Kojo Boateng", items: 3, amount: "GHS 155", status: "delivered", date: "4 days ago" },
  { id: "ORD-1032", buyer: "Adwoa Sarpong", items: 2, amount: "GHS 280", status: "cancelled", date: "5 days ago" },
  { id: "ORD-1031", buyer: "Fiifi Quaye", items: 1, amount: "GHS 120", status: "delivered", date: "5 days ago" },
  { id: "ORD-1030", buyer: "Maame Darkoa", items: 5, amount: "GHS 710", status: "dispatched", date: "6 days ago" },
];

const OPEN_ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "packed",
  "dispatched",
  "return_requested",
];

export function openOrderCount(orders: DashboardOrder[]) {
  return orders.filter((order) => OPEN_ORDER_STATUSES.includes(order.status)).length;
}

export function overviewTotals(metrics: typeof mockMetrics) {
  const revenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
  const impressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
  const orders = metrics.reduce((sum, m) => sum + m.orders, 0);
  const conversion = impressions ? (orders / impressions) * 100 : 0;
  return { revenue, impressions, orders, conversion };
}
