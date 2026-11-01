"use client";

import { motion } from "motion/react";
import type { Colorway } from "@/data/types";
import { cn } from "@/lib/utils";

/** Round swatches showing body + border colour. */
export function ColorSwatch({
  colorways,
  value,
  onChange,
  size = "md",
}: {
  colorways: Colorway[];
  value: string;
  onChange: (name: string) => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-4 w-4" : "h-8 w-8";
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Colour">
      {colorways.map((cw) => {
        const active = cw.name === value;
        return (
          <button
            key={cw.name}
            role="radio"
            aria-checked={active}
            aria-label={cw.name}
            title={cw.name}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(cw.name);
            }}
            className={cn("relative rounded-full p-0.5", size === "sm" ? "p-[3px]" : "p-1")}
          >
            {active && (
              <motion.span
                layoutId={size === "sm" ? undefined : "swatch-ring"}
                className="absolute inset-0 rounded-full border border-gold-300"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={cn("block rounded-full ring-1 ring-ivory-100/20", dim)}
              style={{ background: `linear-gradient(135deg, ${cw.base} 55%, ${cw.border} 55%)` }}
            />
          </button>
        );
      })}
    </div>
  );
}
