// TODO: derive from `orders`, grouped by buyer_phone, where seller_id == current seller
const mockCustomers = [
  { name: "Ama Owusu", phone: "024 XXX XXXX", orders: 4, spent: "GHS 620" },
  { name: "Kwesi Mensah", phone: "055 XXX XXXX", orders: 1, spent: "GHS 320" },
  { name: "Efua Boateng", phone: "020 XXX XXXX", orders: 3, spent: "GHS 285" },
];

export default function CustomersPage() {
  return (
    <div className="px-4 py-4 md:py-6 lg:px-6">
      <p className="text-sm text-ink-700/50">Everyone who&apos;s bought from your storefront.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-wire bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wire text-left text-xs uppercase tracking-wide text-ink-700/50">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Orders</th>
              <th className="px-5 py-3 font-medium">Total spent</th>
            </tr>
          </thead>
          <tbody>
            {mockCustomers.map((c) => (
              <tr key={c.phone} className="border-b border-wire last:border-0">
                <td className="px-5 py-4 font-medium text-ink-950">{c.name}</td>
                <td className="px-5 py-4 font-mono text-xs text-ink-700/60">{c.phone}</td>
                <td className="px-5 py-4 text-ink-700/70">{c.orders}</td>
                <td className="px-5 py-4 font-tabular text-ink-950">{c.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
