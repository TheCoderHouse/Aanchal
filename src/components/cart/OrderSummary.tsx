"use client";

import { AnimatePresence, motion } from "motion/react";
import { formatPrice } from "@/lib/utils";

type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  gift: number;
  cod?: number;
  total: number;
};

/** Price breakdown used in the bag drawer, bag page, checkout and success page. */
export function OrderSummary({ totals, coupon, shippingLabel }: { totals: Totals; coupon?: string | null; shippingLabel?: string }) {
  return (
    <dl className="space-y-2.5 text-sm">
      <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
      <AnimatePresence initial={false}>
        {totals.discount > 0 && (
          <Animated key="discount">
            <Row label={`Discount${coupon ? ` (${coupon})` : ""}`} value={`−${formatPrice(totals.discount)}`} accent />
          </Animated>
        )}
        {totals.gift > 0 && (
          <Animated key="gift">
            <Row label="Gift wrap" value={formatPrice(totals.gift)} />
          </Animated>
        )}
        {!!totals.cod && (
          <Animated key="cod">
            <Row label="Cash on delivery fee" value={formatPrice(totals.cod)} />
          </Animated>
        )}
      </AnimatePresence>
      <Row label={shippingLabel ?? "Shipping"} value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)} />
      <div className="flex items-baseline justify-between border-t border-ivory-100/10 pt-4">
        <dt className="font-display text-2xl text-ivory-50">Total</dt>
        <motion.dd key={totals.total} initial={{ opacity: 0.3, y: -4 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl text-ivory-50">
          {formatPrice(totals.total)}
        </motion.dd>
      </div>
      <p className="text-right text-[0.65rem] text-ivory-100/40">Inclusive of all taxes</p>
    </dl>
  );
}

function Animated({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
      {children}
    </motion.div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ivory-100/60">{label}</dt>
      <dd className={accent ? "text-gold-300" : "text-ivory-100"}>{value}</dd>
    </div>
  );
}
