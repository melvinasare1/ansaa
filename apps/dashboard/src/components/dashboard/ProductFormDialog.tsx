"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlusIcon, Loader2Icon, XIcon } from "lucide-react";
import { productToInsert } from "@ansaa/shared/mappers";
import { useSeller } from "@/lib/seller-context";
import {
  MAX_PRODUCT_IMAGES,
  PRODUCT_IMAGE_ACCEPT,
  uploadProductImage,
  validateProductImage,
} from "@/lib/product-images";
import { createClient } from "@ansaa/shared/supabase/client";
import type { Product } from "@ansaa/shared/types";

type ProductFormDialogProps = {
  open: boolean;
  product?: Product | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

type ImageSlotStatus = "ready" | "uploading" | "uploaded" | "error";

type ImageSlot = {
  id: string;
  previewUrl: string;
  file?: File;
  publicUrl?: string;
  status: ImageSlotStatus;
  progress: number;
  error?: string;
};

function revokeIfBlob(url: string) {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}

function slotsFromProduct(product?: Product | null): ImageSlot[] {
  return (product?.images ?? []).slice(0, MAX_PRODUCT_IMAGES).map((url) => ({
    id: url,
    previewUrl: url,
    publicUrl: url,
    status: "uploaded",
    progress: 100,
  }));
}

export default function ProductFormDialog({
  open,
  product,
  onOpenChange,
  onSaved,
}: ProductFormDialogProps) {
  const { seller } = useSeller();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slotsRef = useRef<ImageSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<ImageSlot[]>(() => slotsFromProduct(product));
  const isEdit = Boolean(product);
  slotsRef.current = slots;

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSlots((prev) => {
      for (const slot of prev) revokeIfBlob(slot.previewUrl);
      return slotsFromProduct(product);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on open / product id, not object identity
  }, [open, product?.id]);

  useEffect(() => {
    return () => {
      for (const slot of slotsRef.current) revokeIfBlob(slot.previewUrl);
    };
  }, []);

  function patchSlot(id: string, patch: Partial<ImageSlot>) {
    setSlots((prev) => prev.map((slot) => (slot.id === id ? { ...slot, ...patch } : slot)));
  }

  function removeSlot(id: string) {
    setSlots((prev) => {
      const next: ImageSlot[] = [];
      for (const slot of prev) {
        if (slot.id === id) {
          revokeIfBlob(slot.previewUrl);
        } else {
          next.push(slot);
        }
      }
      return next;
    });
  }

  function handleFilesSelected(list: FileList | null) {
    if (!list?.length) return;
    const remaining = MAX_PRODUCT_IMAGES - slots.length;
    if (remaining <= 0) {
      setError(`You can add up to ${MAX_PRODUCT_IMAGES} images.`);
      return;
    }

    const incoming = Array.from(list);
    const accepted = incoming.slice(0, remaining);
    const overflow = incoming.length - accepted.length;
    const nextSlots: ImageSlot[] = accepted.map((file) => {
      const validationError = validateProductImage(file);
      return {
        id: crypto.randomUUID(),
        previewUrl: URL.createObjectURL(file),
        file,
        status: validationError ? "error" : "ready",
        progress: 0,
        error: validationError ?? undefined,
      };
    });

    setSlots((prev) => [...prev, ...nextSlots]);
    if (overflow > 0) {
      setError(`Only ${MAX_PRODUCT_IMAGES} images are allowed. ${overflow} extra file${overflow === 1 ? " was" : "s were"} not added.`);
    } else {
      const invalid = nextSlots.filter((slot) => slot.status === "error").length;
      setError(
        invalid
          ? `${invalid} image${invalid === 1 ? "" : "s"} could not be added. See the thumbnail${invalid === 1 ? "" : "s"} below.`
          : null
      );
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!seller) {
      setError("No seller profile is linked to this account.");
      return;
    }

    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const sku = String(data.get("sku") ?? "").trim();
    const category = String(data.get("category") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const priceCedis = Number(data.get("priceCedis"));
    const stockQuantity = Number(data.get("stockQuantity"));
    const active = data.get("active") === "on";

    if (!name || !sku || !Number.isFinite(priceCedis) || priceCedis < 0) {
      setError("Name, SKU, and a valid price are required.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const uploadResults = await Promise.all(
        slots.map(async (slot) => {
          if (slot.publicUrl) {
            return { id: slot.id, url: slot.publicUrl, error: null };
          }
          if (!slot.file) {
            const message = slot.error ?? "This image is missing a file to upload.";
            patchSlot(slot.id, { status: "error", error: message });
            return { id: slot.id, url: null, error: message };
          }

          const validationError = validateProductImage(slot.file);
          if (validationError) {
            patchSlot(slot.id, { status: "error", error: validationError, progress: 0 });
            return { id: slot.id, url: null, error: validationError };
          }

          patchSlot(slot.id, { status: "uploading", progress: 0, error: undefined });
          try {
            const url = await uploadProductImage(supabase, seller.id, slot.file, (percent) => {
              patchSlot(slot.id, { progress: percent, status: "uploading" });
            });
            patchSlot(slot.id, {
              status: "uploaded",
              publicUrl: url,
              progress: 100,
              error: undefined,
            });
            return { id: slot.id, url, error: null };
          } catch (err) {
            const message = err instanceof Error ? err.message : "Upload failed.";
            patchSlot(slot.id, { status: "error", error: message, progress: 0 });
            return { id: slot.id, url: null, error: message };
          }
        })
      );

      const failed = uploadResults.filter((result) => result.error);
      if (failed.length > 0) {
        setError(
          failed.length === 1
            ? `Could not upload an image: ${failed[0].error}`
            : `Could not upload ${failed.length} images. Fix the errors on the thumbnails and try again.`
        );
        setLoading(false);
        return;
      }

      const images = uploadResults.map((result) => result.url).filter((url): url is string => Boolean(url));
      const fields = {
        name,
        description,
        price_cedis: priceCedis,
        images,
        stock_quantity: Number.isFinite(stockQuantity) ? Math.max(0, Math.floor(stockQuantity)) : 0,
        sku,
        category,
        active,
      };

      if (product) {
        const { error: updateError } = await supabase
          .from("products")
          .update(fields)
          .eq("id", product.id)
          .eq("seller_id", seller.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("products").insert(
          productToInsert({
            sellerId: seller.id,
            name,
            description,
            priceCedis,
            images,
            stockQuantity: Number.isFinite(stockQuantity) ? Math.max(0, Math.floor(stockQuantity)) : 0,
            sku,
            category,
            active,
            createdAt: Date.now(),
          })
        );
        if (insertError) throw insertError;
      }

      onOpenChange(false);
      onSaved();
    } catch (err) {
      console.error("Failed to save product", err);
      setError(err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const canAddMore = slots.length < MAX_PRODUCT_IMAGES && !loading;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/40 px-4 py-10"
      onClick={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="w-full max-w-lg rounded-xl border border-black/8 bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="product-form-title" className="text-lg font-semibold text-ink-950">
              {isEdit ? "Edit product" : "Add New Product"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isEdit
                ? "Updates this row in your catalog."
                : "Goes live on your storefront once marked active."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-sm text-muted-foreground hover:text-ink-950"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Name" name="name" required defaultValue={product?.name} />
          <Field label="SKU" name="sku" required defaultValue={product?.sku} />
          <Field label="Category" name="category" defaultValue={product?.category} />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Price (GHS)"
              name="priceCedis"
              type="number"
              required
              defaultValue={product ? String(product.priceCedis) : ""}
            />
            <Field
              label="Stock quantity"
              name="stockQuantity"
              type="number"
              step="1"
              defaultValue={product ? String(product.stockQuantity) : "0"}
            />
          </div>
          <label className="block">
            <span className="text-sm font-medium text-ink-950">Description</span>
            <textarea
              name="description"
              rows={3}
              defaultValue={product?.description}
              className="mt-1.5 w-full rounded-lg border border-black/8 px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <div>
            <span className="text-sm font-medium text-ink-950">Images</span>
            <div className="mt-1.5 grid grid-cols-4 gap-2">
              {slots.map((slot) => (
                <ImageSlotThumb
                  key={slot.id}
                  slot={slot}
                  disabled={loading}
                  onRemove={() => removeSlot(slot.id)}
                />
              ))}
              {canAddMore ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-black/15 bg-muted/40 text-muted-foreground hover:border-brand hover:text-ink-950"
                >
                  <ImagePlusIcon className="size-5" />
                  <span className="text-[11px] font-medium">Add</span>
                </button>
              ) : null}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={PRODUCT_IMAGE_ACCEPT}
              multiple
              className="sr-only"
              aria-label="Upload product images"
              disabled={!canAddMore}
              onChange={(event) => handleFilesSelected(event.target.files)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Up to {MAX_PRODUCT_IMAGES} images (JPEG, PNG, WebP, or GIF), 5 MB each.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-950">
            <input
              type="checkbox"
              name="active"
              defaultChecked={product?.active ?? true}
              className="accent-ink-950"
            />
            Active on storefront
          </label>

          {error ? <p className="text-sm text-delta-down">{error}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-ink-950"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-ink-950 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? (slots.some((slot) => slot.status === "uploading") ? "Uploading…" : "Saving…") : isEdit ? "Save changes" : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImageSlotThumb({
  slot,
  disabled,
  onRemove,
}: {
  slot: ImageSlot;
  disabled: boolean;
  onRemove: () => void;
}) {
  const uploading = slot.status === "uploading";
  const failed = slot.status === "error";

  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-lg border bg-muted ${
        failed ? "border-delta-down" : "border-black/8"
      }`}
    >
      {/* User-supplied / blob URLs are not limited to next/image remotePatterns. */}
      <img src={slot.previewUrl} alt="" className="size-full object-cover" />
      {uploading ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ink-950/55 px-1 text-white"
          aria-busy="true"
          aria-label={`Uploading ${slot.progress}%`}
        >
          <Loader2Icon className="size-5 animate-spin" />
          <span className="text-[11px] font-medium tabular-nums">{slot.progress}%</span>
        </div>
      ) : null}
      {failed ? (
        <div
          className="absolute inset-x-0 bottom-0 bg-delta-down px-1 py-0.5 text-[10px] leading-tight text-white"
          title={slot.error ?? "Upload failed"}
        >
          Upload failed
        </div>
      ) : null}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled || uploading}
        aria-label="Remove image"
        className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-ink-950/70 text-white disabled:opacity-40"
      >
        <XIcon className="size-3" />
      </button>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-950">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? step ?? "0.01" : undefined}
        className="mt-1.5 w-full rounded-lg border border-black/8 px-4 py-2.5 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}
