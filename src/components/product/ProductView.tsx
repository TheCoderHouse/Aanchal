"use client";

import { useEffect, useState } from "react";
import { useRecent } from "@/store/recent";
import type { Product } from "@/data/types";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";

/** Gallery + info side by side, sharing the selected colour. */
export function ProductView({ product }: { product: Product }) {
  const [colorName, setColorName] = useState(product.colorways[0].name);
  const colorway = product.colorways.find((c) => c.name === colorName) ?? product.colorways[0];
  const addViewed = useRecent((s) => s.addViewed);

  // Remember this saree for "Recently viewed"
  useEffect(() => {
    addViewed(product.id);
  }, [product.id, addViewed]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <ProductGallery product={product} colorway={colorway} />
      </div>
      <ProductInfo product={product} colorway={colorway} onColorway={setColorName} />
    </div>
  );
}
