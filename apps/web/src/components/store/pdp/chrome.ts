export type PdpChrome = {
  accent: string;
  ink: string;
  sectionClass: string;
  titleClass: string;
  questionClass: string;
  mutedClass: string;
  strongClass: string;
  bodyClass: string;
  dividerClass: string;
  addButtonClass: string;
  formClass: string;
  fieldClass: string;
  textareaClass: string;
  submitClass: string;
  errorClass: string;
  successClass: string;
  filterClass: string;
  barTrackClass: string;
  barFillClass: string;
  iconClass: string;
  verifiedClass: string;
};

export const STYLECO_CHROME: PdpChrome = {
  accent: "#FF7A1A",
  ink: "#111111",
  sectionClass: "mt-16 scroll-mt-28 border-t border-black/8 pt-12",
  titleClass: "text-[32px] font-extrabold leading-[1.15] tracking-tight text-black md:text-[36px]",
  questionClass: "text-[17px] font-semibold leading-snug text-black",
  mutedClass: "text-sm text-black/45",
  strongClass: "font-semibold text-black",
  bodyClass: "text-[15px] leading-relaxed text-black/55",
  dividerClass: "border-black/10",
  addButtonClass:
    "h-10 rounded-full border border-black/15 px-4 text-sm font-semibold text-black hover:bg-[#F7F7F7]",
  formClass: "mt-6 rounded-2xl border border-black/8 bg-[#FAFAFA] p-5",
  fieldClass:
    "mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-[#F7F7F7] px-4 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/30",
  textareaClass:
    "mt-1.5 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/30",
  submitClass:
    "mt-5 flex h-11 w-full items-center justify-center rounded-full bg-black text-sm font-semibold text-white disabled:opacity-60",
  errorClass: "mt-4 text-sm font-medium text-red-600",
  successClass: "mt-4 text-sm font-medium text-emerald-700",
  filterClass:
    "h-10 min-w-0 rounded-full border border-black/12 bg-white px-4 text-sm text-black outline-none",
  barTrackClass: "h-[5px] overflow-hidden rounded-full bg-black/8",
  barFillClass: "h-full rounded-full bg-[#111111]",
  iconClass: "h-[18px] w-[18px] shrink-0 text-black/50",
  verifiedClass: "text-[#2F6B3A]",
};

export const MARKET_CHROME: PdpChrome = {
  accent: "#1447E6",
  ink: "#0B1220",
  sectionClass: "mt-12 scroll-mt-28 border-t-2 border-[#0B1220] pt-8",
  titleClass:
    "font-[family-name:var(--font-market)] text-2xl font-extrabold uppercase leading-tight text-[#0B1220]",
  questionClass:
    "font-[family-name:var(--font-market)] text-base font-extrabold uppercase leading-snug text-[#0B1220]",
  mutedClass: "text-sm text-[#0B1220]/50",
  strongClass: "font-extrabold text-[#0B1220]",
  bodyClass: "text-[15px] leading-relaxed text-[#0B1220]/70",
  dividerClass: "border-[#0B1220]/20",
  addButtonClass:
    "border-2 border-[#0B1220] bg-white px-3 py-2 text-xs font-extrabold uppercase hover:bg-[#0B1220]/5",
  formClass: "mt-5 border-2 border-[#0B1220] bg-[#FFE8A3]/40 p-4",
  fieldClass:
    "mt-1.5 h-11 w-full border-2 border-[#0B1220] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#1447E6]",
  textareaClass:
    "mt-1.5 w-full resize-y border-2 border-[#0B1220] bg-white px-3 py-3 text-sm text-[#0B1220] outline-none focus:border-[#1447E6]",
  submitClass:
    "mt-5 flex h-11 w-full items-center justify-center bg-[#1447E6] text-sm font-extrabold uppercase text-white disabled:opacity-60",
  errorClass: "mt-4 text-sm font-medium text-red-700",
  successClass: "mt-4 text-sm font-medium text-emerald-800",
  filterClass:
    "h-10 min-w-0 border-2 border-[#0B1220] bg-white px-3 text-sm font-semibold text-[#0B1220] outline-none",
  barTrackClass: "h-[6px] overflow-hidden bg-[#0B1220]/10",
  barFillClass: "h-full bg-[#0B1220]",
  iconClass: "h-[18px] w-[18px] shrink-0 text-[#0B1220]",
  verifiedClass: "text-[#1447E6]",
};

