"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { RevealText } from "@/components/ui/RevealText";
import { getProduct } from "@/data/products";
import type { LookbookChapter as Chapter } from "@/data/lookbook";
import type { Product } from "@/data/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

/** One lookbook chapter: sticky story on one side, a parallax collage on the other. */
export function LookbookChapter({ chapter, flip }: { chapter: Chapter; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const looks = chapter.looks.map((s) => getProduct(s)).filter((p): p is Product => !!p);
  const add = useCart((s) => s.add);
  const { toast, open } = useUI();

  // Each image moves at its own speed for depth
  const y1 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["45%", "-20%"]);
  const bigNumberY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section
      ref={ref}
      id={chapter.id}
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-36"
      style={{ background: `linear-gradient(180deg, var(--color-ink), ${chapter.tone} 50%, var(--color-ink))` }}
    >
      <motion.span
        aria-hidden
        style={{ y: bigNumberY }}
        className={`pointer-events-none absolute top-10 select-none font-display text-[38vw] font-light leading-none text-ivory-50/[0.03] md:text-[22rem] ${flip ? "left-0" : "right-0"}`}
      >
        {chapter.number}
      </motion.span>

      <div className={`relative mx-auto grid max-w-7xl items-start gap-16 px-4 md:px-8 lg:grid-cols-[1fr_1.25fr] ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        {/* Story + shop the look */}
        <div className="lg:sticky lg:top-32">
          <p className="eyebrow">Chapter {chapter.number}</p>
          <RevealText as="h2" text={chapter.title} className="mt-4 font-display text-6xl font-light leading-none text-ivory-50 md:text-8xl" />
          <p className="mt-6 font-display text-2xl italic text-gold-200">{chapter.mood}</p>
          <p className="mt-4 max-w-md leading-relaxed text-ivory-100/60">{chapter.text}</p>

          <p className="eyebrow mb-4 mt-12">Shop the look</p>
          <ul className="divide-y divide-ivory-100/10 border-y border-ivory-100/10">
            {looks.map((p) => (
              <li key={p.id} className="flex items-center gap-4 py-3">
                <Link href={`/product/${p.slug}`} className="relative h-16 w-12 shrink-0 overflow-hidden">
                  <ProductImage product={p} uid={`lbl-${chapter.id}-${p.id}`} sizes="48px" />
                </Link>
                <Link href={`/product/${p.slug}`} className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg text-ivory-50 hover:text-gold-200">{p.name}</p>
                  <p className="text-xs text-ivory-100/50">{formatPrice(p.price)}</p>
                </Link>
                <button
                  onClick={() => {
                    add(p.id, p.colorways[0].name);
                    toast("Added to bag", p.name);
                    open("cart");
                  }}
                  aria-label={`Add ${p.name} to bag`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-gold-500/40 text-gold-300 transition hover:bg-gold-400 hover:text-ink"
                >
                  <Plus size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Collage */}
        <div className="relative h-[110vw] sm:h-[80vw] lg:h-[46rem]">
          <CollageImage product={looks[0]} y={y1} className="left-0 top-0 h-[78%] w-[62%]" uid={`${chapter.id}-a`} priority />
          <CollageImage product={looks[1]} y={y2} className="right-0 top-[12%] h-[48%] w-[42%]" uid={`${chapter.id}-b`} />
          <CollageImage product={looks[2]} y={y3} className="bottom-0 right-[8%] h-[40%] w-[34%]" uid={`${chapter.id}-c`} view="pallu" />
        </div>
      </div>
    </section>
  );
}

function CollageImage({
  product,
  y,
  className,
  uid,
  view = "drape",
  priority = false,
}: {
  product?: Product;
  y: MotionValue<string>;
  className: string;
  uid: string;
  view?: "drape" | "pallu";
  priority?: boolean;
}) {
  if (!product) return null;
  return (
    <motion.div style={{ y }} className={`absolute ${className}`}>
      <Link
        href={`/product/${product.slug}`}
        data-cursor="Shop look"
        className="group relative block h-full w-full overflow-hidden border border-gold-500/15 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
      >
        <div className="h-full w-full transition-transform duration-[1.4s] ease-silk group-hover:scale-105">
          <ProductImage product={product} view={view} uid={uid} sizes={priority ? "(min-width: 1024px) 35vw, 60vw" : "(min-width: 1024px) 22vw, 40vw"} />
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/90 to-transparent p-4 transition-transform duration-500 ease-silk group-hover:translate-y-0">
          <p className="font-display text-lg text-ivory-50">{product.name}</p>
          <p className="text-xs text-gold-300">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
