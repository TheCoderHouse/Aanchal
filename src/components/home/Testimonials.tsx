"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { RatingStars } from "@/components/product/RatingStars";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = testimonials[index];
  const go = (dir: number) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative overflow-hidden border-y border-gold-500/10 bg-wine-950 py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Large decorative quote mark */}
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 font-display text-[16rem] leading-none text-gold-500/10">
        “
      </span>

      <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
        <p className="eyebrow">Words from our patrons</p>
        <div className="mt-10 min-h-[260px] md:min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease }}
            >
              <RatingStars rating={t.rating} size={14} className="justify-center" />
              <blockquote className="mt-6 font-display text-3xl font-light italic leading-snug text-ivory-50 md:text-[2.6rem]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8 text-sm text-ivory-100/60">
                <span className="text-ivory-50">{t.name}</span> · {t.city}
                <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.25em] text-gold-400">
                  Wore the {t.product}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button onClick={() => go(-1)} aria-label="Previous review" className="text-ivory-100/50 transition hover:text-gold-300">
            <ArrowLeft size={18} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((x, i) => (
              <button
                key={x.id}
                aria-label={`Review ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn("h-1 rounded-full transition-all duration-500", i === index ? "w-10 bg-gold-400" : "w-4 bg-ivory-100/20")}
              />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next review" className="text-ivory-100/50 transition hover:text-gold-300">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
