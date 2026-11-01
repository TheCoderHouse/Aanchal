"use client";

import { AnimatePresence, motion } from "motion/react";
import { Gift, Truck, Zap } from "lucide-react";
import { deliveryOptions, type DeliveryId } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";

type Props = {
  value: DeliveryId;
  onChange: (d: DeliveryId) => void;
  etas: Record<DeliveryId, string>;
  freeShipping: boolean;
  giftMessage: string;
  onGiftMessage: (m: string) => void;
  giftWrap: boolean;
};

export function DeliveryStep({ value, onChange, etas, freeShipping, giftMessage, onGiftMessage, giftWrap }: Props) {
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory-50 md:text-4xl">How fast would you like it?</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Delivery speed">
        {deliveryOptions.map((o) => {
          const active = value === o.id;
          const Icon = o.id === "express" ? Zap : Truck;
          return (
            <button
              key={o.id}
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.id)}
              className={cn(
                "relative isolate overflow-hidden border p-6 text-left transition-colors duration-500",
                active ? "border-gold-400 bg-gold-400/5" : "border-ivory-100/15 hover:border-ivory-100/35",
              )}
            >
              {active && (
                <motion.span layoutId="delivery-glow" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(214,179,108,0.15),transparent_60%)]" />
              )}
              <div className="flex items-start justify-between">
                <Icon size={20} strokeWidth={1.4} className={active ? "text-gold-300" : "text-ivory-100/50"} />
                <span className={cn("h-4 w-4 rounded-full border", active ? "border-gold-400 bg-gold-400 ring-2 ring-inset ring-ink" : "border-ivory-100/30")} />
              </div>
              <p className="mt-6 font-display text-2xl text-ivory-50">{o.label}</p>
              <p className="mt-1 text-sm text-ivory-100/55">{o.eta}</p>
              <p className="mt-1 text-xs text-gold-300">Arrives {etas[o.id]}</p>
              <p className="mt-4 text-sm text-ivory-100">
                {o.id === "standard" ? (freeShipping ? "Free" : formatPrice(250)) : `+${formatPrice(o.price)}`}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <p className="eyebrow mb-3 flex items-center gap-2">
          <Gift size={13} /> Add a note {giftWrap ? "(goes in your gift wrap)" : "(optional)"}
        </p>
        <textarea
          value={giftMessage}
          onChange={(e) => onGiftMessage(e.target.value.slice(0, 200))}
          rows={3}
          placeholder="Happy anniversary, Amma. Love, Ananya"
          className="w-full resize-none border border-ivory-100/15 bg-transparent p-4 text-sm text-ivory-50 outline-none placeholder:text-ivory-100/30 focus:border-gold-400"
        />
        <AnimatePresence>
          {giftMessage && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-1 text-right text-[0.65rem] text-ivory-100/40">
              {giftMessage.length}/200
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
