"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";

const rowA = ["Banarasi", "Kanjeevaram", "Paithani", "Chanderi", "Patola", "Jamdani"];
const rowB = ["Pure Silk", "Real Zari", "Handloom", "Silk Mark", "Heirloom", "Hand-finished"];

function Row({ words, reverse, outline }: { words: string[]; reverse?: boolean; outline?: boolean }) {
  // Two copies so the loop is seamless
  const items = [...words, ...words, ...words, ...words];
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <div
        className="flex shrink-0 animate-marquee items-center"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {items.map((w, i) => (
          <span key={i} className="flex items-center">
            <span
              className={
                outline
                  ? "px-8 font-display text-6xl font-light italic text-transparent [-webkit-text-stroke:1px_var(--color-gold-500)] md:text-8xl"
                  : "px-8 font-display text-6xl font-light text-ivory-50 md:text-8xl"
              }
            >
              {w}
            </span>
            <span className="text-2xl text-gold-400">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two rows of weave names scrolling in opposite directions; they lean as you scroll fast. */
export function FabricMarquee() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skew = useSpring(useTransform(velocity, [-2000, 0, 2000], [6, 0, -6], { clamp: true }), {
    stiffness: 200,
    damping: 40,
  });

  return (
    <section aria-label="Our weaves" className="relative overflow-hidden border-y border-gold-500/10 bg-wine-950 py-14">
      <motion.div style={{ skewX: skew }} className="space-y-4">
        <Row words={rowA} />
        <Row words={rowB} reverse outline />
      </motion.div>
    </section>
  );
}
