"use client";

import { useState } from "react";
import {
  uploadVerificationDocument,
  validateVerificationDocument,
  VERIFICATION_DOCUMENT_ACCEPT,
  type VerificationDocType,
} from "@ansaa/shared/id-verification";
import { createClient } from "@ansaa/shared/supabase/client";
import { useSeller } from "@/lib/seller-context";
import { createVerificationDocumentPreviewUrl } from "./actions";

type DocSlot = {
  docType: Exclude<VerificationDocType, "business-registration">;
  column: "id_document_url" | "profile_photo_url";
  label: string;
  hint: string;
};

const SLOTS: DocSlot[] = [
  {
    docType: "id-document",
    column: "id_document_url",
    label: "ID document",
    hint: "Photo of a national ID, passport, or similar.",
  },
  {
    docType: "profile-photo",
    column: "profile_photo_url",
    label: "Profile photo",
    hint: "A clear photo of your face.",
  },
];

type SlotUi = {
  path: string | null;
  uploading: boolean;
  previewing: boolean;
  previewUrl: string | null;
  error: string | null;
};

function initialSlots(paths: Record<DocSlot["docType"], string | null>): Record<DocSlot["docType"], SlotUi> {
  return {
    "id-document": {
      path: paths["id-document"],
      uploading: false,
      previewing: false,
      previewUrl: null,
      error: null,
    },
    "profile-photo": {
      path: paths["profile-photo"],
      uploading: false,
      previewing: false,
      previewUrl: null,
      error: null,
    },
  };
}

export function VerificationUpload() {
  const { seller } = useSeller();
  const [slots, setSlots] = useState<Record<DocSlot["docType"], SlotUi>>(() =>
    initialSlots({
      "id-document": seller?.idDocumentUrl ?? null,
      "profile-photo": seller?.profilePhotoUrl ?? null,
    })
  );

  function patch(docType: DocSlot["docType"], next: Partial<SlotUi>) {
    setSlots((prev) => ({ ...prev, [docType]: { ...prev[docType], ...next } }));
  }

  async function onFileChange(slot: DocSlot, file: File | undefined) {
    if (!file || !seller) return;

    const validationError = validateVerificationDocument(file);
    if (validationError) {
      patch(slot.docType, { error: validationError });
      return;
    }

    patch(slot.docType, { uploading: true, error: null, previewUrl: null });
    try {
      const path = await uploadVerificationDocument(seller.id, file, slot.docType);
      const supabase = createClient();
      const { error } = await supabase
        .from("sellers")
        .update({ [slot.column]: path })
        .eq("id", seller.id);

      if (error) throw error;
      patch(slot.docType, { uploading: false, path, error: null });
    } catch (err) {
      patch(slot.docType, {
        uploading: false,
        error: err instanceof Error ? err.message : "Upload failed.",
      });
    }
  }

  async function onPreview(docType: DocSlot["docType"]) {
    const path = slots[docType].path;
    if (!path) return;

    patch(docType, { previewing: true, error: null });
    const result = await createVerificationDocumentPreviewUrl(path);
    if ("error" in result) {
      patch(docType, { previewing: false, error: result.error });
      return;
    }
    patch(docType, { previewing: false, previewUrl: result.url, error: null });
  }

  if (!seller) {
    return (
      <p className="mt-4 text-sm text-ink-700/60">
        Link a seller profile to this account before uploading identity documents.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-6">
      {SLOTS.map((slot) => {
        const ui = slots[slot.docType];
        const inputId = `verification-${slot.docType}`;
        return (
          <div key={slot.docType} className="border-b border-wire pb-6 last:border-0 last:pb-0">
            <label htmlFor={inputId} className="text-sm font-medium text-ink-950">
              {slot.label}
            </label>
            <p className="mt-0.5 text-xs text-ink-700/40">{slot.hint}</p>

            <input
              id={inputId}
              type="file"
              accept={VERIFICATION_DOCUMENT_ACCEPT}
              disabled={ui.uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                void onFileChange(slot, file);
              }}
              className="mt-3 block w-full text-sm text-ink-700 file:mr-3 file:rounded-lg file:border file:border-wire file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink-950"
            />

            {ui.uploading ? (
              <p className="mt-2 text-xs text-ink-700/60">Uploading…</p>
            ) : null}
            {ui.path && !ui.uploading ? (
              <p className="mt-2 break-all font-mono text-xs text-ink-700/50">{ui.path}</p>
            ) : null}
            {ui.error ? <p className="mt-2 text-xs text-destructive">{ui.error}</p> : null}

            <button
              type="button"
              disabled={!ui.path || ui.uploading || ui.previewing}
              onClick={() => void onPreview(slot.docType)}
              className="mt-3 rounded-lg border border-wire px-3 py-1.5 text-sm font-medium text-ink-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {ui.previewing ? "Loading preview…" : "Preview"}
            </button>

            {ui.previewUrl ? (
              // Signed URLs expire and include query params; a plain img is the right fit.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ui.previewUrl}
                alt={`${slot.label} preview`}
                className="mt-4 max-h-64 w-full rounded-lg border border-wire object-contain bg-mist"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
