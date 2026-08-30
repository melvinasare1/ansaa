// Kitchenware template: a warm, editorial home/lifestyle storefront for
// kitchenware and houseware sellers. Serif display + forest/cream palette.
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { CartFeedbackProvider } from "@/components/store/kitchenware-template/CartFeedback";
import { Header } from "@/components/store/kitchenware-template/Header";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-homedine-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-homedine-sans",
  weight: ["400", "500", "600"],
});

export default function KitchenwareTemplateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${sans.variable} min-h-screen bg-white text-[#2B4239]`}
      style={{ fontFamily: "var(--font-homedine-sans), ui-sans-serif, system-ui" }}
    >
      <CartFeedbackProvider>
        <Header />
        <main>{children}</main>
      </CartFeedbackProvider>
    </div>
  );
}
