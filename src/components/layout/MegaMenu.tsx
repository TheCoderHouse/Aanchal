"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CollectionImage } from "@/components/product/CollectionImage";
import { ProductImage } from "@/components/product/ProductImage";
import { collections } from "@/data/collections";
import { shopByFabric, shopByOccasion } from "@/data/navigation";
import { products } from "@/data/products";

const featured = products.find((p) => p.slug === "mor-pankh-paithani")!;

export function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass absolute inset-x-0 top-full border-y border-gold-500/15"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-10 px-8 py-10">
        <MenuColumn title="By occasion" links={shopByOccasion} onNavigate={onNavigate} />
        <MenuColumn title="By fabric" links={shopByFabric} onNavigate={onNavigate} />
        <div className="col-span-4">
          <p className="eyebrow mb-5">Collections</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/collections/${c.slug}`}
                  onClick={onNavigate}
                  className="group flex items-center gap-3 text-sm text-ivory-100/75 transition-colors hover:text-gold-200"
                >
                  <span className="h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-gold-500/30">
                    <CollectionImage collection={c} uid={`mm-${c.slug}`} sizes="32px" />
                  </span>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={`/product/${featured.slug}`}
          onClick={onNavigate}
          className="group col-span-4 grid grid-cols-2 gap-5 border border-gold-500/15 p-4 transition-colors hover:border-gold-400/40"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <div className="h-full w-full transition-transform duration-1000 ease-silk group-hover:scale-110">
              <ProductImage product={featured} colorway={featured.colorways[0]} uid="mm-featured" />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="eyebrow">Featured weave</p>
            <p className="mt-3 font-display text-2xl leading-tight text-ivory-50">{featured.name}</p>
            <p className="mt-2 text-xs leading-relaxed text-ivory-100/55">Tapestry pallu, two months on the loom.</p>
            <span className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] text-gold-300 underline-offset-4 group-hover:underline">
              Discover
            </span>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

function MenuColumn({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="col-span-2">
      <p className="eyebrow mb-5">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              onClick={onNavigate}
              className="text-sm text-ivory-100/75 transition-colors hover:text-gold-200"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
