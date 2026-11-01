"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "@/data/products";
import { computeTotals } from "@/lib/pricing";

export type CartItem = {
  key: string; // productId + colourway
  productId: string;
  colorway: string;
  qty: number;
  fallPico?: boolean;
};

type CartState = {
  items: CartItem[];
  giftWrap: boolean;
  coupon: string | null;
  setGiftWrap: (on: boolean) => void;
  setCoupon: (code: string | null) => void;
  toggleFallPico: (key: string) => void;
  add: (productId: string, colorway: string, opts?: { fallPico?: boolean }) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

export const FALL_PICO_PRICE = 350;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      giftWrap: false,
      coupon: null,
      setGiftWrap: (giftWrap) => set({ giftWrap }),
      setCoupon: (coupon) => set({ coupon }),
      toggleFallPico: (key) =>
        set((s) => ({ items: s.items.map((i) => (i.key === key ? { ...i, fallPico: !i.fallPico } : i)) })),
      add: (productId, colorway, opts) =>
        set((s) => {
          const key = `${productId}:${colorway}`;
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === key ? { ...i, qty: Math.min(i.qty + 1, 5) } : i,
              ),
            };
          }
          return {
            items: [...s.items, { key, productId, colorway, qty: 1, fallPico: opts?.fallPico }],
          };
        }),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      setQty: (key, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, 5)) } : i,
          ),
        })),
      clear: () => set({ items: [], coupon: null, giftWrap: false }),
    }),
    { name: "aanchal-cart" },
  ),
);

/** Items joined with product data, plus totals (coupon and gift wrap included). */
export function useCartSummary() {
  const items = useCart((s) => s.items);
  const coupon = useCart((s) => s.coupon);
  const giftWrap = useCart((s) => s.giftWrap);
  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const colorway = product.colorways.find((c) => c.name === item.colorway) ?? product.colorways[0];
      const unit = product.price + (item.fallPico ? FALL_PICO_PRICE : 0);
      return { item, product, colorway, unit, lineTotal: unit * item.qty };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const totals = computeTotals({ subtotal, couponCode: coupon, giftWrap });
  return { lines, count, coupon, giftWrap, ...totals };
}
