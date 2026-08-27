"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon, XIcon } from "lucide-react";
import {
  ProductImagePicker,
  useProductImageSlots,
  type ImageSlot,
} from "@/components/dashboard/ProductImagePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createSellerCategory,
  deleteSellerCategory,
  listSellerCategories,
  type SellerCategory,
} from "@/lib/product-categories";
import {
  emptyManualVariant,
  storefrontSizesAndColors,
  variantImageGroupKey,
  variantImageGroups,
  type DraftVariant,
} from "@/lib/product-variants";
import { useSeller } from "@/lib/seller-context";
import { cn } from "@/lib/utils";
import { productToInsert } from "@ansaa/shared/mappers";
import { createClient } from "@ansaa/shared/supabase/client";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";
import type { ProductVariant } from "@ansaa/shared/types";

const TABS = ["basic", "variations", "images", "descriptions"] as const;
type TabId = (typeof TABS)[number];

const TAB_LABELS: Record<TabId, string> = {
  basic: "Basic information",
  variations: "Variations and price",
  images: "Images",
  descriptions: "Descriptions",
};

const FIELD_INPUT_CLASS =
  "mt-1.5 w-full rounded-lg border border-black/8 bg-white px-4 py-2.5 text-sm text-ink-950 outline-none placeholder:text-muted-foreground focus:border-brand";

type SaveMode = "draft" | "publish";

