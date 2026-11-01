"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  collections,
  colorFamilies,
  fabrics,
  occasions,
  optionCount,
  PRICE_MAX,
  PRICE_MIN,
  type Filters,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { PriceRangeSlider } from "./PriceRangeSlider";

type Props = {
  filters: Filters;
  toggle: (key: "fabric" | "occasion" | "collection" | "color", value: string) => void;
  update: (patch: Partial<Filters>) => void;
  hideCollection?: boolean;
};

export function FilterSidebar({ filters, toggle, update, hideCollection }: Props) {
  return (
    <div className="divide-y divide-ivory-100/10 border-y border-ivory-100/10">
      {!hideCollection && (
        <Group title="Collection" count={filters.collection.length}>
          {collections.map((c) => (
            <CheckRow
              key={c.slug}
              label={c.name}
              count={optionCount("collection", c.slug)}
              checked={filters.collection.includes(c.slug)}
              onChange={() => toggle("collection", c.slug)}
            />
          ))}
        </Group>
      )}
      <Group title="Occasion" count={filters.occasion.length}>
        {occasions.map((o) => (
          <CheckRow
            key={o}
            label={o}
            count={optionCount("occasion", o)}
            checked={filters.occasion.includes(o)}
            onChange={() => toggle("occasion", o)}
          />
        ))}
      </Group>
      <Group title="Fabric" count={filters.fabric.length}>
        {fabrics.map((f) => (
          <CheckRow
            key={f}
            label={f}
            count={optionCount("fabric", f)}
            checked={filters.fabric.includes(f)}
            onChange={() => toggle("fabric", f)}
          />
        ))}
      </Group>
      <Group title="Colour" count={filters.color.length}>
        <div className="grid grid-cols-4 gap-3 pt-1">
          {colorFamilies.map((c) => {
            const on = filters.color.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle("color", c.id)}
                aria-pressed={on}
                title={c.label}
                className="group flex flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full ring-1 ring-offset-2 ring-offset-wine-950 transition",
                    on ? "ring-gold-300" : "ring-ivory-100/15 group-hover:ring-ivory-100/40",
                  )}
                  style={{ background: c.swatch }}
                >
                  {on && <Check size={12} className="text-ivory-50 mix-blend-difference" strokeWidth={3} />}
                </span>
                <span className="text-center text-[0.6rem] leading-tight text-ivory-100/55">{c.label}</span>
              </button>
            );
          })}
        </div>
      </Group>
      <Group title="Price" count={filters.min > PRICE_MIN || filters.max < PRICE_MAX ? 1 : 0}>
        <PriceRangeSlider
          key={`${filters.min}-${filters.max}`}
          min={PRICE_MIN}
          max={PRICE_MAX}
          valueMin={filters.min}
          valueMax={filters.max}
          onCommit={(min, max) => update({ min, max })}
        />
      </Group>
      <div className="flex items-center justify-between py-5">
        <span className="text-xs uppercase tracking-[0.2em] text-ivory-100">Handloom only</span>
        <button
          role="switch"
          aria-checked={filters.handloom}
          aria-label="Handloom only"
          onClick={() => update({ handloom: !filters.handloom })}
          className={cn(
            "relative h-6 w-11 rounded-full border transition-colors duration-300",
            filters.handloom ? "border-gold-400 bg-gold-400/20" : "border-ivory-100/20",
          )}
        >
          <motion.span
            className={cn("absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full", filters.handloom ? "bg-gold-300" : "bg-ivory-100/40")}
            animate={{ left: filters.handloom ? 22 : 3 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
    </div>
  );
}

function Group({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ivory-100">
          {title}
          {count > 0 && (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[0.55rem] font-bold text-ink">
              {count}
            </span>
          )}
        </span>
        <ChevronDown size={14} className={cn("text-gold-400 transition-transform duration-500", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-1 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        className={cn(
          "grid h-4 w-4 place-items-center border transition-colors peer-focus-visible:ring-1 peer-focus-visible:ring-gold-400",
          checked ? "border-gold-400 bg-gold-400 text-ink" : "border-ivory-100/30 group-hover:border-ivory-100/60",
        )}
      >
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
      <span className={cn("flex-1 text-sm transition-colors", checked ? "text-ivory-50" : "text-ivory-100/65 group-hover:text-ivory-100")}>
        {label}
      </span>
      <span className="text-[0.65rem] text-ivory-100/35">{count}</span>
    </label>
  );
}
