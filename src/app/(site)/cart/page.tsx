import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { CartPageClient } from "@/components/cart/CartPageClient";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";

export const metadata: Metadata = { title: "Your bag" };

export default function CartPage() {
  return (
    <PageShell>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Bag" }]} />
      <CartPageClient />
    </PageShell>
  );
}
