"use client";

import { AnimatePresence, motion } from "motion/react";
import { Tag, X } from "lucide-react";
import { useState } from "react";
import { coupons, findCoupon } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";

export function CouponField({ discount, error }: { discount: number; error: string | null }) {
  const applied = useCart((s) => s.coupon);
  const setCoupon = useCart((s) => s.setCoupon);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [showCodes, setShowCodes] = useState(false);

  const apply = (value: string) => {
    const c = findCoupon(value);
    if (!c) {
      setMessage("That code doesn't exist. Try one below.");
      return;
    }
    setCoupon(c.code);
    setCode("");
    setMessage(null);
  };

  if (applied) {
    return (
      <div className="flex items-center justify-between border border-dashed border-gold-500/50 bg-gold-400/5 px-4 py-3">
        <span className="flex items-center gap-2 text-sm">
          <Tag size={14} className="text-gold-300" />
          <span className="font-medium tracking-wider text-gold-200">{applied}</span>
          {discount > 0 ? (
            <span className="text-xs text-ivory-100/55">−{formatPrice(discount)}</span>
          ) : (
            <span className="text-xs text-wine-500">{error}</span>
          )}
        </span>
        <button onClick={() => setCoupon(null)} aria-label="Remove coupon" className="text-ivory-100/50 hover:text-gold-300">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <form
        className="flex border-b border-ivory-100/20 focus-within:border-gold-400"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) apply(code);
        }}
      >
        <label htmlFor="coupon" className="sr-only">
          Coupon code
        </label>
        <input
          id="coupon"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          className="flex-1 bg-transparent py-2.5 text-sm uppercase tracking-wider text-ivory-50 outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-ivory-100/35"
        />
        <button type="submit" className="text-xs uppercase tracking-[0.2em] text-gold-300 hover:text-gold-200">
          Apply
        </button>
      </form>
      {message && <p className="mt-2 text-xs text-wine-500">{message}</p>}
      <button onClick={() => setShowCodes(!showCodes)} className="mt-3 text-xs text-ivory-100/45 underline underline-offset-4 hover:text-gold-300">
        {showCodes ? "Hide offers" : "View available offers"}
      </button>
      <AnimatePresence>
        {showCodes && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            {coupons.map((c) => (
              <li key={c.code}>
                <button
                  onClick={() => apply(c.code)}
                  className="flex w-full items-center justify-between border border-dashed border-ivory-100/20 px-3 py-2 text-left transition hover:border-gold-400"
                >
                  <span>
                    <span className="block text-xs font-medium tracking-wider text-gold-200">{c.code}</span>
                    <span className="block text-[0.7rem] text-ivory-100/50">{c.label}</span>
                  </span>
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-300">Apply</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
