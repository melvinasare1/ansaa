"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlusIcon, Loader2Icon, XIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PRODUCT_IMAGE_ACCEPT,
  uploadProductImage,
  validateProductImage,
} from "@/lib/product-images";
import { storefrontUrl } from "@/lib/storefront-url";
import { createClient } from "@ansaa/shared/supabase/client";
import {
  getStorefrontContentFields,
  getStorefrontEditorPages,
  parseStorefrontContent,
  storefrontContentForSave,
  storefrontPageLabel,
  type StorefrontContent,
  type StorefrontContentField,
} from "@ansaa/shared/storefront-content-schema";
import type { Seller } from "@ansaa/shared/types";

const FIELD_CLASS =
  "mt-1.5 w-full rounded-lg border border-wire bg-white px-4 py-2.5 text-sm text-ink-950 outline-none placeholder:text-ink-700/40 focus:border-signal";

function valuesFromContent(
  fields: StorefrontContentField[],
  content: StorefrontContent
): StorefrontContent {
  return Object.fromEntries(fields.map((field) => [field.key, content[field.key] ?? ""]));
}

export function StorefrontEditor({
  seller,
  initialContent,
}: {
  seller: Seller;
  initialContent: StorefrontContent;
}) {
  const router = useRouter();
  const fields = useMemo(() => getStorefrontContentFields(seller.template), [seller.template]);
  const pages = useMemo(() => getStorefrontEditorPages(seller.template), [seller.template]);
  const [activePage, setActivePage] = useState(pages[0] ?? "");
  const [values, setValues] = useState<StorefrontContent>(() =>
    valuesFromContent(fields, initialContent)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const storeUrl = storefrontUrl(seller);

  useEffect(() => {
    const fromServer = valuesFromContent(fields, initialContent);
    const hasSavedValue = fields.some((field) => fromServer[field.key]?.trim());
    if (hasSavedValue) {
      setValues(fromServer);
      return;
    }

    let cancelled = false;
    void (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("sellers")
        .select("store_content")
        .eq("id", seller.id)
        .maybeSingle();
      if (cancelled || error) return;
      const next = valuesFromContent(fields, parseStorefrontContent(data?.store_content));
      if (!fields.some((field) => next[field.key]?.trim())) return;
      setValues(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [fields, initialContent, seller.id]);

  useEffect(() => {
    if (pages.length === 0) return;
    if (!pages.includes(activePage)) setActivePage(pages[0] ?? "");
  }, [pages, activePage]);

  function setField(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const payload = storefrontContentForSave(fields, values);
      const { data, error: updateError } = await supabase
        .from("sellers")
        .update({ store_content: payload })
        .eq("id", seller.id)
        .select("id")
        .maybeSingle();
      if (updateError) throw updateError;
      if (!data) throw new Error("Could not save storefront content. Try signing in again.");
      setValues(payload);
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save storefront content.");
    } finally {
      setSaving(false);
    }
  }

  if (pages.length === 0) {
    return (
      <p className="mt-6 text-sm text-ink-700/60">
        Content editing for this template is not available yet.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6">
      <Tabs value={activePage} onValueChange={setActivePage} className="gap-0">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-6 rounded-none border-b border-wire bg-transparent p-0"
        >
          {pages.map((page) => (
            <TabsTrigger
              key={page}
              value={page}
              className="h-auto flex-none rounded-none px-0 py-3 text-sm font-medium text-muted-foreground after:h-0.5 after:bg-ink-950 data-active:text-ink-950"
            >
              {storefrontPageLabel(page)}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages.map((page) => {
          const pageFields = getStorefrontContentFields(seller.template, page);
          return (
            <TabsContent key={page} value={page} className="mt-6 outline-none">
              <section className="rounded-xl border border-wire bg-white p-6">
                {pageFields.length === 0 ? (
                  <p className="text-sm text-ink-700/60">No editable content on this page yet.</p>
                ) : (
                  <div className="space-y-5">
                    {pageFields.map((field) => (
                      <EditorField
                        key={field.key}
                        field={field}
                        value={values[field.key] ?? ""}
                        sellerId={seller.id}
                        disabled={saving}
                        onChange={(next) => setField(field.key, next)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </TabsContent>
          );
        })}
      </Tabs>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-ink-950 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save storefront content"}
        </button>
        {saved && storeUrl ? (
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-wire px-4 py-2 text-sm font-medium text-ink-950 hover:border-signal"
          >
            View your live store
          </a>
        ) : null}
      </div>
      {saved && !storeUrl ? (
        <p className="mt-3 text-sm text-ink-700/60">Saved. Set a store slug to view your live shop.</p>
      ) : null}
    </form>
  );
}

function EditorField({
  field,
  value,
  sellerId,
  disabled,
  onChange,
}: {
  field: StorefrontContentField;
  value: string;
  sellerId: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={`store-content-${field.key}`} className="text-sm font-medium text-ink-950">
        {field.label}
      </label>
      {field.type === "text" ? (
        <input
          id={`store-content-${field.key}`}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          className={FIELD_CLASS}
        />
      ) : null}
      {field.type === "textarea" ? (
        <textarea
          id={`store-content-${field.key}`}
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          className={FIELD_CLASS}
        />
      ) : null}
      {field.type === "image" ? (
        <ContentImageField
          field={field}
          value={value}
          sellerId={sellerId}
          disabled={disabled}
          onChange={onChange}
        />
      ) : null}
    </div>
  );
}

function ContentImageField({
  field,
  value,
  sellerId,
  disabled,
  onChange,
}: {
  field: StorefrontContentField;
  value: string;
  sellerId: string;
  disabled: boolean;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    const validationError = validateProductImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      const supabase = createClient();
      const url = await uploadProductImage(supabase, sellerId, file, setProgress);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-1.5">
      {value ? (
        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg border border-wire bg-mist">
          {/* Public storage URLs; next/image remotePatterns are not required here. */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={disabled || uploading}
            aria-label={`Remove ${field.label}`}
            className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-ink-950/70 text-white disabled:opacity-40"
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-wire px-4 py-3 text-sm font-medium text-ink-700 hover:border-signal hover:text-ink-950 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Uploading {progress}%
          </>
        ) : (
          <>
            <ImagePlusIcon className="size-4" />
            {value ? "Replace image" : field.placeholder}
          </>
        )}
      </button>
      <input
        ref={inputRef}
        id={`store-content-${field.key}`}
        type="file"
        accept={PRODUCT_IMAGE_ACCEPT}
        className="sr-only"
        disabled={disabled || uploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          void onFile(file);
        }}
      />
      {error ? <p className="mt-1.5 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
