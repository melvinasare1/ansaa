"use client";

import type { CSSProperties, ReactNode } from "react";
import { isLightSwatch, swatchHex } from "@/lib/swatch";

export function PdpVariantSelectors({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSelectSize,
  onSelectColor,
  sizeLabel,
  colorLabel,
  labelClassName,
  sizeSectionClassName,
  colorSectionClassName,
  sizeOuterClassName,
  sizeRowClassName,
  sizeButtonClassName,
  sizeButtonStyle,
  sizeExtra,
  colorMode,
  colorWrapClassName,
  colorChipClassName,
  swatchButtonClassName = "flex h-8 w-8 items-center justify-center rounded-full",
  swatchDotClassName = "h-6 w-6 rounded-full",
  swatchSelectedRing,
  swatchLightBorder = false,
}: {
  sizes: string[];
  colors: string[];
  selectedSize: string;
  selectedColor: string;
  onSelectSize: (size: string) => void;
  onSelectColor: (color: string) => void;
  sizeLabel: string;
  colorLabel: string;
  labelClassName: string;
  sizeSectionClassName: string;
  colorSectionClassName: string;
  sizeOuterClassName?: string;
  sizeRowClassName?: string;
  sizeButtonClassName: (selected: boolean) => string;
  sizeButtonStyle?: (selected: boolean) => CSSProperties | undefined;
  sizeExtra?: ReactNode;
  colorMode: "swatch" | "chip";
  colorWrapClassName?: string;
  colorChipClassName?: (selected: boolean) => string;
  swatchButtonClassName?: string;
  swatchDotClassName?: string;
  swatchSelectedRing?: string;
  swatchLightBorder?: boolean;
}) {
  return (
    <>
      {sizes.length > 0 ? (
        <div className={sizeSectionClassName}>
          <p className={labelClassName}>{sizeLabel}</p>
          <div className={sizeOuterClassName ?? sizeRowClassName ?? "mt-3 flex flex-wrap gap-2"}>
            <div className={sizeOuterClassName ? sizeRowClassName ?? "flex min-w-0 flex-1 flex-wrap gap-2" : "contents"}>
              {sizes.map((size) => {
                const selected = size === selectedSize;
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelectSize(size)}
                    className={sizeButtonClassName(selected)}
                    style={sizeButtonStyle?.(selected)}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {sizeExtra}
          </div>
        </div>
      ) : null}

      {colors.length > 0 ? (
        <div className={colorSectionClassName}>
          <p className={labelClassName}>{colorLabel}</p>
          <div className={colorWrapClassName ?? "mt-3 flex flex-wrap gap-2"}>
            {colors.map((color) => {
              const selected = color === selectedColor;
              if (colorMode === "chip") {
                return (
                  <button
                    key={color}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelectColor(color)}
                    className={colorChipClassName?.(selected)}
                  >
                    {color}
                  </button>
                );
              }

              const hex = swatchHex(color);
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  aria-pressed={selected}
                  onClick={() => onSelectColor(color)}
                  className={swatchButtonClassName}
                  style={selected && swatchSelectedRing ? { boxShadow: swatchSelectedRing } : undefined}
                >
                  <span
                    className={swatchDotClassName}
                    style={{
                      backgroundColor: hex,
                      boxShadow:
                        swatchLightBorder && isLightSwatch(hex)
                          ? "inset 0 0 0 1px rgba(0,0,0,0.08)"
                          : undefined,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
