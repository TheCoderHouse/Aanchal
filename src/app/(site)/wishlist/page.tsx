import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { WishlistClient } from "@/components/wishlist/WishlistClient";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <PageShell>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <WishlistClient />
    </PageShell>
  );
}
