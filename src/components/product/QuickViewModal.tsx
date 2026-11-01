"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { getProduct } from "@/data/products";
import type { Product } from "@/data/types";
import { useUI } from "@/store/ui";
import { ProductInfo } from "./ProductInfo";
import { ProductImage } from "./ProductImage";

/** Global Quick view, opened from product cards via useUI().setQuickView(slug). */
export function QuickViewModal() {
  const slug = useUI((s) => s.quickViewSlug);
  const setQuickView = useUI((s) => s.setQuickView);
  const product = slug ? getProduct(slug) : undefined;

  return (
    <Modal open={!!product} onClose={() => setQuickView(null)} label="Quick view" className="max-w-5xl">
      {/* Keyed so colour resets for each product */}
      {product && <QuickViewBody key={product.id} product={product} onClose={() => setQuickView(null)} />}
    </Modal>
  );
}

function QuickViewBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const [colorName, setColorName] = useState(product.colorways[0].name);
  const colorway = product.colorways.find((c) => c.name === colorName) ?? product.colorways[0];
  const [view, setView] = useState<"drape" | "pallu">("drape");

  return (
    <div className="grid md:grid-cols-2">
      <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[640px]">
        <div className="absolute inset-0">
          <ProductImage product={product} colorway={colorway} view={view} uid={`qv-${product.id}-${colorway.name}-${view}`} sizes="(min-width: 768px) 40vw, 100vw" colourNote />
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {(["drape", "pallu"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`glass border px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] transition ${view === v ? "border-gold-400 text-gold-200" : "border-ivory-100/20 text-ivory-100/70"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 md:p-10">
        <ProductInfo product={product} colorway={colorway} onColorway={setColorName} compact />
        <Link
          href={`/product/${product.slug}`}
          onClick={onClose}
          className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-300 hover:text-gold-200"
        >
          Full details & 3D view <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
