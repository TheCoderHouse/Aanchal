"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Clock, CornerDownLeft, Search, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CollectionImage } from "@/components/product/CollectionImage";
import { ProductImage } from "@/components/product/ProductImage";
import { products } from "@/data/products";
import { useEscape } from "@/hooks/useEscape";
import { useMounted } from "@/hooks/useMounted";
import { useScrollLock } from "@/hooks/useScrollLock";
import { searchCollections, searchProducts, trendingSearches } from "@/lib/search";
import { cn, formatPrice } from "@/lib/utils";
import { useRecent } from "@/store/recent";
import { useUI } from "@/store/ui";

const ease = [0.22, 1, 0.36, 1] as const;

/** Full-screen search. Opens from the navbar, or with "/" or ⌘K / Ctrl+K anywhere. */
export function SearchOverlay() {
  const open = useUI((s) => s.panel === "search");
  const openPanel = useUI((s) => s.open);
  const close = useUI((s) => s.close);

  // Keyboard shortcuts to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, select, [contenteditable=true]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        openPanel("search");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPanel]);

  return <AnimatePresence>{open && <SearchPanel onClose={close} />}</AnimatePresence>;
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const mounted = useMounted();
  const { searches, viewed, addSearch, clearSearches } = useRecent();
  useScrollLock(true);
  useEscape(true, onClose);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const q = query.trim();
  const results = useMemo(() => (q ? searchProducts(q, 24) : []), [q]);
  const shown = results.slice(0, 6);
  const matchedCollections = useMemo(() => searchCollections(q), [q]);
  const recentlyViewed = mounted
    ? viewed.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined).slice(0, 4)
    : [];

  const goToShop = (term: string) => {
    addSearch(term);
    onClose();
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!shown.length) {
      if (e.key === "Enter" && q) goToShop(q);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % (shown.length + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + shown.length + 1) % (shown.length + 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active < shown.length) {
        addSearch(q);
        onClose();
        router.push(`/product/${shown[active].slug}`);
      } else goToShop(q);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[85] flex flex-col bg-ink/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      data-lenis-prevent
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 md:px-8 md:pt-12">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            aria-label="Close search"
            className="grid h-11 w-11 place-items-center rounded-full border border-ivory-100/15 text-ivory-100 transition duration-500 hover:rotate-90 hover:border-gold-400 hover:text-gold-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Input */}
        <motion.div
          className="relative mt-4 md:mt-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
        >
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gold-400" size={26} strokeWidth={1.4} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search weaves, colours, occasions…"
            aria-label="Search sarees"
            aria-controls="search-results"
            className="w-full border-0 bg-transparent py-4 pl-12 font-display text-3xl font-light text-ivory-50 outline-none placeholder:text-ivory-100/25 md:pl-14 md:text-6xl"
          />
          <div className="h-px bg-ivory-100/15">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease, delay: 0.15 }}
            />
          </div>
          <p className="mt-3 hidden items-center gap-4 text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/35 md:flex">
            <span>↑ ↓ to move</span>
            <span className="flex items-center gap-1">
              <CornerDownLeft size={11} /> to open
            </span>
            <span>Esc to close</span>
          </p>
        </motion.div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-6xl flex-1 overflow-y-auto px-4 pb-16 pt-10 md:px-8">
        {!q ? (
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
            <div className="space-y-10">
              {searches.length > 0 && mounted && (
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="eyebrow flex items-center gap-2">
                      <Clock size={12} /> Recent
                    </p>
                    <button onClick={clearSearches} className="text-[0.65rem] uppercase tracking-[0.2em] text-ivory-100/40 hover:text-gold-300">
                      Clear
                    </button>
                  </div>
                  <ChipList items={searches} onPick={setQuery} />
                </section>
              )}
              <section>
                <p className="eyebrow mb-4 flex items-center gap-2">
                  <TrendingUp size={12} /> Trending
                </p>
                <ChipList items={trendingSearches} onPick={setQuery} />
              </section>
            </div>
            <section>
              <p className="eyebrow mb-4">{recentlyViewed.length ? "Recently viewed" : "Most loved right now"}</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(recentlyViewed.length ? recentlyViewed : products.filter((p) => p.isBestseller).slice(0, 4)).map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06, ease }}>
                    <Link href={`/product/${p.slug}`} onClick={onClose} className="group block">
                      <div className="aspect-[3/4] overflow-hidden">
                        <div className="h-full w-full transition-transform duration-700 ease-silk group-hover:scale-110">
                          <ProductImage product={p} colorway={p.colorways[0]} uid={`srch-${p.id}`} />
                        </div>
                      </div>
                      <p className="mt-2 truncate font-display text-lg text-ivory-50">{p.name}</p>
                      <p className="text-xs text-ivory-100/50">{formatPrice(p.price)}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div id="search-results">
            {matchedCollections.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-3">
                {matchedCollections.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/collections/${c.slug}`}
                    onClick={() => {
                      addSearch(q);
                      onClose();
                    }}
                    className="group flex items-center gap-3 border border-gold-500/30 py-2 pl-2 pr-4 transition hover:border-gold-300"
                  >
                    <span className="h-9 w-9 overflow-hidden rounded-full">
                      <CollectionImage collection={c} uid={`sc-${c.slug}`} sizes="40px" />
                    </span>
                    <span className="text-sm text-ivory-50">{c.name} collection</span>
                    <ArrowUpRight size={14} className="text-gold-300 transition group-hover:rotate-45" />
                  </Link>
                ))}
              </div>
            )}

            {shown.length ? (
              <>
                <p className="mb-4 text-xs text-ivory-100/45">
                  {results.length} {results.length === 1 ? "saree" : "sarees"} found
                </p>
                <ul className="divide-y divide-ivory-100/10 border-y border-ivory-100/10" role="listbox">
                  {shown.map((p, i) => (
                    <motion.li
                      key={p.id}
                      role="option"
                      aria-selected={active === i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, ease }}
                    >
                      <Link
                        href={`/product/${p.slug}`}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => {
                          addSearch(q);
                          onClose();
                        }}
                        className={cn("flex items-center gap-5 px-3 py-3 transition-colors", active === i && "bg-ivory-100/[0.04]")}
                      >
                        <span className="h-16 w-12 shrink-0 overflow-hidden">
                          <ProductImage product={p} colorway={p.colorways[0]} uid={`sr-${p.id}`} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-xl text-ivory-50 md:text-2xl">
                            <Highlight text={p.name} query={q} />
                          </span>
                          <span className="block text-xs text-ivory-100/50">
                            {p.weave} · {p.fabric} · {p.region}
                          </span>
                        </span>
                        <span className="text-sm text-ivory-100">{formatPrice(p.price)}</span>
                        <ArrowRight size={16} className={cn("shrink-0 transition", active === i ? "text-gold-300" : "text-transparent")} />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <button
                  onMouseEnter={() => setActive(shown.length)}
                  onClick={() => goToShop(q)}
                  className={cn(
                    "mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] transition",
                    active === shown.length ? "text-gold-200" : "text-gold-400",
                  )}
                >
                  View all {results.length} results <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <div className="py-10 text-center">
                <p className="font-display text-4xl text-ivory-50">Nothing matches “{q}”</p>
                <p className="mt-3 text-sm text-ivory-100/50">Try a weave, a colour or an occasion:</p>
                <div className="mt-6 flex justify-center">
                  <ChipList items={trendingSearches} onPick={setQuery} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ChipList({ items, onPick }: { items: string[]; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <button
          key={t}
          onClick={() => onPick(t)}
          className="border border-ivory-100/15 px-4 py-2 text-sm text-ivory-100/75 transition hover:border-gold-400 hover:text-gold-200"
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/** Wraps the parts of `text` that match words in `query` in gold. */
function Highlight({ text, query }: { text: string; query: string }) {
  const words = query.split(/\s+/).filter((w) => w.length > 1).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!words.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${words.join("|")})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        words.some((w) => new RegExp(`^${w}$`, "i").test(part)) ? (
          <mark key={i} className="bg-transparent text-gold-300">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
