import type { Metadata } from "next";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { OrderSuccessClient } from "@/components/checkout/OrderSuccessClient";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default function OrderSuccessPage() {
  return (
    <>
      <CheckoutHeader backHref="/shop" backLabel="Continue shopping" />
      <main className="min-h-[80dvh]">
        <OrderSuccessClient />
      </main>
    </>
  );
}
