"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/data/types";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { ColorSwatch } from "./ColorSwatch";
import { PriceTag } from "./PriceTag";
import { RatingStars } from "./RatingStars";
import { ProductImage } from "./ProductImage";
import { WishlistHeart } from "./WishlistHeart";

/** Product tile with 3D tilt, light glare, image swap on hover and quick add. */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [colorName, setColorName] = useState(product.colorways[0].name);
  const colorway = product.colorways.find((c) => c.name === colorName) ?? product.colorways[0];
  const add = useCart((s) => s.add);
  const toast = useUI((s) => s.toast);
  const openPanel = useUI((s) => s.open);
  const setQuickView = useUI((s) => s.setQuickView);

  // Pointer position, 0..1
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,240,210,0.28), transparent 55%)`;

  const handleMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const uid = `${product.id}-${colorway.name}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group"
      style={{ perspective: 1000 }}
    >
      <Link href={`/product/${product.slug}`} className="block" data-cursor="View saree" prefetch={priority}>
        <motion.div
          ref={ref}
          onPointerMove={handleMove}
          onPointerLeave={reset}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative aspect-[3/4] overflow-hidden bg-wine-900"
        >
          {/* Main and hover views */}
          <div className="absolute inset-0 transition-[transform,opacity] duration-[1.1s] ease-silk group-hover:scale-105 group-hover:opacity-0">
            <ProductImage product={product} colorway={colorway} uid={`${uid}-d`} />
          </div>
          <div className="absolute inset-0 scale-110 opacity-0 transition-[transform,opacity] duration-[1.1s] ease-silk group-hover:scale-100 group-hover:opacity-100">
            <ProductImage product={product} colorway={colorway} view="pallu" uid={`${uid}-p`} />
          </div>

          <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: glare }} />

          {/* Badges float above the surface in 3D */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5" style={{ transform: "translateZ(40px)" }}>
            {product.isNew && <Badge tone="ivory">New</Badge>}
            {product.isBestseller && <Badge>Bestseller</Badge>}
            {product.handloom && <Badge tone="outline" className="bg-ink/40 backdrop-blur">Handloom</Badge>}
          </div>
          <div className="absolute right-3 top-3" style={{ transform: "translateZ(50px)" }}>
            <WishlistHeart productId={product.id} name={product.name} />
          </div>

          {/* Quick add */}
          <div
            className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-500 ease-silk group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
            style={{ transform: "translateZ(60px)" }}
          >
            <div className="flex gap-1.5">
              <button
                aria-label={`Quick view ${product.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickView(product.slug);
                }}
                className="glass grid h-11 w-11 shrink-0 place-items-center border border-gold-400/30 text-ivory-50 transition hover:border-gold-300 hover:text-gold-200"
              >
                <Eye size={15} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  add(product.id, colorway.name);
                  toast("Added to bag", `${product.name} · ${colorway.name}`);
                  openPanel("cart");
                }}
                className="glass flex h-11 flex-1 items-center justify-center gap-2 border border-gold-400/30 text-[0.65rem] uppercase tracking-[0.2em] text-ivory-50 transition hover:border-gold-300 hover:bg-gold-400 hover:text-ink"
              >
                <Plus size={14} /> Quick add
              </button>
            </div>
          </div>
        </motion.div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow !text-[0.6rem] !tracking-[0.25em] text-gold-500">
            {product.weave} · {product.fabric}
          </p>
          <h3 className="mt-1.5 truncate font-display text-xl text-ivory-50">
            <Link href={`/product/${product.slug}`} className="transition-colors hover:text-gold-200">
              {product.name}
            </Link>
          </h3>
          <PriceTag price={product.price} compareAt={product.compareAt} size="sm" className="mt-1" />
        </div>
        <RatingStars rating={product.rating} className="mt-1 shrink-0" />
      </div>
      {product.colorways.length > 1 && (
        <div className="mt-2 -ml-1">
          <ColorSwatch colorways={product.colorways} value={colorway.name} onChange={setColorName} size="sm" />
        </div>
      )}
    </motion.article>
  );
}
