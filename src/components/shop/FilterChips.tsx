"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { collections, colorFamilies, PRICE_MAX, PRICE_MIN, type Filters } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

type Chip = { key: string; label: string; remove: () => void };

export function FilterChips({
  filters,
  update,
  toggle,
  onClear,
  hideCollection,
}: {
  filters: Filters;
  update: (patch: Partial<Filters>) => void;
  toggle: (key: "fabric" | "occasion" | "collection" | "color", value: string) => void;
  onClear: () => void;
  hideCollection?: boolean;
}) {
  const chips: Chip[] = [
    ...(filters.q ? [{ key: "q", label: `Search: ${filters.q}`, remove: () => update({ q: "" }) }] : []),
    ...(hideCollection
      ? []
      : filters.collection.map((v) => ({
          key: `c-${v}`,
          label: collections.find((c) => c.slug === v)?.name ?? v,
          remove: () => toggle("collection", v),
        }))),
    ...filters.occasion.map((v) => ({ key: `o-${v}`, label: v, remove: () => toggle("occasion", v) })),
    ...filters.fabric.map((v) => ({ key: `f-${v}`, label: v, remove: () => toggle("fabric", v) })),
    ...filters.color.map((v) => ({
      key: `col-${v}`,
      label: colorFamilies.find((c) => c.id === v)?.label ?? v,
      remove: () => toggle("color", v),
    })),
    ...(filters.handloom ? [{ key: "h", label: "Handloom", remove: () => update({ handloom: false }) }] : []),
    ...(filters.min > PRICE_MIN || filters.max < PRICE_MAX
      ? [
          {
            key: "price",
            label: `${formatPrice(filters.min)} – ${formatPrice(filters.max)}`,
            remove: () => update({ min: PRICE_MIN, max: PRICE_MAX }),
          },
        ]
      : []),
  ];

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence mode="popLayout">
        {chips.map((chip) => (
          <motion.button
            key={chip.key}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={chip.remove}
            className="flex items-center gap-2 border border-gold-500/30 bg-gold-400/5 px-3 py-1.5 text-xs text-ivory-100 transition hover:border-gold-300"
          >
            {chip.label}
            <X size={12} className="text-gold-300" />
          </motion.button>
        ))}
      </AnimatePresence>
      <button onClick={onClear} className="ml-1 text-xs text-ivory-100/50 underline underline-offset-4 hover:text-gold-300">
        Clear all
      </button>
    </div>
  );
}
