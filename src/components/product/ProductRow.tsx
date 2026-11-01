"use client";

import { motion } from "motion/react";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/data/types";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { ColorSwatch } from "./ColorSwatch";
import { PriceTag } from "./PriceTag";
import { RatingStars } from "./RatingStars";
import { ProductImage } from "./ProductImage";
import { WishlistHeart } from "./WishlistHeart";

/** Wide product row for the shop's list view. */
export function ProductRow({ product }: { product: Product }) {
  const [colorName, setColorName] = useState(product.colorways[0].name);
  const colorway = product.colorways.find((c) => c.name === colorName) ?? product.colorways[0];
  const add = useCart((s) => s.add);
  const { toast, open, setQuickView } = useUI();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group grid grid-cols-[120px_1fr] gap-5 border-b border-ivory-100/10 pb-8 sm:grid-cols-[200px_1fr] md:gap-8"
    >
      <Link href={`/product/${product.slug}`} data-cursor="View saree" className="relative block aspect-[3/4] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-silk group-hover:scale-105">
          <ProductImage product={product} colorway={colorway} uid={`row-${product.id}-${colorway.name}`} colourNote />
        </div>
      </Link>
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow !text-[0.6rem]">
              {product.weave} · {product.fabric} · {product.region}
            </p>
            <h3 className="mt-2 font-display text-2xl text-ivory-50 md:text-3xl">
              <Link href={`/product/${product.slug}`} className="hover:text-gold-200">
                {product.name}
              </Link>
            </h3>
            <RatingStars rating={product.rating} reviews={product.reviews} className="mt-2" />
          </div>
          <WishlistHeart productId={product.id} name={product.name} />
        </div>
        <p className="mt-4 hidden max-w-xl text-sm leading-relaxed text-ivory-100/55 sm:block">{product.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.isNew && <Badge tone="ivory">New</Badge>}
          {product.isBestseller && <Badge>Bestseller</Badge>}
          {product.handloom && <Badge tone="outline">Handloom</Badge>}
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
          <div className="space-y-3">
            <PriceTag price={product.price} compareAt={product.compareAt} />
            {product.colorways.length > 1 && (
              <ColorSwatch colorways={product.colorways} value={colorway.name} onChange={setColorName} size="sm" />
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setQuickView(product.slug)}>
              <Eye size={13} /> Quick view
            </Button>
            <Button
              size="sm"
              onClick={() => {
                add(product.id, colorway.name);
                toast("Added to bag", `${product.name} · ${colorway.name}`);
                open("cart");
              }}
            >
              <Plus size={13} /> Add
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
