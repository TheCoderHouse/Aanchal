"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { mainNav } from "@/data/navigation";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";
import { useCartSummary } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";
import { AnnouncementBar } from "./AnnouncementBar";
import { MegaMenu } from "./MegaMenu";

/**
 * Fixed header. Transparent at the top of the page, turns to frosted glass
 * after scrolling, hides when scrolling down and returns when scrolling up.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const open = useUI((s) => s.open);
  const mounted = useMounted();
  const { count } = useCartSummary();
  const wishCount = useWishlist((s) => s.ids.length);
  const signedIn = useAuth((s) => s.user);
  const user = mounted ? signedIn : null;

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 400 && y > prev && !mega);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[70]"
      animate={{ y: hidden ? "-100%" : scrolled ? -36 : 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onMouseLeave={() => setMega(false)}
    >
      <AnnouncementBar />
      <div
        className={cn(
          "relative transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || mega ? "glass border-b border-gold-500/10" : "border-b border-transparent",
        )}
      >
        <nav className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
          {/* Left: links (desktop) or menu button (mobile) */}
          <div className="flex items-center">
            <button
              className="-ml-2 grid h-11 w-11 place-items-center text-ivory-100 lg:hidden"
              aria-label="Open menu"
              onClick={() => open("menu")}
            >
              <Menu size={20} />
            </button>
            <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
              {mainNav.map((item) => (
                <li key={item.label} onMouseEnter={() => setMega(!!item.mega)} className={item.label === "Our Story" ? "max-xl:hidden" : undefined}>
                  <Link
                    href={item.href}
                    onClick={() => setMega(false)}
                    className="group relative flex items-center gap-1 py-2 text-[0.68rem] uppercase tracking-[0.16em] xl:tracking-[0.2em] text-ivory-100/85 transition-colors hover:text-gold-200"
                  >
                    {item.label}
                    {item.mega && <ChevronDown size={12} className="opacity-60" />}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-gold-400 transition-transform duration-500 ease-silk group-hover:origin-left group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Logo />

          {/* Right: icons */}
          <div className="flex items-center justify-end gap-1 text-ivory-100">
            <button
              onClick={() => open("search")}
              aria-label="Search (press /)"
              className="relative grid h-11 w-11 place-items-center transition-colors hover:text-gold-300"
            >
              <Search size={18} />
            </button>
            <IconLink href="/account" label={user ? `Account: ${user.name}` : "Sign in"} className="max-sm:hidden">
              {user ? (
                <span className="grid h-7 w-7 place-items-center rounded-full border border-gold-400 bg-gold-400/10 font-display text-sm text-gold-200">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={18} />
              )}
            </IconLink>
            <IconLink href="/wishlist" label="Wishlist" count={mounted ? wishCount : 0} className="max-sm:hidden">
              <Heart size={18} />
            </IconLink>
            <button
              onClick={() => open("cart")}
              aria-label={`Bag, ${mounted ? count : 0} items`}
              className="relative grid h-11 w-11 place-items-center transition-colors hover:text-gold-300"
            >
              <ShoppingBag size={18} />
              <Count value={mounted ? count : 0} />
            </button>
          </div>
        </nav>

        <AnimatePresence>{mega && <MegaMenu onNavigate={() => setMega(false)} />}</AnimatePresence>
      </div>
    </motion.header>
  );
}

function IconLink({
  href,
  label,
  count = 0,
  className,
  children,
}: {
  href: string;
  label: string;
  count?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn("relative grid h-11 w-11 place-items-center transition-colors hover:text-gold-300", className)}
    >
      {children}
      <Count value={count} />
    </Link>
  );
}

function Count({ value }: { value: number }) {
  return (
    <AnimatePresence>
      {value > 0 && (
        <motion.span
          key={value}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute right-1 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[0.55rem] font-bold text-ink"
        >
          {value}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
