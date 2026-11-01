"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const steps = ["Address", "Delivery", "Payment"] as const;

/** Three steps joined by a gold thread that fills as you progress. Finished steps can be clicked to go back. */
export function CheckoutStepper({ current, onStep }: { current: number; onStep: (i: number) => void }) {
  // The track runs between the first and last circle centres (1rem in from each side)
  const progress = current / (steps.length - 1);
  return (
    <ol className="relative flex justify-between">
      <span className="absolute left-4 right-4 top-4 h-px bg-ivory-100/10" aria-hidden />
      <motion.span
        aria-hidden
        className="absolute left-4 top-4 h-px bg-gold-400"
        initial={false}
        animate={{ width: `calc(${progress * 100}% - ${progress * 2}rem)` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="relative z-10 flex flex-col items-center gap-2">
            <button
              onClick={() => done && onStep(i)}
              disabled={!done}
              aria-current={active ? "step" : undefined}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full border text-xs transition-colors duration-500",
                done && "border-gold-400 bg-gold-400 text-ink hover:bg-gold-300",
                active && "border-gold-400 bg-ink text-gold-300",
                !done && !active && "border-ivory-100/20 bg-ink text-ivory-100/40",
              )}
            >
              {done ? <Check size={14} strokeWidth={3} /> : i + 1}
            </button>
            <span className={cn("text-[0.6rem] uppercase tracking-[0.25em]", active || done ? "text-ivory-100" : "text-ivory-100/40")}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
