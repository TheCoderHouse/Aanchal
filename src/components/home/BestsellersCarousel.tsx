"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { bestsellers, newArrivals } from "@/data/products";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "best", label: "Bestsellers", items: bestsellers },
  { id: "new", label: "New arrivals", items: newArrivals },
];

export function BestsellersCarousel() {
  const [tab, setTab] = useState(tabs[0].id);
  const items = tabs.find((t) => t.id === tab)!.items;
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    if (!embla) return;
    setProgress(Math.max(0, Math.min(1, embla.scrollProgress())));
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("scroll", update).on("reInit", update).on("select", update);
    return () => {
      embla.off("scroll", update).off("reInit", update).off("select", update);
    };
  }, [embla, update]);

  // Back to the start when switching tabs
  useEffect(() => {
    embla?.reInit();
    embla?.scrollTo(0, true);
  }, [tab, embla]);

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Most loved" title="Sarees our patrons treasure" />
          <div className="flex items-center gap-6">
            <div className="flex gap-6" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "border-b pb-1 text-xs uppercase tracking-[0.2em] transition-colors",
                    tab === t.id ? "border-gold-400 text-gold-300" : "border-transparent text-ivory-100/45 hover:text-ivory-100",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="hidden gap-2 md:flex">
              <NavButton label="Previous" disabled={!canPrev} onClick={() => embla?.scrollPrev()}>
                <ArrowLeft size={16} />
              </NavButton>
              <NavButton label="Next" disabled={!canNext} onClick={() => embla?.scrollNext()}>
                <ArrowRight size={16} />
              </NavButton>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 overflow-hidden pl-4 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]" ref={emblaRef}>
        <div className="flex gap-5 pr-4 md:pr-8">
          {items.map((p) => (
            <div key={`${tab}-${p.id}`} className="w-[68vw] shrink-0 sm:w-[42vw] md:w-[30vw] lg:w-[22vw]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl items-center gap-8 px-4 md:px-8">
        <div className="h-px flex-1 bg-ivory-100/10">
          <div className="h-full origin-left bg-gold-400 transition-transform duration-200" style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }} />
        </div>
        <Button href="/shop" variant="outline" size="sm">
          View all
        </Button>
      </div>
    </section>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-12 w-12 place-items-center rounded-full border border-ivory-100/20 text-ivory-50 transition hover:border-gold-400 hover:bg-gold-400 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ivory-50"
    >
      {children}
    </button>
  );
}
