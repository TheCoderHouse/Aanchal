"use client";

import { motion } from "motion/react";
import { Truck } from "lucide-react";
import { FREE_SHIPPING_ABOVE } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

/** Gold thread that fills up as the bag approaches free shipping. */
export function FreeShippingBar({ remaining }: { remaining: number }) {
  const progress = Math.min(1, 1 - remaining / FREE_SHIPPING_ABOVE);
  const done = remaining <= 0;

  return (
    <div>
      <p className="flex items-center gap-2 text-xs text-ivory-100/70">
        <Truck size={14} className="text-gold-400" />
        {done ? (
          <span>
            You&apos;ve unlocked <span className="text-gold-300">free insured shipping</span>
          </span>
        ) : (
          <span>
            Add <span className="text-gold-300">{formatPrice(remaining)}</span> more for free shipping
          </span>
        )}
      </p>
      <div className="relative mt-3 h-px bg-ivory-100/10">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-600 to-gold-300"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Diamond rides the end of the thread */}
        <motion.span
          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold-300 bg-ink"
          initial={false}
          animate={{ left: `${progress * 100}%`, backgroundColor: done ? "#e6cf96" : "#0d0608" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
