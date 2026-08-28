"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  checkStoreSlugAvailable,
  completeSellerProfile,
  signUpSeller,
} from "@/app/signup-seller/actions";
import {
  FULFILMENT_FEATURES,
  PRODUCT_CATEGORY_SUGGESTIONS,
  STOREFRONT_TEMPLATE_OPTIONS,
  templateLabel,
  WEBSITE_ADMIN_FEATURES,
} from "@/lib/storefront-templates";
import { slugifyStoreName } from "@/lib/store-slug";
import { cn } from "@/lib/utils";
import {
  PRICING_TIER_BASE_FEE_CEDIS,
  parseStorefrontTemplate,
  type PricingTier,
  type StorefrontTemplate,
} from "@ansaa/shared/types";

const INPUT_CLASS =
  "mt-1.5 w-full rounded-lg border border-black/8 bg-white px-4 py-2.5 text-sm text-ink-950 outline-none placeholder:text-muted-foreground focus:border-brand";

const STORAGE_KEY = "ansaa-seller-onboarding";

type WizardMode = "signup" | "complete";
type SlugStatus = "idle" | "checking" | "available" | "taken" | "invalid";

type Draft = {
  email: string;
  businessName: string;
  storeSlug: string;
  phone: string;
  template: StorefrontTemplate;
  productCategory: string;
  pricingTier: PricingTier;
};

const EMPTY_DRAFT: Draft = {
  email: "",
  businessName: "",
  storeSlug: "",
  phone: "",
  template: "template-a",
  productCategory: "",
  pricingTier: "website_admin",
};

const SIGNUP_STEPS = ["Account", "Template", "Business", "Plan", "Confirm"] as const;
const COMPLETE_STEPS = ["Template", "Business", "Plan", "Confirm"] as const;

function readDraft(): Draft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DRAFT;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      email: String(parsed.email ?? ""),
      businessName: String(parsed.businessName ?? ""),
      storeSlug: slugifyStoreName(String(parsed.storeSlug ?? "")),
      phone: String(parsed.phone ?? ""),
      template: parseStorefrontTemplate(parsed.template),
      productCategory: String(parsed.productCategory ?? ""),
      pricingTier: parsed.pricingTier === "fulfilment" ? "fulfilment" : "website_admin",
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

function persistDraft(draft: Draft) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* private mode */
  }
}

function placeholderDomain(slug: string) {
  return `${slug || "your-store"}.local`;
}

