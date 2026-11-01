"use client";

import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";

export function WishlistHeart({ productId, name, className }: { productId: string; name: string; className?: string }) {
  const mounted = useMounted();
  const saved = useWishlist((s) => s.ids.includes(productId)) && mounted;
  const toggle = useWishlist((s) => s.toggle);
  const toast = useUI((s) => s.toast);

  return (
    <button
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
        toast(saved ? "Removed from wishlist" : "Saved to wishlist", name);
      }}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full bg-ink/40 text-ivory-50 backdrop-blur-md transition hover:bg-ink/70",
        className,
      )}
    >
      <motion.span whileTap={{ scale: 0.7 }} animate={{ scale: saved ? [1, 1.35, 1] : 1 }} transition={{ duration: 0.4 }}>
        <Heart size={16} className={cn("transition-colors", saved && "fill-wine-500 text-wine-500")} />
      </motion.span>
      <AnimatePresence>
        {saved && (
          <motion.span
            key="burst"
            className="absolute inset-0 rounded-full border border-wine-500"
            initial={{ scale: 0.6, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}
