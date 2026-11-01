"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { CollectionImage } from "@/components/product/CollectionImage";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { collections } from "@/data/collections";
import { useMounted } from "@/hooks/useMounted";
import { formatPrice } from "@/lib/utils";
import { useCartSummary } from "@/store/cart";
import { useUI } from "@/store/ui";
import { CartLineItem } from "./CartLineItem";
import { CompleteTheLook } from "./CompleteTheLook";
import { FreeShippingBar } from "./FreeShippingBar";
import { GiftWrapToggle } from "./GiftWrapToggle";

export function CartDrawer() {
  const open = useUI((s) => s.panel === "cart");
  const close = useUI((s) => s.close);
  const mounted = useMounted();
  const summary = useCartSummary();
  const empty = !mounted || summary.lines.length === 0;

  return (
    <Drawer
      open={open}
      onClose={close}
      title={
        <span>
          Your bag{" "}
          <motion.span key={summary.count} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block text-base text-gold-400">
            ({mounted ? summary.count : 0})
          </motion.span>
        </span>
      }
      footer={
        !empty && (
          <div className="space-y-4">
            <GiftWrapToggle />
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ivory-100/60">
                Subtotal
                {summary.discount > 0 && <span className="ml-2 text-xs text-gold-300">−{formatPrice(summary.discount)} off</span>}
              </span>
              <motion.span key={summary.total} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} className="font-display text-3xl text-ivory-50">
                {formatPrice(summary.total)}
              </motion.span>
            </div>
            <Button href="/checkout" onClick={close} size="lg" className="w-full">
              <Lock size={13} /> Secure checkout
            </Button>
            <Link href="/cart" onClick={close} className="block text-center text-xs uppercase tracking-[0.2em] text-ivory-100/55 hover:text-gold-300">
              View full bag & offers
            </Link>
          </div>
        )
      }
    >
      {empty ? (
        <EmptyBag onClose={close} />
      ) : (
        <div className="space-y-8">
          <FreeShippingBar remaining={summary.toFreeShipping} />
          <ul className="space-y-6">
            <AnimatePresence initial={false}>
              {summary.lines.map(({ item, product, colorway, lineTotal }) => (
                <CartLineItem key={item.key} item={item} product={product} colorway={colorway} lineTotal={lineTotal} onNavigate={close} />
              ))}
            </AnimatePresence>
          </ul>
          <div className="border-t border-ivory-100/10 pt-6">
            <CompleteTheLook excludeIds={summary.lines.map((l) => l.product.id)} onNavigate={close} />
          </div>
        </div>
      )}
    </Drawer>
  );
}

function EmptyBag({ onClose }: { onClose: () => void }) {
  const featured = collections.slice(0, 3);
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      {/* Three folded sarees fanning out */}
      <div className="relative mb-10 h-40 w-40">
        {featured.map((c, i) => (
          <motion.div
            key={c.slug}
            className="absolute inset-x-8 inset-y-0 overflow-hidden shadow-2xl"
            initial={{ rotate: 0, y: 20, opacity: 0 }}
            animate={{ rotate: (i - 1) * 12, y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "50% 100%" }}
          >
            <CollectionImage collection={c} uid={`empty-${c.slug}`} sizes="100px" />
          </motion.div>
        ))}
      </div>
      <p className="font-display text-3xl text-ivory-50">Your bag is waiting</p>
      <p className="mt-2 max-w-xs text-sm text-ivory-100/50">Every saree here is one of a kind. Find the one that feels like yours.</p>
      <div className="mt-8 flex flex-col gap-3">
        <Button href="/shop" onClick={onClose}>
          Explore the shop <ArrowRight size={13} />
        </Button>
        <Button href="/shop?occasion=Bridal" onClick={onClose} variant="ghost" size="sm">
          See the bridal edit
        </Button>
      </div>
    </div>
  );
}
