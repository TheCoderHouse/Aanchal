"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DeliveryId, PaymentId } from "@/lib/pricing";

export type OrderLine = {
  productId: string;
  slug: string;
  name: string;
  colorway: string;
  qty: number;
  unit: number;
  fallPico?: boolean;
};

export type Address = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

export type Order = {
  id: string;
  placedAt: string; // ISO date
  eta: string; // readable date range
  lines: OrderLine[];
  address: Address;
  delivery: DeliveryId;
  payment: PaymentId;
  giftMessage?: string;
  totals: { subtotal: number; discount: number; shipping: number; gift: number; cod: number; total: number };
  coupon: string | null;
};

type OrderState = {
  lastOrder: Order | null;
  orders: Order[];
  place: (order: Order) => void;
};

/** Saved in the browser so the success page (and later, Account > Orders) can show it. */
export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      lastOrder: null,
      orders: [],
      place: (order) => set((s) => ({ lastOrder: order, orders: [order, ...s.orders].slice(0, 20) })),
    }),
    { name: "aanchal-orders" },
  ),
);
