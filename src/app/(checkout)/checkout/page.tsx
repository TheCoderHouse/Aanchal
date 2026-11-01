import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <CheckoutHeader />
      <main className="mx-auto min-h-[80dvh] max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <CheckoutClient />
      </main>
    </>
  );
}