export const HOMEDINE_CHROME: PdpChrome = {
  accent: "#2B4239",
  ink: "#2B4239",
  sectionClass: "mt-16 scroll-mt-28 border-t border-[#2B4239]/12 pt-12",
  titleClass:
    "text-[34px] font-medium leading-[1.15] text-[#2B4239] [font-family:var(--font-homedine-serif),ui-serif,Georgia] md:text-[40px]",
  questionClass:
    "text-[20px] font-medium leading-snug text-[#2B4239] [font-family:var(--font-homedine-serif),ui-serif,Georgia]",
  mutedClass: "text-sm text-[#2B4239]/50",
  strongClass: "font-semibold text-[#2B4239]",
  bodyClass: "text-[15px] leading-relaxed text-[#2B4239]/60",
  dividerClass: "border-[#2B4239]/12",
  addButtonClass:
    "h-10 rounded-full border border-[#2B4239]/20 px-4 text-sm font-medium text-[#2B4239] hover:bg-[#F5F1E4]",
  formClass: "mt-6 rounded-2xl border border-[#2B4239]/15 bg-[#F5F1E4] p-5",
  fieldClass:
    "mt-1.5 h-11 w-full rounded-full border border-[#2B4239]/15 bg-white px-4 text-sm text-[#2B4239] outline-none focus:border-[#2B4239]/40",
  textareaClass:
    "mt-1.5 w-full resize-y rounded-2xl border border-[#2B4239]/15 bg-white px-4 py-3 text-sm text-[#2B4239] outline-none focus:border-[#2B4239]/40",
  submitClass:
    "mt-5 flex h-11 w-full items-center justify-center rounded-full bg-[#2B4239] text-sm font-medium text-[#F5F1E4] disabled:opacity-60",
  errorClass: "mt-4 text-sm font-medium text-red-700",
  successClass: "mt-4 text-sm font-medium text-emerald-800",
  filterClass:
    "h-10 min-w-0 rounded-full border border-[#2B4239]/15 bg-white px-4 text-sm text-[#2B4239] outline-none",
  barTrackClass: "h-[5px] overflow-hidden rounded-full bg-[#2B4239]/10",
  barFillClass: "h-full rounded-full bg-[#2B4239]",
  iconClass: "h-[18px] w-[18px] shrink-0 text-[#2B4239]/45",
  verifiedClass: "text-[#3D6B4F]",
};

export const STYLEHIVE_CHROME: PdpChrome = {
  accent: "#111111",
  ink: "#111111",
  sectionClass: "mt-16 scroll-mt-28 border-t border-black/8 pt-12",
  titleClass:
    "text-[32px] font-extrabold leading-[1.1] tracking-tight text-black [font-family:var(--font-stylehive-display),ui-sans-serif,system-ui] md:text-[36px]",
  questionClass:
    "text-[18px] font-extrabold leading-snug text-black [font-family:var(--font-stylehive-display),ui-sans-serif,system-ui]",
  mutedClass: "text-sm text-black/45",
  strongClass: "font-semibold text-black",
  bodyClass: "text-[15px] leading-relaxed text-black/55",
  dividerClass: "border-black/10",
  addButtonClass:
    "h-10 rounded-full bg-[#F5F5F3] px-4 text-sm font-semibold text-black hover:bg-[#EFEFEF]",
  formClass: "mt-6 rounded-[24px] bg-[#F5F5F3] p-5",
  fieldClass:
    "mt-1.5 h-11 w-full rounded-full border border-black/10 bg-white px-4 text-sm text-black outline-none focus:border-black/30",
  textareaClass:
    "mt-1.5 w-full resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/30",
  submitClass:
    "mt-5 flex h-11 w-full items-center justify-center rounded-full bg-black text-sm font-semibold text-white disabled:opacity-60",
  errorClass: "mt-4 text-sm font-medium text-red-600",
  successClass: "mt-4 text-sm font-medium text-emerald-700",
  filterClass:
    "h-10 min-w-0 rounded-full border border-black/10 bg-white px-4 text-sm text-black outline-none",
  barTrackClass: "h-[5px] overflow-hidden rounded-full bg-black/8",
  barFillClass: "h-full rounded-full bg-black",
  iconClass: "h-[18px] w-[18px] shrink-0 text-black/40",
  verifiedClass: "text-[#2F6B3A]",
};

export const RIDE_CHROME: PdpChrome = {
  accent: "#E8622C",
  ink: "#141414",
  sectionClass: "mt-16 scroll-mt-28 border-t border-[#D9D6CE] pt-12",
  titleClass:
    "text-[32px] font-extrabold leading-[1.1] tracking-tight text-[#141414] [font-family:var(--font-ride-display),ui-sans-serif,system-ui] md:text-[40px]",
  questionClass:
    "text-[18px] font-extrabold leading-snug text-[#141414] [font-family:var(--font-ride-display),ui-sans-serif,system-ui]",
  mutedClass: "text-sm text-[#141414]/50",
  strongClass: "font-semibold text-[#141414]",
  bodyClass: "text-[15px] leading-relaxed text-[#141414]/60",
  dividerClass: "border-[#D9D6CE]",
  addButtonClass:
    "h-10 rounded-lg border border-[#141414] px-4 text-sm font-semibold text-[#141414] hover:bg-[#141414] hover:text-white",
  formClass: "mt-6 rounded-[24px] border border-[#D9D6CE] bg-[#FFFDFA] p-5",
  fieldClass:
    "mt-1.5 h-11 w-full rounded-lg border border-[#D9D6CE] bg-[#FFFDFA] px-4 text-sm text-[#141414] outline-none focus:border-[#141414]",
  textareaClass:
    "mt-1.5 w-full resize-y rounded-lg border border-[#D9D6CE] bg-[#FFFDFA] px-4 py-3 text-sm text-[#141414] outline-none focus:border-[#141414]",
  submitClass:
    "mt-5 flex h-11 w-full items-center justify-center rounded-lg bg-[#E8622C] text-sm font-semibold text-white disabled:opacity-60",
  errorClass: "mt-4 text-sm font-medium text-red-600",
  successClass: "mt-4 text-sm font-medium text-emerald-700",
  filterClass:
    "h-10 min-w-0 rounded-lg border border-[#D9D6CE] bg-[#FFFDFA] px-4 text-sm text-[#141414] outline-none",
  barTrackClass: "h-[5px] overflow-hidden rounded-full bg-[#141414]/8",
  barFillClass: "h-full rounded-full bg-[#141414]",
  iconClass: "h-[18px] w-[18px] shrink-0 text-[#141414]/45",
  verifiedClass: "text-[#2F6B3A]",
};
