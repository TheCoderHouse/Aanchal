"use client";

import { motion } from "motion/react";
import { Heart, Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import type { Colorway, Product } from "@/data/types";
import { cn, formatPrice } from "@/lib/utils";
import { FALL_PICO_PRICE, useCart, type CartItem } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";

type Props = {
  item: CartItem;
  product: Product;
  colorway: Colorway;
  lineTotal: number;
  size?: "drawer" | "page";
  onNavigate?: () => void;
};

/** One saree in the bag: quantity, fall & pico add-on, move to wishlist, remove. */
export function CartLineItem({ item, product, colorway, lineTotal, size = "drawer", onNavigate }: Props) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const toggleFallPico = useCart((s) => s.toggleFallPico);
  const toggleWish = useWishlist((s) => s.toggle);
  const inWishlist = useWishlist((s) => s.ids.includes(product.id));
  const toast = useUI((s) => s.toast);
  const big = size === "page";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex gap-4 overflow-hidden", big && "gap-6 border-b border-ivory-100/10 pb-8")}
    >
      <Link
        href={`/product/${product.slug}`}
        onClick={onNavigate}
        className={cn("group relative shrink-0 overflow-hidden", big ? "h-48 w-36" : "h-32 w-24")}
      >
        <div className="h-full w-full transition-transform duration-700 ease-silk group-hover:scale-110">
          <ProductImage product={product} colorway={colorway} uid={`line-${size}-${item.key}`} sizes="160px" />
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold-500">
              {product.weave} · {product.fabric}
            </p>
            <Link
              href={`/product/${product.slug}`}
              onClick={onNavigate}
              className={cn("mt-1 block font-display leading-tight text-ivory-50 hover:text-gold-200", big ? "text-2xl" : "text-lg")}
            >
              {product.name}
            </Link>
            <p className="mt-1 flex items-center gap-2 text-xs text-ivory-100/50">
              <span
                className="h-2.5 w-2.5 rounded-full ring-1 ring-ivory-100/20"
                style={{ background: `linear-gradient(135deg, ${colorway.base} 55%, ${colorway.border} 55%)` }}
              />
              {colorway.name}
            </p>
          </div>
          <button
            onClick={() => {
              remove(item.key);
              toast("Removed from bag", product.name);
            }}
            aria-label={`Remove ${product.name}`}
            className="grid h-7 w-7 shrink-0 place-items-center text-ivory-100/40 transition hover:rotate-90 hover:text-gold-300"
          >
            <X size={14} />
          </button>
        </div>

        <label className="mt-2 flex w-fit cursor-pointer items-center gap-2 text-[0.7rem] text-ivory-100/55">
          <input
            type="checkbox"
            checked={!!item.fallPico}
            onChange={() => toggleFallPico(item.key)}
            className="h-3 w-3 accent-[var(--color-gold-400)]"
          />
          Fall & pico (+{formatPrice(FALL_PICO_PRICE)})
        </label>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-ivory-100/15">
              <button
                className="grid h-8 w-8 place-items-center text-ivory-100/70 hover:text-gold-300 disabled:opacity-30"
                aria-label="Decrease quantity"
                disabled={item.qty <= 1}
                onClick={() => setQty(item.key, item.qty - 1)}
              >
                <Minus size={12} />
              </button>
              <motion.span key={item.qty} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-6 text-center text-sm">
                {item.qty}
              </motion.span>
              <button
                className="grid h-8 w-8 place-items-center text-ivory-100/70 hover:text-gold-300 disabled:opacity-30"
                aria-label="Increase quantity"
                disabled={item.qty >= 5}
                onClick={() => setQty(item.key, item.qty + 1)}
              >
                <Plus size={12} />
              </button>
            </div>
            {!inWishlist && (
              <button
                onClick={() => {
                  toggleWish(product.id);
                  remove(item.key);
                  toast("Moved to wishlist", product.name);
                }}
                className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.15em] text-ivory-100/45 hover:text-gold-300"
              >
                <Heart size={12} /> {big ? "Move to wishlist" : "Save"}
              </button>
            )}
          </div>
          <motion.span key={lineTotal} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className={cn("text-ivory-50", big ? "font-display text-2xl" : "text-sm")}>
            {formatPrice(lineTotal)}
          </motion.span>
        </div>
      </div>
    </motion.li>
  );
}
