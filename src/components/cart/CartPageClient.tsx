"use client";

import { AnimatePresence } from "motion/react";
import { Lock, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { products } from "@/data/products";
import { useMounted } from "@/hooks/useMounted";
import { useCartSummary } from "@/store/cart";
import { CartLineItem } from "./CartLineItem";
import { CouponField } from "./CouponField";
import { FreeShippingBar } from "./FreeShippingBar";
import { GiftWrapToggle } from "./GiftWrapToggle";
import { OrderSummary } from "./OrderSummary";

export function CartPageClient() {
  const mounted = useMounted();
  const s = useCartSummary();
  const empty = !mounted || s.lines.length === 0;
  const inBag = s.lines.map((l) => l.product.id);
  const suggestions = products.filter((p) => !inBag.includes(p.id) && (p.isNew || p.isBestseller)).slice(0, 4);

  return (
    <>
      <div className="mb-12 mt-8 flex items-end justify-between gap-6">
        <RevealText as="h1" text="Your bag" className="font-display text-6xl font-light leading-none text-ivory-50 md:text-8xl" />
        {!empty && <p className="pb-2 text-sm text-ivory-100/55">{s.count} {s.count === 1 ? "saree" : "sarees"}</p>}
      </div>

      {empty ? (
        <div className="grid place-items-center border border-dashed border-ivory-100/15 px-6 py-24 text-center">
          <p className="font-display text-4xl text-ivory-50">Nothing here yet</p>
          <p className="mt-3 max-w-sm text-sm text-ivory-100/50">Sarees you add will wait for you here, even if you close the page.</p>
          <Button href="/shop" className="mt-8">
            Explore the shop
          </Button>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div>
            <FreeShippingBar remaining={s.toFreeShipping} />
            <ul className="mt-10 space-y-8">
              <AnimatePresence initial={false}>
                {s.lines.map(({ item, product, colorway, lineTotal }) => (
                  <CartLineItem key={item.key} item={item} product={product} colorway={colorway} lineTotal={lineTotal} size="page" />
                ))}
              </AnimatePresence>
            </ul>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-gold-500/15 bg-wine-950 p-6 md:p-8">
              <p className="eyebrow mb-6">Order summary</p>
              <div className="space-y-4">
                <CouponField discount={s.discount} error={s.couponError} />
                <GiftWrapToggle />
              </div>
              <div className="mt-8">
                <OrderSummary totals={s} coupon={s.coupon} />
              </div>
              <Button href="/checkout" size="lg" className="mt-8 w-full">
                <Lock size={13} /> Secure checkout
              </Button>
              <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.2em] text-ivory-100/40">UPI · Cards · Net banking · COD</p>
            </div>
            <ul className="mt-6 space-y-3 text-xs text-ivory-100/55">
              <li className="flex items-center gap-3"><ShieldCheck size={15} className="text-gold-400" /> Silk Mark certified, authenticity guaranteed</li>
              <li className="flex items-center gap-3"><Truck size={15} className="text-gold-400" /> Fully insured delivery in a keepsake box</li>
              <li className="flex items-center gap-3"><RotateCcw size={15} className="text-gold-400" /> 7-day returns on unworn sarees</li>
            </ul>
          </aside>
        </div>
      )}

      <section className="mt-28 border-t border-ivory-100/10 pt-16">
        <p className="eyebrow">You might also love</p>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-5 lg:grid-cols-4">
          {suggestions.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
