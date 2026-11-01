"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

/** Small row of suggestions not already in the bag. */
export function CompleteTheLook({ excludeIds, count = 3, onNavigate }: { excludeIds: string[]; count?: number; onNavigate?: () => void }) {
  const add = useCart((s) => s.add);
  const toast = useUI((s) => s.toast);
  const picks = products.filter((p) => p.isBestseller && !excludeIds.includes(p.id)).slice(0, count);
  if (!picks.length) return null;

  return (
    <div>
      <p className="eyebrow mb-4">Complete the look</p>
      <ul className="grid grid-cols-3 gap-3">
        {picks.map((p) => (
          <li key={p.id} className="group">
            <Link href={`/product/${p.slug}`} onClick={onNavigate} className="relative block aspect-[3/4] overflow-hidden">
              <div className="h-full w-full transition-transform duration-700 ease-silk group-hover:scale-110">
                <ProductImage product={p} colorway={p.colorways[0]} uid={`ctl-${p.id}`} />
              </div>
            </Link>
            <p className="mt-2 truncate text-xs text-ivory-100/80">{p.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-ivory-100/50">{formatPrice(p.price)}</span>
              <button
                onClick={() => {
                  add(p.id, p.colorways[0].name);
                  toast("Added to bag", p.name);
                }}
                aria-label={`Add ${p.name} to bag`}
                className="grid h-6 w-6 place-items-center rounded-full border border-gold-500/40 text-gold-300 transition hover:bg-gold-400 hover:text-ink"
              >
                <Plus size={11} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
