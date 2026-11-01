"use client";

import { AnimatePresence, motion } from "motion/react";
import { Heart, Share2, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ColorSwatch } from "@/components/product/ColorSwatch";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { products } from "@/data/products";
import type { Product } from "@/data/types";
import { useMounted } from "@/hooks/useMounted";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useRecent } from "@/store/recent";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";

export function WishlistClient() {
  const mounted = useMounted();
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const { toast, open } = useUI();
  const viewed = useRecent((s) => s.viewed);

  const items = mounted ? ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p) : [];
  const total = items.reduce((s, p) => s + p.price, 0);
  const recent = mounted
    ? viewed.filter((id) => !ids.includes(id)).map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p).slice(0, 4)
    : [];

  const moveAll = () => {
    items.forEach((p) => {
      add(p.id, p.colorways[0].name);
      toggle(p.id);
    });
    toast(`Moved ${items.length} sarees to your bag`);
    open("cart");
  };

  const share = async () => {
    const text = items.map((p) => `${p.name} – ${formatPrice(p.price)}\n${location.origin}/product/${p.slug}`).join("\n\n");
    try {
      await navigator.clipboard.writeText(`My Aanchal wishlist\n\n${text}`);
      toast("Wishlist copied", "Paste it in WhatsApp or email to share");
    } catch {
      toast("Couldn't copy", "Your browser blocked clipboard access");
    }
  };

  return (
    <>
      <div className="mb-12 mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <RevealText as="h1" text="Your wishlist" className="font-display text-6xl font-light leading-none text-ivory-50 md:text-8xl" />
          {items.length > 0 && (
            <p className="mt-4 text-sm text-ivory-100/55">
              {items.length} {items.length === 1 ? "saree" : "sarees"} · {formatPrice(total)} in all
            </p>
          )}
        </div>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={share}>
              <Share2 size={13} /> Share
            </Button>
            <Button onClick={moveAll}>
              <ShoppingBag size={13} /> Move all to bag
            </Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="grid place-items-center border border-dashed border-ivory-100/15 px-6 py-24 text-center">
          <motion.span
            className="grid h-16 w-16 place-items-center rounded-full border border-gold-500/40 text-gold-300"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            <Heart size={22} />
          </motion.span>
          <p className="mt-6 font-display text-4xl text-ivory-50">Save what you love</p>
          <p className="mt-3 max-w-sm text-sm text-ivory-100/50">Tap the heart on any saree to keep it here. Your list stays on this device.</p>
          <Button href="/shop" className="mt-8">
            Explore the shop
          </Button>
        </div>
      ) : (
        <motion.ul layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((p) => (
              <WishlistItem key={p.id} product={p} />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {recent.length > 0 && (
        <section className="mt-28 border-t border-ivory-100/10 pt-16">
          <p className="eyebrow">Recently viewed</p>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-5 lg:grid-cols-4">
            {recent.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function WishlistItem({ product }: { product: Product }) {
  const [colorName, setColorName] = useState(product.colorways[0].name);
  const colorway = product.colorways.find((c) => c.name === colorName) ?? product.colorways[0];
  const toggle = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const { toast, open } = useUI();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link href={`/product/${product.slug}`} data-cursor="View saree" className="absolute inset-0">
          <div className="h-full w-full transition-transform duration-[1.2s] ease-silk group-hover:scale-105">
            <ProductImage product={product} colorway={colorway} uid={`wl-${product.id}-${colorway.name}`} colourNote />
          </div>
        </Link>
        <button
          onClick={() => {
            toggle(product.id);
            toast("Removed from wishlist", product.name);
          }}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink/50 text-ivory-50 backdrop-blur transition hover:rotate-90 hover:bg-ink/80"
        >
          <X size={15} />
        </button>
      </div>
      <h3 className="mt-4 truncate font-display text-xl text-ivory-50">{product.name}</h3>
      <PriceTag price={product.price} compareAt={product.compareAt} size="sm" className="mt-1" />
      {product.colorways.length > 1 && (
        <div className="-ml-1 mt-2">
          <ColorSwatch colorways={product.colorways} value={colorway.name} onChange={setColorName} size="sm" />
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full"
        onClick={() => {
          add(product.id, colorway.name);
          toggle(product.id);
          toast("Moved to bag", `${product.name} · ${colorway.name}`);
          open("cart");
        }}
      >
        <ShoppingBag size={12} /> Move to bag
      </Button>
    </motion.li>
  );
}