export default function SellerOnboardingWizard({ mode }: { mode: WizardMode }) {
  const router = useRouter();
  const steps = mode === "signup" ? SIGNUP_STEPS : COMPLETE_STEPS;
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    const saved = readDraft();
    setDraft(saved);
    if (saved.storeSlug) setSlugTouched(true);
  }, []);

  const updateDraft = useCallback((patch: Partial<Draft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      persistDraft(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (step !== (mode === "signup" ? 2 : 1)) return;
    const slug = draft.storeSlug;
    if (!slug) {
      setSlugStatus("invalid");
      return;
    }
    setSlugStatus("checking");
    let cancelled = false;
    const timer = window.setTimeout(() => {
      checkStoreSlugAvailable(slug).then((result) => {
        if (cancelled) return;
        if (result.error) {
          setSlugStatus("idle");
          return;
        }
        setSlugStatus(result.available ? "available" : "taken");
      });
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [draft.storeSlug, mode, step]);

  const planLabel =
    draft.pricingTier === "fulfilment" ? "Fulfilment · 400 GHS/mo intro" : "Website & Admin · 250 GHS/mo";

  const canContinue = useMemo(() => {
    const signupStep = mode === "signup" ? step : step + 1;
    if (signupStep === 0) {
      return Boolean(draft.email.trim() && password.length >= 6 && password === confirmPassword);
    }
    if (signupStep === 2) {
      return (
        Boolean(draft.businessName.trim()) &&
        Boolean(draft.productCategory.trim()) &&
        Boolean(draft.storeSlug) &&
        slugStatus === "available" &&
        draft.phone.replace(/\D/g, "").length >= 9
      );
    }
    return true;
  }, [confirmPassword, draft, mode, password, slugStatus, step]);

  function goNext() {
    setError(null);
    if (mode === "signup" && step === 0 && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!canContinue) return;
    setStep((n) => Math.min(n + 1, steps.length - 1));
  }

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        businessName: draft.businessName,
        storeSlug: draft.storeSlug,
        phone: draft.phone,
        template: draft.template,
        pricingTier: draft.pricingTier,
        productCategory: draft.productCategory,
      };

      const result =
        mode === "signup"
          ? await signUpSeller({
              ...payload,
              email: draft.email,
              password,
            })
          : await completeSellerProfile(payload);

      if (!result || typeof result !== "object") {
        setError("Could not create the seller profile. Try again.");
        return;
      }

      if ("error" in result) {
        setError(result.error);
        if (result.resumeProfile && mode === "signup") {
          router.replace("/signup-seller/complete");
        }
        return;
      }

      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }

      if (result.needsEmailConfirmation) {
        setCheckEmail(true);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the seller profile.");
    } finally {
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <Shell>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand">Check your inbox</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink-950">Confirm your email to finish.</h1>
        <p className="mt-3 text-sm text-ink-700">
          We created your seller profile. Open the confirmation link, then{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            log in to your dashboard
          </Link>
          .
        </p>
      </Shell>
    );
  }

  const signupIndex = mode === "signup" ? step : step + 1;

  return (
    <Shell>
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand">
        {mode === "complete" ? "Finish setup" : "Create your store"}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink-950">
        {mode === "complete" ? "Complete your seller profile" : "Set up your Fulfil store"}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-ink-700">
        {mode === "complete"
          ? "Your login exists, but there is no seller profile yet. Finish these steps to attach one. Nothing is live until you confirm."
          : "Five short steps. We only create your account and store when you confirm on the last screen."}
      </p>

      <ol className="mt-8 flex flex-wrap gap-2">
        {steps.map((label, index) => {
          const active = index === step;
          const done = index < step;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                  done && "bg-brand text-white",
                  active && "bg-brand-soft text-brand",
                  !done && !active && "bg-white text-muted-foreground ring-1 ring-black/8"
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={2.5} /> : index + 1}
              </span>
              <span className={cn("text-sm", active ? "font-medium text-ink-950" : "text-muted-foreground")}>
                {label}
              </span>
              {index < steps.length - 1 ? <span className="mx-1 hidden h-px w-6 bg-black/10 sm:block" /> : null}
            </li>
          );
        })}
      </ol>

      <div className="mt-8">
        {signupIndex === 0 ? (
          <AccountStep
            email={draft.email}
            password={password}
            confirmPassword={confirmPassword}
            onEmail={(email) => updateDraft({ email })}
            onPassword={setPassword}
            onConfirm={setConfirmPassword}
          />
        ) : null}

        {signupIndex === 1 ? (
          <TemplateStep
            selected={draft.template}
            onSelect={(template) => updateDraft({ template })}
          />
        ) : null}

        {signupIndex === 2 ? (
          <BusinessStep
            draft={draft}
            slugStatus={slugStatus}
            onBusinessName={(businessName) => {
              updateDraft({
                businessName,
                storeSlug: slugTouched ? draft.storeSlug : slugifyStoreName(businessName),
              });
            }}
            onSlug={(storeSlug) => {
              setSlugTouched(true);
              updateDraft({ storeSlug: slugifyStoreName(storeSlug) });
            }}
            onPhone={(phone) => updateDraft({ phone })}
            onCategory={(productCategory) => updateDraft({ productCategory })}
          />
        ) : null}

        {signupIndex === 3 ? (
          <PlanStep
            selected={draft.pricingTier}
            onSelect={(pricingTier) => updateDraft({ pricingTier })}
          />
        ) : null}

        {signupIndex === 4 ? (
          <ConfirmStep draft={draft} email={mode === "signup" ? draft.email : undefined} planLabel={planLabel} />
        ) : null}
      </div>

      {error ? <p className="mt-6 text-sm text-delta-down">{error}</p> : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep((n) => n - 1);
            }}
            className="text-sm font-medium text-ink-700 hover:text-ink-950"
          >
            Back
          </button>
        ) : (
          <Link href="/login" className="text-sm text-muted-foreground hover:text-ink-950">
            Already have a login?
          </Link>
        )}

        {signupIndex < 4 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-50"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-50"
          >
            {loading ? "Creating store…" : "Go to dashboard"}
          </button>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-mist px-6 py-12 text-ink-950 md:py-16">
      <div className="mx-auto max-w-3xl">{children}</div>
    </main>
  );
}