export function NewProductForm() {
  const router = useRouter();
  const { seller } = useSeller();
  const images = useProductImageSlots();
  const [tab, setTab] = useState<TabId>("basic");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<SellerCategory[]>([]);
  const [hasVariations, setHasVariations] = useState(true);
  const [variants, setVariants] = useState<DraftVariant[]>([]);
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("0");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [variantImages, setVariantImages] = useState<Record<string, string[]>>({});
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState<SaveMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);

  const sellerKey = seller?.id ?? null;

  const imageGroups = useMemo(
    () => (hasVariations ? variantImageGroups(variants) : []),
    [hasVariations, variants]
  );

  useEffect(() => {
    const validSlots = new Set(images.slots.map((slot) => slot.id));
    const validGroups = new Set(imageGroups.map((group) => group.key));
    setVariantImages((prev) => {
      let changed = false;
      const next: Record<string, string[]> = {};
      for (const [key, slotIds] of Object.entries(prev)) {
        if (!validGroups.has(key)) {
          changed = true;
          continue;
        }
        const kept = slotIds.filter((id) => validSlots.has(id));
        if (kept.length !== slotIds.length) changed = true;
        next[key] = kept;
      }
      return changed ? next : prev;
    });
  }, [imageGroups, images.slots]);

  useEffect(() => {
    if (!sellerKey || !isSupabaseConfigured()) {
      setCategories([]);
      return;
    }

    let cancelled = false;
    const sellerId = sellerKey;
    async function loadCategories() {
      try {
        const supabase = createClient();
        const rows = await listSellerCategories(supabase, sellerId);
        if (!cancelled) setCategories(rows);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, [sellerKey]);

  function parsedPrice(raw: string): number | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const value = Number(trimmed);
    return Number.isFinite(value) && value >= 0 ? value : null;
  }

  function parsedStock(raw: string): number {
    const value = Number(raw);
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  }

  function urlsForSlots(
    uploaded: Array<{ id: string; url: string }>,
    slotIds: string[]
  ): string[] {
    const urlById = new Map(uploaded.map((item) => [item.id, item.url]));
    return slotIds.map((id) => urlById.get(id)).filter((url): url is string => Boolean(url));
  }

  function persistVariants(uploaded: Array<{ id: string; url: string }>): ProductVariant[] {
    if (!hasVariations) return [];
    const basePrice = parsedPrice(price) ?? 0;
    return variants
      .filter((row) => row.name.trim() || row.values.length > 0)
      .map((row) => {
        const imagesByValue: Record<string, string[]> = {};
        for (const value of row.values) {
          const urls = urlsForSlots(uploaded, variantImages[variantImageGroupKey(row.id, value)] ?? []);
          if (urls.length) imagesByValue[value] = urls;
        }
        const images = Object.values(imagesByValue).flat();
        return {
          id: row.id,
          name: row.name.trim() || undefined,
          values: row.values,
          sku: row.sku.trim(),
          priceCedis: parsedPrice(row.price) ?? basePrice,
          stockQuantity: row.stock.trim() === "" ? parsedStock(stock) : parsedStock(row.stock),
          images,
          imagesByValue: Object.keys(imagesByValue).length ? imagesByValue : undefined,
        };
      });
  }

  function productImageUrls(uploaded: Array<{ id: string; url: string }>): string[] {
    return urlsForSlots(
      uploaded,
      images.slots.map((slot) => slot.id)
    );
  }

  function toggleVariantImage(groupKey: string, slotId: string) {
    setVariantImages((prev) => {
      const current = prev[groupKey] ?? [];
      const nextIds = current.includes(slotId)
        ? current.filter((id) => id !== slotId)
        : [...current, slotId];
      return { ...prev, [groupKey]: nextIds };
    });
  }

  function payloadFields(
    uploaded: Array<{ id: string; url: string }>,
    active: boolean
  ) {
    const priceCedis = parsedPrice(price) ?? 0;
    const compareAt = parsedPrice(compareAtPrice);
    return {
      name: name.trim(),
      description: description.trim(),
      short_description: shortDescription.trim(),
      price_cedis: priceCedis,
      compare_at_price_cedis: compareAt,
      images: productImageUrls(uploaded),
      stock_quantity: parsedStock(stock),
      sku: sku.trim(),
      category: category.trim(),
      active,
      sizes: hasVariations ? storefrontSizesAndColors(variants).sizes : [],
      colors: hasVariations ? storefrontSizesAndColors(variants).colors : [],
      variants: persistVariants(uploaded),
    };
  }

  async function persist(mode: SaveMode) {
    if (!seller) {
      setError("No seller profile is linked to this account.");
      return false;
    }
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      return false;
    }

    const title = name.trim();
    if (!title) {
      setError("Enter a product title before saving.");
      setTab("basic");
      return false;
    }

    if (mode === "publish") {
      const priceCedis = parsedPrice(price);
      if (!sku.trim() || priceCedis == null) {
        setError("SKU and a valid price are required to publish.");
        setTab("variations");
        return false;
      }
      if (compareAtPrice.trim() && parsedPrice(compareAtPrice) == null) {
        setError("Compare-at price must be a valid number, or left blank.");
        setTab("variations");
        return false;
      }
    }

    setSaving(mode);
    setError(null);
    setDraftNotice(null);

    try {
      const supabase = createClient();
      const uploaded = await images.uploadAll(supabase, seller.id);
      const fields = payloadFields(uploaded, mode === "publish");

      if (savedId) {
        const { error: updateError } = await supabase
          .from("products")
          .update(fields)
          .eq("id", savedId)
          .eq("seller_id", seller.id);
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from("products")
          .insert(
            productToInsert({
              sellerId: seller.id,
              name: fields.name,
              description: fields.description,
              shortDescription: fields.short_description,
              priceCedis: fields.price_cedis,
              compareAtPriceCedis: fields.compare_at_price_cedis ?? undefined,
              images: fields.images,
              stockQuantity: fields.stock_quantity,
              sku: fields.sku,
              category: fields.category,
              active: fields.active,
              createdAt: Date.now(),
              sizes: fields.sizes,
              colors: fields.colors,
              variants: fields.variants,
            })
          )
          .select("id")
          .single();
        if (insertError || !data) throw insertError ?? new Error("Could not save product.");
        setSavedId(data.id);
      }

      if (mode === "draft") {
        setDraftNotice("Draft saved.");
      }
      return true;
    } catch (err) {
      console.error("Failed to save product", err);
      setError(err instanceof Error ? err.message : "Could not save product.");
      return false;
    } finally {
      setSaving(null);
    }
  }

  async function handleSaveDraft() {
    await persist("draft");
  }

  async function handleContinue() {
    const index = TABS.indexOf(tab);
    if (index < TABS.length - 1) {
      setTab(TABS[index + 1]);
      return;
    }
    const ok = await persist("publish");
    if (ok) router.push("/dashboard/products");
  }

  async function handleCreateCategory(rawName: string) {
    if (!seller || !isSupabaseConfigured()) {
      const nameValue = rawName.trim();
      if (!nameValue) return;
      if (categories.some((row) => row.name.toLowerCase() === nameValue.toLowerCase())) {
        setCategory(nameValue);
        return;
      }
      setCategories((prev) => [...prev, { id: `local:${nameValue}`, name: nameValue }]);
      setCategory(nameValue);
      return;
    }
    try {
      const supabase = createClient();
      const created = await createSellerCategory(supabase, seller.id, rawName);
      setCategories((prev) => {
        if (prev.some((row) => row.name.toLowerCase() === created.name.toLowerCase())) return prev;
        return [...prev, created].sort((a, b) => a.name.localeCompare(b.name));
      });
      setCategory(created.name);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create category.");
    }
  }

  async function handleDeleteCategory(row: SellerCategory) {
    if (seller && isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await deleteSellerCategory(supabase, seller.id, row);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not delete category.");
        return;
      }
    }
    setCategories((prev) => prev.filter((item) => item.id !== row.id));
    if (category === row.name) setCategory("");
  }

  function patchVariant(id: string, patch: Partial<DraftVariant>) {
    setVariants((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeVariant(id: string) {
    setVariants((prev) => prev.filter((item) => item.id !== id));
  }

  const busy = saving !== null;
  const displayError = error ?? images.error;

  return (
    <div className="px-4 pt-6 pb-8 lg:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink-950">Add new product</h1>
      <nav aria-label="Breadcrumb" className="mt-1 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/dashboard/products" className="hover:text-ink-950">
              Products
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-950">Add new product</li>
        </ol>
      </nav>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as TabId)}
        className="mt-6 gap-0"
      >
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-8 rounded-none border-b border-black/8 bg-transparent p-0"
        >
          {TABS.map((id) => (
            <TabsTrigger
              key={id}
              value={id}
              className="h-auto flex-none rounded-none px-0 py-3 text-sm font-medium text-muted-foreground after:h-0.5 after:bg-ink-950 data-active:text-ink-950"
            >
              {TAB_LABELS[id]}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-5 rounded-xl border border-black/8 bg-white">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-base font-semibold text-ink-950">Add new product</h2>
          </div>

          <TabsContent value="basic" className="px-6 pt-4 pb-2 outline-none">
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-ink-950">Product title</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="The Nepped T-Shirt in Midnight Teal"
                  className={FIELD_INPUT_CLASS}
                />
              </label>

              <CategoryManager
                categories={categories}
                selectedName={category}
                onSelect={setCategory}
                onCreate={handleCreateCategory}
                onDelete={handleDeleteCategory}
              />

              <div role="group" aria-labelledby="has-variations-label">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p id="has-variations-label" className="text-sm font-semibold text-ink-950">
                    Does the product have variations?
                  </p>
                  <div className="flex items-center gap-6">
                    <label className="inline-flex items-center gap-2 text-sm text-ink-950">
                      <input
                        type="radio"
                        name="hasVariations"
                        checked={hasVariations}
                        onChange={() => setHasVariations(true)}
                        className="size-4 accent-ink-950"
                      />
                      Yes
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-ink-950">
                      <input
                        type="radio"
                        name="hasVariations"
                        checked={!hasVariations}
                        onChange={() => {
                          setHasVariations(false);
                          setVariants([]);
                        }}
                        className="size-4 accent-ink-950"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variations" className="px-6 pt-4 pb-2 outline-none">
            <div className="space-y-5">
              {hasVariations ? (
                <p className="text-sm text-muted-foreground">
                  Add a variant such as Color, then add its values (Black, White). Price and stock
                  below apply as defaults.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This product has no variations. Price and stock apply to the whole product.
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-ink-950">
                    {hasVariations ? "Default price (GHS)" : "Price (GHS)"}
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="0.00"
                    className={FIELD_INPUT_CLASS}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink-950">Compare-at price (optional)</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(event) => setCompareAtPrice(event.target.value)}
                    placeholder="0.00"
                    className={FIELD_INPUT_CLASS}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink-950">
                    {hasVariations ? "Default SKU" : "SKU"}
                  </span>
                  <input
                    value={sku}
                    onChange={(event) => setSku(event.target.value)}
                    placeholder="SKU-001"
                    className={FIELD_INPUT_CLASS}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink-950">
                    {hasVariations ? "Default stock quantity" : "Stock quantity"}
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                    className={FIELD_INPUT_CLASS}
                  />
                </label>
              </div>

              {hasVariations ? (
                <VariantList
                  variants={variants}
                  defaultPrice={price}
                  defaultSku={sku}
                  defaultStock={stock}
                  onPatch={patchVariant}
                  onRemove={removeVariant}
                  onAdd={() => setVariants((prev) => [...prev, emptyManualVariant()])}
                />
              ) : null}
            </div>
          </TabsContent>

          <TabsContent value="images" className="px-6 pt-4 pb-2 outline-none">
            <span className="text-sm font-semibold text-ink-950">Product images</span>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload the photos, then choose which ones belong to each variant.
            </p>
            <div className="mt-3">
              <ProductImagePicker
                slots={images.slots}
                disabled={busy}
                onFilesSelected={images.handleFilesSelected}
                onRemove={images.removeSlot}
              />
            </div>
            {hasVariations ? (
              <VariantImageAssigner
                groups={imageGroups}
                slots={images.slots}
                assignments={variantImages}
                onToggle={toggleVariantImage}
              />
            ) : null}
          </TabsContent>

          <TabsContent value="descriptions" className="px-6 pt-4 pb-2 outline-none">
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-ink-950">Short description</span>
                <textarea
                  rows={3}
                  maxLength={240}
                  value={shortDescription}
                  onChange={(event) => setShortDescription(event.target.value)}
                  placeholder="A one-line summary for listings and cards"
                  className={cn(FIELD_INPUT_CLASS, "min-h-20 resize-y")}
                />
                <span className="mt-1 block text-xs text-muted-foreground">
                  {shortDescription.length}/240
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-ink-950">Description</span>
                <textarea
                  rows={8}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Tell shoppers about this product"
                  className={cn(FIELD_INPUT_CLASS, "min-h-40 resize-y")}
                />
              </label>
            </div>
          </TabsContent>

          {displayError ? (
            <p className="px-6 pt-2 text-sm text-delta-down">{displayError}</p>
          ) : null}
          {draftNotice && !displayError ? (
            <p className="px-6 pt-2 text-sm text-delta-up">{draftNotice}</p>
          ) : null}

          <div className="mt-6 flex items-center justify-between border-t border-black/6 px-6 py-4">
            <Link
              href="/dashboard/products"
              className="text-sm font-medium text-ink-950 hover:text-ink-800"
            >
              Cancel
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={handleSaveDraft}
                className="rounded-full bg-muted px-5 py-2.5 text-sm font-medium text-ink-950 hover:bg-muted/80 disabled:opacity-50"
              >
                {saving === "draft" ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleContinue}
                className="rounded-full bg-ink-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-800 disabled:opacity-50"
              >
                {saving === "publish"
                  ? images.slots.some((slot) => slot.status === "uploading")
                    ? "Uploading…"
                    : "Publishing…"
                  : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function CategoryManager({
  categories,
  selectedName,
  onSelect,
  onCreate,
  onDelete,
}: {
  categories: SellerCategory[];
  selectedName: string;
  onSelect: (name: string) => void;
  onCreate: (name: string) => Promise<void>;
  onDelete: (category: SellerCategory) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");
  const [creating, setCreating] = useState(false);

  async function submit() {
    const name = draft.trim();
    if (!name || creating) return;
    setCreating(true);
    try {
      await onCreate(name);
      setDraft("");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <span className="text-sm font-semibold text-ink-950">Categories</span>
      <p className="mt-1 text-sm text-muted-foreground">
        Create categories here, then select one to attach to this product.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void submit();
            }
          }}
          placeholder="New category name"
          className={cn(FIELD_INPUT_CLASS, "mt-0")}
        />
        <button
          type="button"
          disabled={creating || !draft.trim()}
          onClick={() => void submit()}
          className="shrink-0 rounded-lg bg-ink-950 px-3 text-sm font-medium text-white hover:bg-ink-800 disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {categories.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {categories.map((row) => {
            const selected = selectedName === row.name;
            return (
              <li key={row.id}>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm",
                    selected ? "bg-ink-950 text-white" : "bg-muted text-ink-950"
                  )}
                >
                  <button type="button" onClick={() => onSelect(selected ? "" : row.name)}>
                    {row.name}
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${row.name}`}
                    onClick={() => void onDelete(row)}
                    className={selected ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-ink-950"}
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">No categories yet.</p>
      )}
      {selectedName ? (
        <p className="mt-2 text-xs text-muted-foreground">Attached: {selectedName}</p>
      ) : null}
    </div>
  );
}

function VariantList({
  variants,
  defaultPrice,
  defaultSku,
  defaultStock,
  onPatch,
  onRemove,
  onAdd,
}: {
  variants: DraftVariant[];
  defaultPrice: string;
  defaultSku: string;
  defaultStock: string;
  onPatch: (id: string, patch: Partial<DraftVariant>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-950">Variants</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Name the variation (Color, Size, Material), then add as many values as you need.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-black/8 px-3 py-1.5 text-sm font-medium text-ink-950 hover:bg-muted"
        >
          <PlusIcon className="size-3.5" />
          Add variant
        </button>
      </div>

      {variants.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Click Add variant to create one, then add its values.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {variants.map((row) => (
            <div key={row.id} className="rounded-lg border border-black/8 p-4">
              <div className="flex items-center justify-between gap-3">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Variant name</span>
                  <input
                    value={row.name}
                    onChange={(event) => onPatch(row.id, { name: event.target.value })}
                    placeholder="e.g. Color"
                    list={`variant-name-suggestions-${row.id}`}
                    className={cn(FIELD_INPUT_CLASS, "mt-0 py-2 font-medium")}
                  />
                  <datalist id={`variant-name-suggestions-${row.id}`}>
                    <option value="Color" />
                    <option value="Size" />
                    <option value="Material" />
                  </datalist>
                </label>
                <button
                  type="button"
                  onClick={() => onRemove(row.id)}
                  className="shrink-0 text-sm text-muted-foreground hover:text-ink-950"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3">
                <TagInput
                  label="Value"
                  values={row.values}
                  onChange={(values) => onPatch(row.id, { values })}
                  placeholder="Type a value and press Enter (e.g. Black)"
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-ink-950">SKU</span>
                  <input
                    value={row.sku}
                    onChange={(event) => onPatch(row.id, { sku: event.target.value })}
                    placeholder={defaultSku || "SKU-001"}
                    className={cn(FIELD_INPUT_CLASS, "mt-1 py-2")}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-ink-950">Price (GHS)</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={row.price}
                    onChange={(event) => onPatch(row.id, { price: event.target.value })}
                    placeholder={defaultPrice || "0.00"}
                    className={cn(FIELD_INPUT_CLASS, "mt-1 py-2")}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-medium text-ink-950">Stock</span>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={row.stock}
                    onChange={(event) => onPatch(row.id, { stock: event.target.value })}
                    placeholder={defaultStock || "0"}
                    className={cn(FIELD_INPUT_CLASS, "mt-1 py-2")}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VariantImageAssigner({
  groups,
  slots,
  assignments,
  onToggle,
}: {
  groups: Array<{ key: string; label: string; variantId: string; variantName: string }>;
  slots: ImageSlot[];
  assignments: Record<string, string[]>;
  onToggle: (groupKey: string, slotId: string) => void;
}) {
  if (groups.length === 0) {
    return (
      <p className="mt-5 text-sm text-muted-foreground">
        Add a variant and its values on the Variations tab, then select images for each value
        here.
      </p>
    );
  }

  const sections: Array<{ id: string; name: string; items: typeof groups }> = [];
  for (const group of groups) {
    const last = sections[sections.length - 1];
    if (last && last.id === group.variantId) last.items.push(group);
    else sections.push({ id: group.variantId, name: group.variantName, items: [group] });
  }

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-ink-950">Variant</p>
      <div className="mt-3 space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <p className="text-sm font-medium text-ink-950">{section.name}</p>
            {section.items.map((group) => {
              const selected = new Set(assignments[group.key] ?? []);
              return (
                <div key={group.key} className="pl-1">
                  <p className="text-sm text-ink-950">{group.label}</p>
                  {slots.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Upload images above, then select the ones for {group.label}.
                    </p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {slots.map((slot) => {
                        const isSelected = selected.has(slot.id);
                        return (
                          <button
                            key={`${group.key}-${slot.id}`}
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`${isSelected ? "Remove from" : "Assign to"} ${group.label}`}
                            onClick={() => onToggle(group.key, slot.id)}
                            className={cn(
                              "relative size-16 overflow-hidden rounded-lg border-2 bg-muted",
                              isSelected
                                ? "border-ink-950"
                                : "border-transparent opacity-50 hover:opacity-100"
                            )}
                          >
                            {/* User-supplied / blob URLs are not limited to next/image remotePatterns. */}
                            <img src={slot.previewUrl} alt="" className="size-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    const exists = values.some((value) => value.toLowerCase() === tag.toLowerCase());
    if (exists) {
      setDraft("");
      return;
    }
    onChange([...values, tag]);
    setDraft("");
  }

  return (
    <div>
      <span className="text-sm font-semibold text-ink-950">{label}</span>
      {values.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm text-ink-950"
            >
              {value}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={() => onChange(values.filter((item) => item !== value))}
                className="text-muted-foreground hover:text-ink-950"
              >
                <XIcon className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addTag(event.currentTarget.value);
          }
        }}
        onBlur={(event) => addTag(event.currentTarget.value)}
        placeholder={placeholder}
        className={FIELD_INPUT_CLASS}
      />
    </div>
  );
}
