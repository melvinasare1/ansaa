import Link from "next/link";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";

// TODO: fetch products from Firestore where sellerId == seller resolved from slug/domain
const mockProducts = [
  { id: "p1", name: "Fast charging cable 2m", price: "GHS 25", stock: 40 },
  { id: "p2", name: "Bluetooth earbuds", price: "GHS 120", stock: 12 },
  { id: "p3", name: "Phone case — clear", price: "GHS 20", stock: 60 },
  { id: "p4", name: "Power bank 10000mAh", price: "GHS 95", stock: 5 },
  { id: "p5", name: "Screen protector 2-pack", price: "GHS 15", stock: 80 },
  { id: "p6", name: "Car phone mount", price: "GHS 35", stock: 22 },
];

export default function TemplateBHome({ params }: { params: { slug: string } }) {
  const path = `/store/template-b/${params.slug}`;

  return (
    <div>
      <StorefrontTracker storeSlug={params.slug} path={path} />
      <div className="mb-6 border-2 border-[#0B1220] bg-[#FFE8A3] px-5 py-3">
        <p className="font-[family-name:var(--font-market)] text-sm font-extrabold uppercase">
          In stock, ships today if ordered before 4pm
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {mockProducts.map((p) => (
          <Link
            key={p.id}
            href={`/store/template-b/${params.slug}/product/${p.id}`}
            className="border-2 border-[#0B1220] p-3 transition hover:bg-[#0B1220]/5"
          >
            <div className="aspect-square w-full bg-[#0B1220]/10" />
            <p className="mt-2 text-sm font-semibold leading-tight">{p.name}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-[family-name:var(--font-market)] font-extrabold">{p.price}</span>
              <span className="text-xs text-[#0B1220]/50">{p.stock} left</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
