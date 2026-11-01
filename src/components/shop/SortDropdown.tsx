"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sortOptions, type SortId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function SortDropdown({ value, onChange }: { value: SortId; onChange: (v: SortId) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = sortOptions.find((o) => o.id === value)!;

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-10 items-center gap-2 border border-ivory-100/15 px-4 text-xs text-ivory-100 transition hover:border-gold-400/60"
      >
        <span className="text-ivory-100/45 max-sm:hidden">Sort:</span> {current.label}
        <ChevronDown size={13} className={cn("text-gold-400 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="glass absolute right-0 top-full z-30 mt-2 w-56 border border-gold-500/20 py-2 shadow-2xl"
          >
            {sortOptions.map((o) => (
              <li key={o.id}>
                <button
                  role="option"
                  aria-selected={o.id === value}
                  onClick={() => {
                    onChange(o.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-ivory-100/75 transition hover:bg-ivory-100/5 hover:text-ivory-50"
                >
                  {o.label}
                  {o.id === value && <Check size={14} className="text-gold-300" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
