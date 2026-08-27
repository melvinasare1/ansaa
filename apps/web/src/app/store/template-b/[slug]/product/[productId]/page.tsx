// TODO: fetch this product by productId from Firestore
export default function TemplateBProductPage({
  params,
}: {
  params: { slug: string; productId: string };
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="aspect-square w-full border-2 border-[#0B1220] bg-[#0B1220]/10" />
      <div>
        <h1 className="font-[family-name:var(--font-market)] text-2xl font-extrabold uppercase">
          Bluetooth earbuds
        </h1>
        <p className="mt-1 font-[family-name:var(--font-market)] text-xl font-extrabold text-[#1447E6]">
          GHS 120
        </p>
        <p className="mt-4 text-sm text-[#0B1220]/70">
          12 hour battery, quick pair, includes charging case.
        </p>
        <button className="mt-6 w-full bg-[#1447E6] py-3 text-sm font-extrabold uppercase text-white transition hover:opacity-90">
          Add to cart
        </button>
        <p className="mt-3 text-xs text-[#0B1220]/40">
          Product {params.productId} · Packed and dispatched by Fulfil
        </p>
      </div>
    </div>
  );
}
