import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { GridSkeleton } from "@/components/shop/GridSkeleton";
import { ShopClient } from "@/components/shop/ShopClient";
import { RevealText } from "@/components/ui/RevealText";

export const metadata: Metadata = {
  title: "Shop all sarees",
  description: "Browse handwoven Banarasi, Kanjeevaram, Paithani, Chanderi, organza and cotton sarees.",
};

export default function ShopPage() {
  return (
    <PageShell>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <div className="mb-14 mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <RevealText
          as="h1"
          text="The saree shop"
          className="font-display text-6xl font-light leading-none text-ivory-50 md:text-8xl"
        />
        <p className="max-w-sm text-sm leading-relaxed text-ivory-100/55">
          Every piece is handpicked from weaver families across India. Filter by occasion, fabric or colour to find
          yours.
        </p>
      </div>
      {/* Filters are read from the URL, which is only known in the browser */}
      <Suspense fallback={<GridSkeleton />}>
        <ShopClient />
      </Suspense>
    </PageShell>
  );
}
