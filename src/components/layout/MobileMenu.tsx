"use client";

import { motion } from "motion/react";
import { Heart, Search, User } from "lucide-react";
import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { InstagramIcon, PinterestIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { collections } from "@/data/collections";
import { mainNav } from "@/data/navigation";
import { useUI } from "@/store/ui";

export function MobileMenu() {
  const open = useUI((s) => s.panel === "menu");
  const close = useUI((s) => s.close);
  const openPanel = useUI((s) => s.open);

  return (
    <Drawer open={open} onClose={close} side="left" title="Menu">
      <nav>
        <button
          onClick={() => openPanel("search")}
          className="mb-8 flex w-full items-center gap-3 border-b border-ivory-100/20 pb-3 text-left text-ivory-100/50"
        >
          <Search size={16} className="text-gold-400" /> Search sarees…
        </button>
        <ul className="space-y-1">
          {mainNav.map((item, i) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={item.href} onClick={close} className="block py-2 font-display text-4xl font-light text-ivory-50">
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>
        <div className="mt-8 flex gap-6 text-sm text-ivory-100/70">
          <Link href="/account" onClick={close} className="flex items-center gap-2 hover:text-gold-300">
            <User size={15} /> Account
          </Link>
          <Link href="/wishlist" onClick={close} className="flex items-center gap-2 hover:text-gold-300">
            <Heart size={15} /> Wishlist
          </Link>
        </div>
        <p className="eyebrow mb-4 mt-10">Collections</p>
        <ul className="grid grid-cols-2 gap-3">
          {collections.map((c) => (
            <li key={c.slug}>
              <Link href={`/collections/${c.slug}`} onClick={close} className="text-sm text-ivory-100/70">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex gap-4 text-ivory-100/60">
          <InstagramIcon /> <PinterestIcon /> <YoutubeIcon />
        </div>
      </nav>
    </Drawer>
  );
}
