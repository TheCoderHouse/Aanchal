"use client";

import { motion, useInView, useMotionValueEvent, useScroll } from "motion/react";
import { Check, Heart, Minus, Plus, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCollection } from "@/data/collections";
import type { Colorway, Product } from "@/data/types";
import { useMounted } from "@/hooks/useMounted";
import { cn, formatPrice } from "@/lib/utils";
import { FALL_PICO_PRICE, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";
import { ColorSwatch } from "./ColorSwatch";
import { PriceTag } from "./PriceTag";
import { RatingStars } from "./RatingStars";
import { ProductImage } from "./ProductImage";

type Props = {
  product: Product;
  colorway: Colorway;
  onColorway: (name: string) => void;
  compact?: boolean; // Quick view: fewer sections
};

/** Name, price, options and buy buttons. Shared by the product page and Quick view. */
export function ProductInfo({ product, colorway, onColorway, compact = false }: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [fallPico, setFallPico] = useState(false);
  const add = useCart((s) => s.add);
  const setCartQty = useCart((s) => s.setQty);
  const { toast, open, setQuickView } = useUI();
  const mounted = useMounted();
  const saved = useWishlist((s) => s.ids.includes(product.id)) && mounted;
  const toggleWish = useWishlist((s) => s.toggle);
  const buyRef = useRef<HTMLDivElement>(null);
  const buyVisible = useInView(buyRef, { margin: "0px 0px -10% 0px" });
  const { scrollY } = useScroll();
  const [scrolledPast, setScrolledPast] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolledPast(y > 500));
  const showBar = scrolledPast && !buyVisible;
  const collection = getCollection(product.collection);
  const unit = product.price + (fallPico ? FALL_PICO_PRICE : 0);

  const addToBag = () => {
    add(product.id, colorway.name, { fallPico });
    if (qty > 1) setCartQty(`${product.id}:${colorway.name}`, qty);
    toast("Added to bag", `${product.name} · ${colorway.name}`);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {product.isNew && <Badge tone="ivory">New</Badge>}
        {product.isBestseller && <Badge>Bestseller</Badge>}
        {product.handloom && <Badge tone="outline">Handloom</Badge>}
      </div>
      <p className="eyebrow mt-5">
        {collection?.name} · {product.weave}
      </p>
      <h1 className={cn("mt-3 font-display font-light leading-[1.02] text-ivory-50", compact ? "text-4xl" : "text-5xl md:text-6xl")}>
        {product.name}
      </h1>
      <div className="mt-4 flex items-center gap-4">
        <RatingStars rating={product.rating} reviews={product.reviews} size={13} />
        {!compact && (
          <a href="#reviews" className="text-xs text-ivory-100/50 underline underline-offset-4 hover:text-gold-300">
            Read reviews
          </a>
        )}
      </div>
      <PriceTag price={product.price} compareAt={product.compareAt} size="lg" className="mt-6" />
      <p className="mt-1 text-xs text-ivory-100/40">Inclusive of all taxes · Free shipping</p>

      <p className="mt-6 text-[0.95rem] leading-relaxed text-ivory-100/65">{product.description}</p>

      {/* Colour */}
      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ivory-100/60">
          Colour: <span className="text-ivory-50 normal-case tracking-normal">{colorway.name}</span>
        </p>
        <ColorSwatch colorways={product.colorways} value={colorway.name} onChange={onColorway} />
      </div>

      {/* Add-on */}
      <button
        onClick={() => setFallPico(!fallPico)}
        aria-pressed={fallPico}
        className={cn(
          "mt-6 flex w-full items-center gap-4 border p-4 text-left transition",
          fallPico ? "border-gold-400/70 bg-gold-400/5" : "border-ivory-100/15 hover:border-ivory-100/30",
        )}
      >
        <span className={cn("grid h-5 w-5 shrink-0 place-items-center border", fallPico ? "border-gold-400 bg-gold-400 text-ink" : "border-ivory-100/30")}>
          {fallPico && <Check size={12} strokeWidth={3} />}
        </span>
        <span className="flex-1">
          <span className="block text-sm text-ivory-50">Add fall & pico</span>
          <span className="block text-xs text-ivory-100/50">Ready to wear on arrival, finished by hand</span>
        </span>
        <span className="text-sm text-gold-300">+{formatPrice(FALL_PICO_PRICE)}</span>
      </button>

      {/* Quantity + buttons */}
      <div ref={buyRef} className="mt-6 flex flex-wrap gap-3">
        <div className="flex h-14 items-center border border-ivory-100/15">
          <button className="grid h-full w-11 place-items-center text-ivory-100/70 hover:text-gold-300" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm" aria-live="polite">{qty}</span>
          <button className="grid h-full w-11 place-items-center text-ivory-100/70 hover:text-gold-300" aria-label="Increase quantity" onClick={() => setQty(Math.min(5, qty + 1))}>
            <Plus size={14} />
          </button>
        </div>
        <Button
          size="lg"
          className="flex-1"
          onClick={() => {
            addToBag();
            setQuickView(null);
            open("cart");
          }}
        >
          Add to bag · {formatPrice(unit * qty)}
        </Button>
        <button
          onClick={() => {
            toggleWish(product.id);
            toast(saved ? "Removed from wishlist" : "Saved to wishlist", product.name);
          }}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className="grid h-14 w-14 place-items-center border border-ivory-100/15 transition hover:border-gold-400"
        >
          <Heart size={18} className={cn(saved && "fill-wine-500 text-wine-500")} />
        </button>
      </div>
      <Button
        variant="outline"
        size="lg"
        className="mt-3 w-full"
        onClick={() => {
          addToBag();
          setQuickView(null);
          router.push("/checkout");
        }}
      >
        Buy it now
      </Button>

      {!compact && (
        <>
          <PincodeCheck />

          <ul className="mt-8 grid grid-cols-3 gap-3 border-y border-ivory-100/10 py-6 text-center">
            {[
              { icon: ShieldCheck, label: product.fabric === "Silk" ? "Silk Mark certified" : "Authenticity assured" },
              { icon: Truck, label: "Free insured shipping" },
              { icon: RotateCcw, label: "7-day returns" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2">
                <Icon size={18} strokeWidth={1.3} className="text-gold-300" />
                <span className="text-[0.7rem] leading-tight text-ivory-100/60">{label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Accordion
              defaultOpen="details"
              items={[
                {
                  id: "details",
                  title: "Product details",
                  content: (
                    <dl className="grid grid-cols-[110px_1fr] gap-y-2">
                      <dt className="text-ivory-100/40">Fabric</dt><dd>{product.fabric}</dd>
                      <dt className="text-ivory-100/40">Weave</dt><dd>{product.weave}</dd>
                      <dt className="text-ivory-100/40">Woven in</dt><dd>{product.region}</dd>
                      <dt className="text-ivory-100/40">Occasion</dt><dd>{product.occasion.join(", ")}</dd>
                      <dt className="text-ivory-100/40">Handloom</dt><dd>{product.handloom ? "Yes, certified" : "Power loom finish"}</dd>
                    </dl>
                  ),
                },
                {
                  id: "care",
                  title: "Size & care",
                  content: (
                    <ul className="list-inside list-disc space-y-1.5">
                      {product.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  id: "shipping",
                  title: "Shipping & returns",
                  content:
                    "Dispatched in 2–4 days in a keepsake box, fully insured. Free across India above ₹5,000. Returns accepted within 7 days if unworn with tags intact. Sarees with fall & pico added cannot be returned.",
                },
              ]}
            />
          </div>
        </>
      )}

      {/* Sticky buy bar once the main buttons scroll away (product page only) */}
      {!compact && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: showBar ? "0%" : "110%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass fixed inset-x-0 bottom-0 z-[60] border-t border-gold-500/15"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
            <div className="h-14 w-11 shrink-0 overflow-hidden max-sm:hidden">
              <ProductImage product={product} colorway={colorway} uid={`bar-${product.id}-${colorway.name}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg text-ivory-50">{product.name}</p>
              <p className="text-xs text-ivory-100/50">
                {colorway.name} · {formatPrice(unit)}
              </p>
            </div>
            <Button
              onClick={() => {
                addToBag();
                open("cart");
              }}
            >
              Add to bag
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<string | null>(null);

  return (
    <form
      className="mt-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(pin)) {
          setResult("Please enter a valid 6-digit pincode.");
          return;
        }
        const d = new Date();
        d.setDate(d.getDate() + 3 + (Number(pin[0]) % 3));
        setResult(`Delivery by ${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · Cash on delivery available`);
      }}
    >
      <label htmlFor="pincode" className="text-xs uppercase tracking-[0.2em] text-ivory-100/60">
        Check delivery
      </label>
      <div className="mt-3 flex border-b border-ivory-100/20 focus-within:border-gold-400">
        <input
          id="pincode"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter pincode"
          className="flex-1 bg-transparent py-2 text-sm text-ivory-50 outline-none placeholder:text-ivory-100/30"
        />
        <button type="submit" className="text-xs uppercase tracking-[0.2em] text-gold-300 hover:text-gold-200">
          Check
        </button>
      </div>
      {result && <p className="mt-2 text-xs text-ivory-100/60">{result}</p>}
    </form>
  );
}
