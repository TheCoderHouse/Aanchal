"use client";

import { motion } from "motion/react";

export type CardData = { number: string; name: string; expiry: string; cvv: string };

export function cardBrand(num: string) {
  if (/^4/.test(num)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(num)) return "MASTERCARD";
  if (/^(60|65|81|82)/.test(num)) return "RUPAY";
  if (/^3[47]/.test(num)) return "AMEX";
  return "";
}

/** A 3D card that mirrors what you type and flips over when the CVV field is focused. */
export function CardPreview({ card, flipped }: { card: CardData; flipped: boolean }) {
  const digits = card.number.replace(/\D/g, "").padEnd(16, "•");
  const groups = digits.match(/.{1,4}/g)!.slice(0, 4);
  const brand = cardBrand(card.number.replace(/\D/g, ""));

  return (
    <div className="mx-auto w-full max-w-[340px]" style={{ perspective: 1200 }}>
      <motion.div
        className="relative aspect-[1.586] w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-gold-400/30 p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
          style={{
            backfaceVisibility: "hidden",
            background:
              "radial-gradient(circle at 85% 15%, rgba(230,207,150,0.35), transparent 45%), linear-gradient(135deg, #5a1830 0%, #220c16 60%, #160910 100%)",
          }}
        >
          {/* Faint buta pattern */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden>
            <defs>
              <pattern id="card-buta" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M14 6c2.4 2.4 2.4 6 0 8-2.4-2-2.4-5.6 0-8Z" fill="#e6cf96" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#card-buta)" />
          </svg>
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="font-display text-xl tracking-[0.25em] text-gold-200">AANCHAL</span>
              <span className="text-xs font-semibold tracking-widest text-ivory-50/90">{brand}</span>
            </div>
            {/* Chip */}
            <span className="h-8 w-11 rounded-md bg-gradient-to-br from-gold-200 via-gold-400 to-gold-600 shadow-inner" />
            <p className="flex justify-between font-mono text-lg tracking-[0.12em] text-ivory-50 sm:text-xl">
              {groups.map((g, i) => (
                <span key={i}>{g}</span>
              ))}
            </p>
            <div className="flex items-end justify-between text-[0.6rem] uppercase tracking-[0.2em] text-ivory-100/60">
              <span>
                Card holder
                <span className="mt-1 block truncate text-xs tracking-[0.15em] text-ivory-50">{card.name || "YOUR NAME"}</span>
              </span>
              <span className="text-right">
                Expires
                <span className="mt-1 block text-xs tracking-[0.15em] text-ivory-50">{card.expiry || "MM/YY"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-gold-400/30 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #3a1222, #160910)",
          }}
        >
          <div className="mt-6 h-11 bg-ink" />
          <div className="mx-6 mt-5 flex items-center justify-end gap-3">
            <span className="h-8 flex-1 bg-[repeating-linear-gradient(90deg,#f7f0e3_0_6px,#ece0c9_6px_12px)] opacity-80" />
            <span className="grid h-8 w-14 place-items-center bg-ivory-100 font-mono text-sm text-ink">
              {card.cvv.padEnd(3, "•")}
            </span>
          </div>
          <p className="mx-6 mt-4 text-[0.55rem] leading-relaxed text-ivory-100/40">
            This is a demo. No real card details are sent or stored.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
