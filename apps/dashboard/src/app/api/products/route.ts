import { NextRequest, NextResponse } from "next/server";
import { productToInsert } from "@ansaa/shared/mappers";
import { requireSellerSession } from "@/lib/seller";
import type { Product } from "@ansaa/shared/types";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSellerSession();
    if (session instanceof NextResponse) return session;
    const { supabase, sellerId } = session;

    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const sku = String(form.get("sku") ?? "").trim();
    const category = String(form.get("category") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const priceCedis = Number(form.get("priceCedis"));
    const compareAtRaw = String(form.get("compareAtPriceCedis") ?? "").trim();
    const stockQuantity = Number(form.get("stockQuantity"));
    const active = form.get("active") === "on" || form.get("active") === "true";

    if (!name || !sku || !Number.isFinite(priceCedis) || priceCedis < 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Image files are ignored until storage is wired (Firebase Storage is gone).
    const product: Omit<Product, "id"> = {
      sellerId,
      name,
      description,
      priceCedis,
      compareAtPriceCedis: compareAtRaw ? Number(compareAtRaw) : undefined,
      images: [],
      stockQuantity: Number.isFinite(stockQuantity) ? stockQuantity : 0,
      sku,
      category,
      active,
      createdAt: Date.now(),
    };

    const { data, error } = await supabase
      .from("products")
      .insert(productToInsert(product))
      .select("id")
      .single();

    if (error || !data) {
      console.error("Failed to save product", error);
      return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Failed to save product", err);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}
