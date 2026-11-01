"use client";

import { Gift } from "lucide-react";
import { GIFT_WRAP_PRICE } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";

export function GiftWrapToggle() {
  const on = useCart((s) => s.giftWrap);
  const set = useCart((s) => s.setGiftWrap);
  return (
    <button
      onClick={() => set(!on)}
      aria-pressed={on}
      className={cn(
        "flex w-full items-center gap-3 border px-4 py-3 text-left transition",
        on ? "border-gold-400/70 bg-gold-400/5" : "border-ivory-100/15 hover:border-ivory-100/30",
      )}
    >
      <Gift size={16} className={on ? "text-gold-300" : "text-ivory-100/50"} />
      <span className="flex-1">
        <span className="block text-sm text-ivory-50">Gift wrap in a silk potli</span>
        <span className="block text-[0.7rem] text-ivory-100/45">Handwritten note, prices hidden</span>
      </span>
      <span className="text-xs text-gold-300">+{formatPrice(GIFT_WRAP_PRICE)}</span>
    </button>
  );
}