function AccountStep({
  email,
  password,
  confirmPassword,
  onEmail,
  onPassword,
  onConfirm,
}: {
  email: string;
  password: string;
  confirmPassword: string;
  onEmail: (value: string) => void;
  onPassword: (value: string) => void;
  onConfirm: (value: string) => void;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-black/8 bg-white p-6 shadow-card">
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          className={INPUT_CLASS}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => onPassword(e.target.value)}
          className={INPUT_CLASS}
        />
        <span className="mt-1.5 block text-xs text-muted-foreground">At least 6 characters.</span>
      </label>
      <label className="block">
        <span className="text-sm font-medium">Confirm password</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => onConfirm(e.target.value)}
          className={INPUT_CLASS}
        />
      </label>
    </div>
  );
}

function TemplateStep({
  selected,
  onSelect,
}: {
  selected: StorefrontTemplate;
  onSelect: (id: StorefrontTemplate) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {STOREFRONT_TEMPLATE_OPTIONS.map((template) => {
        const active = template.id === selected;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              "flex flex-col rounded-2xl border bg-white p-5 text-left shadow-card transition",
              active ? "border-brand ring-2 ring-brand/20" : "border-black/8 hover:border-black/20"
            )}
          >
            <div className={cn("aspect-[4/3] w-full rounded-xl", template.previewClass)} aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg font-semibold">{template.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{template.description}</p>
            <span className={cn("mt-4 text-sm font-medium", active ? "text-brand" : "text-muted-foreground")}>
              {active ? "Selected" : "Select"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BusinessStep({
  draft,
  slugStatus,
  onBusinessName,
  onSlug,
  onPhone,
  onCategory,
}: {
  draft: Draft;
  slugStatus: SlugStatus;
  onBusinessName: (value: string) => void;
  onSlug: (value: string) => void;
  onPhone: (value: string) => void;
  onCategory: (value: string) => void;
}) {
  const slugHint =
    slugStatus === "checking"
      ? "Checking availability…"
      : slugStatus === "available"
        ? "This store URL is available."
        : slugStatus === "taken"
          ? "That store URL is taken. Try another."
          : slugStatus === "invalid"
            ? "Use letters or numbers."
            : "Public path on your storefront.";

  return (
    <div className="space-y-5 rounded-2xl border border-black/8 bg-white p-6 shadow-card">
      <label className="block">
        <span className="text-sm font-medium">Business name</span>
        <input
          type="text"
          autoComplete="organization"
          required
          value={draft.businessName}
          onChange={(e) => onBusinessName(e.target.value)}
          className={INPUT_CLASS}
        />
      </label>

      <div>
        <span className="text-sm font-medium">Product category</span>
        <input
          type="text"
          required
          value={draft.productCategory}
          onChange={(e) => onCategory(e.target.value)}
          placeholder="e.g. Fashion"
          className={INPUT_CLASS}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {PRODUCT_CATEGORY_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onCategory(tag)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                draft.productCategory === tag
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-black/8 text-ink-700 hover:border-black/20"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Store slug</span>
        <input
          type="text"
          required
          value={draft.storeSlug}
          onChange={(e) => onSlug(e.target.value)}
          className={`${INPUT_CLASS} font-mono`}
        />
        <span
          className={cn(
            "mt-1.5 block text-xs",
            slugStatus === "taken" || slugStatus === "invalid" ? "text-delta-down" : "text-muted-foreground"
          )}
        >
          {slugHint} /store/{draft.template}/{draft.storeSlug || "your-store"}
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-medium">MoMo number for receiving payments</span>
        <input
          type="tel"
          autoComplete="tel"
          required
          value={draft.phone}
          onChange={(e) => onPhone(e.target.value)}
          placeholder="e.g. 024 123 4567"
          className={INPUT_CLASS}
        />
        <span className="mt-1.5 block text-xs text-muted-foreground">
          This is the number buyers will send Mobile Money to at checkout, not just a contact number.
          A wrong number here means payment goes to the wrong place.
        </span>
      </label>

      <div>
        <span className="text-sm font-medium">Domain</span>
        <p className="mt-1.5 rounded-lg border border-dashed border-black/12 bg-mist px-4 py-2.5 font-mono text-sm text-ink-700">
          {placeholderDomain(draft.storeSlug)}
        </p>
        <span className="mt-1.5 block text-xs text-muted-foreground">
          Placeholder for now. Connecting a real custom domain is a manual step we handle later.
        </span>
      </div>
    </div>
  );
}

function PlanStep({
  selected,
  onSelect,
}: {
  selected: PricingTier;
  onSelect: (tier: PricingTier) => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <article
        className={cn(
          "flex flex-col rounded-2xl border bg-white p-6 shadow-card",
          selected === "website_admin" ? "border-brand ring-2 ring-brand/20" : "border-black/8"
        )}
      >
        <h3 className="font-display text-2xl font-semibold">Website & Admin</h3>
        <p className="mt-2 text-sm text-ink-700">Your own storefront, run it yourself.</p>
        <p className="mt-6 font-display text-4xl font-semibold">
          {PRICING_TIER_BASE_FEE_CEDIS.website_admin} GHS
          <span className="ml-1 text-lg font-medium text-ink-700">/ month</span>
        </p>
        <ul className="mt-8 flex-1 space-y-3">
          {WEBSITE_ADMIN_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-ink-800">
              <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.25} />
              {feature}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onSelect("website_admin")}
          className={cn(
            "mt-8 rounded-full px-6 py-3 text-sm font-medium",
            selected === "website_admin"
              ? "bg-brand text-white"
              : "border border-brand text-brand hover:bg-brand hover:text-white"
          )}
        >
          {selected === "website_admin" ? "Selected" : "Choose Website & Admin"}
        </button>
      </article>

      <article
        className={cn(
          "relative flex flex-col rounded-2xl border p-6 shadow-card",
          selected === "fulfilment" ? "border-brand bg-brand-soft/40 ring-2 ring-brand/20" : "border-brand/40 bg-brand-soft/20"
        )}
      >
        <span className="absolute -top-3 right-6 rounded-full bg-brand px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-white">
          Most complete
        </span>
        <h3 className="font-display text-2xl font-semibold">Fulfilment</h3>
        <p className="mt-2 text-sm text-ink-700">Everything above, plus we pack and send every order.</p>
        <p className="mt-6 font-display text-4xl font-semibold">
          {PRICING_TIER_BASE_FEE_CEDIS.fulfilment} GHS
          <span className="ml-1 text-lg font-medium text-ink-700">/ month</span>
        </p>
        <p className="mt-1 font-mono text-xs font-medium uppercase tracking-wide text-brand">Intro price</p>
        <ul className="mt-8 flex-1 space-y-3">
          {FULFILMENT_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-ink-800">
              <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.25} />
              {feature}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onSelect("fulfilment")}
          className={cn(
            "mt-8 rounded-full px-6 py-3 text-sm font-medium",
            selected === "fulfilment"
              ? "bg-brand text-white"
              : "border border-brand text-brand hover:bg-brand hover:text-white"
          )}
        >
          {selected === "fulfilment" ? "Selected" : "Choose Fulfilment"}
        </button>
      </article>
    </div>
  );
}

function ConfirmStep({
  draft,
  email,
  planLabel,
}: {
  draft: Draft;
  email?: string;
  planLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand/30 bg-brand-soft p-6">
        <p className="text-sm font-medium text-ink-950">
          Your 14-day free trial starts today — no payment needed until it ends.
        </p>
      </div>

      <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold">Review before you go live</h2>
        <dl className="mt-4 divide-y divide-black/6 text-sm">
          {email ? (
            <Row label="Email" value={email} />
          ) : null}
          <Row label="Template" value={templateLabel(draft.template)} />
          <Row label="Business name" value={draft.businessName || "Not set"} />
          <Row label="Product category" value={draft.productCategory || "Not set"} />
          <Row label="Store URL" value={`/store/${draft.template}/${draft.storeSlug}`} />
          <Row label="Domain (placeholder)" value={placeholderDomain(draft.storeSlug)} />
          <Row label="Plan" value={planLabel} />
        </dl>
      </div>

      <div className="rounded-2xl border border-brand/30 bg-brand-soft p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">MoMo number buyers will pay</p>
        <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-ink-950">
          {draft.phone || "Not set"}
        </p>
        <p className="mt-2 text-sm text-ink-700">
          Check this twice. Checkout tells buyers to send Mobile Money here. If it is wrong, they pay
          the wrong person.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-ink-950">{value}</dd>
    </div>
  );
}
