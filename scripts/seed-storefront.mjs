/**
 * Seed a sample Styleco seller + products so template-a can be tested end to end.
 *
 * Usage (from repo root, with NEXT_PUBLIC_SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY in apps/web/.env.local, apps/dashboard/.env.local,
 * or a root .env.local):
 *   npm run seed:storefront
 *
 * Then open: http://localhost:3000/store/template-a/styleco
 *
 * Run supabase/migrations/20260827120000_init.sql first.
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SELLER_ID = "11111111-1111-4111-8111-111111111111";
const STORE_SLUG = "styleco";

function loadEnvFile(envPath) {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function loadEnvLocal() {
  for (const envPath of [
    join(root, "apps/web/.env.local"),
    join(root, "apps/dashboard/.env.local"),
    join(root, ".env.local"),
  ]) {
    loadEnvFile(envPath);
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.local.example)."
  );
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const seller = {
  id: SELLER_ID,
  uid: SELLER_ID,
  business_name: "Styleco",
  domain: "styleco.local",
  store_slug: STORE_SLUG,
  template: "template-a",
  email: "styleco@example.com",
  phone: "+233000000000",
  pricing_tier: "early_bird",
  base_fee_cedis: 250,
  status: "active",
};

const products = [
  {
    id: "21111111-1111-4111-8111-111111111111",
    seller_id: SELLER_ID,
    name: "Polyester Printed Shirt",
    description: "A relaxed short-sleeve shirt with a turn-down collar, cut for everyday wear.",
    price_cedis: 130,
    images: [],
    stock_quantity: 24,
    sku: "STY-SHIRT-001",
    category: "Tops & Tees",
    active: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Orange", "Blue", "Black"],
  },
  {
    id: "21111111-1111-4111-8111-111111111112",
    seller_id: SELLER_ID,
    name: "Half Sleeve Shirt",
    description: "Lightweight half-sleeve shirting with an easy, regular fit.",
    price_cedis: 245,
    images: [],
    stock_quantity: 18,
    sku: "STY-SHIRT-002",
    category: "Tops & Tees",
    active: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Orange", "Navy", "Teal"],
  },
  {
    id: "21111111-1111-4111-8111-111111111113",
    seller_id: SELLER_ID,
    name: "Cotton Oxford Shirt",
    description: "Classic oxford cloth with a clean collar and a structured drape.",
    price_cedis: 180,
    images: [],
    stock_quantity: 12,
    sku: "STY-SHIRT-003",
    category: "Tops & Tees",
    active: true,
    sizes: ["S", "M", "L"],
    colors: ["Blue", "White", "Black"],
  },
  {
    id: "21111111-1111-4111-8111-111111111114",
    seller_id: SELLER_ID,
    name: "Archived Overshirt",
    description: "Inactive on purpose — must not appear on the public catalog.",
    price_cedis: 290,
    images: [],
    stock_quantity: 0,
    sku: "STY-SHIRT-000",
    category: "Jackets & Coats",
    active: false,
    sizes: ["M", "L"],
    colors: ["Black"],
  },
];

const { error: sellerError } = await supabase.from("sellers").upsert(seller, { onConflict: "id" });
if (sellerError) throw sellerError;

const { error: productError } = await supabase.from("products").upsert(products, { onConflict: "id" });
if (productError) throw productError;

console.log(`Seeded seller "${STORE_SLUG}" (${SELLER_ID}) with ${products.length} products.`);
console.log(`Visit: http://localhost:3000/store/template-a/${STORE_SLUG}`);
console.log("Inactive product (should be hidden): 21111111-1111-4111-8111-111111111114");
