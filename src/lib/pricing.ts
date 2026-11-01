/** Pricing rules for the demo: coupons, gift wrap, delivery and payment fees. */

export const FREE_SHIPPING_ABOVE = 5000;
export const STANDARD_SHIPPING = 250;
export const GIFT_WRAP_PRICE = 150;
export const COD_FEE = 50;

export type Coupon = {
  code: string;
  label: string;
  /** Returns the discount for a subtotal, or an error message if it can't be used. */
  apply: (subtotal: number) => { discount: number } | { error: string };
};

export const coupons: Coupon[] = [
  {
    code: "AANCHAL10",
    label: "10% off, up to ₹5,000",
    apply: (s) => ({ discount: Math.min(Math.round(s * 0.1), 5000) }),
  },
  {
    code: "WEAVE500",
    label: "₹500 off orders above ₹10,000",
    apply: (s) => (s >= 10000 ? { discount: 500 } : { error: "Add ₹" + (10000 - s).toLocaleString("en-IN") + " more to use WEAVE500" }),
  },
  {
    code: "FIRSTDRAPE",
    label: "15% off your first order above ₹15,000",
    apply: (s) =>
      s >= 15000 ? { discount: Math.min(Math.round(s * 0.15), 7500) } : { error: "FIRSTDRAPE needs an order above ₹15,000" },
  },
];

export function findCoupon(code: string) {
  return coupons.find((c) => c.code === code.trim().toUpperCase());
}

export const deliveryOptions = [
  { id: "standard", label: "Standard", eta: "4–6 business days", price: 0 },
  { id: "express", label: "Express", eta: "1–2 business days", price: 350 },
] as const;
export type DeliveryId = (typeof deliveryOptions)[number]["id"];

export type PaymentId = "upi" | "card" | "netbanking" | "cod";

export function computeTotals({
  subtotal,
  couponCode,
  giftWrap,
  delivery = "standard",
  payment,
}: {
  subtotal: number;
  couponCode: string | null;
  giftWrap: boolean;
  delivery?: DeliveryId;
  payment?: PaymentId;
}) {
  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  const result = coupon?.apply(subtotal);
  const discount = result && "discount" in result ? result.discount : 0;
  const couponError = result && "error" in result ? result.error : null;
  const afterDiscount = subtotal - discount;

  const freeShipping = afterDiscount >= FREE_SHIPPING_ABOVE || subtotal === 0;
  const baseShipping = freeShipping ? 0 : STANDARD_SHIPPING;
  const expressFee = delivery === "express" ? deliveryOptions[1].price : 0;
  const shipping = subtotal === 0 ? 0 : baseShipping + expressFee;
  const gift = giftWrap && subtotal > 0 ? GIFT_WRAP_PRICE : 0;
  const cod = payment === "cod" ? COD_FEE : 0;

  return {
    subtotal,
    discount,
    couponError,
    shipping,
    gift,
    cod,
    total: afterDiscount + shipping + gift + cod,
    toFreeShipping: Math.max(0, FREE_SHIPPING_ABOVE - afterDiscount),
  };
}
