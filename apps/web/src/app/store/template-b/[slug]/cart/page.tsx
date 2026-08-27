// TODO: pull real cart state and wire checkout submit to a Hubtel/Paystack payment intent
export default function TemplateBCartPage() {
  return (
    <div className="max-w-md">
      <h1 className="font-[family-name:var(--font-market)] text-2xl font-extrabold uppercase">
        Your cart
      </h1>

      <div className="mt-6 space-y-3 border-b-2 border-[#0B1220] pb-5">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Bluetooth earbuds × 1</span>
          <span>GHS 120</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between font-[family-name:var(--font-market)] font-extrabold">
        <span>Total</span>
        <span>GHS 120</span>
      </div>

      <button className="mt-6 w-full bg-[#1447E6] py-3 text-sm font-extrabold uppercase text-white transition hover:opacity-90">
        Pay now
      </button>
      <p className="mt-3 text-center text-xs text-[#0B1220]/40">
        Payment is collected upfront. Your order ships once payment clears.
      </p>
    </div>
  );
}
