"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { milestones } from "@/data/story";

/** Milestones joined by a gold thread that draws itself as you scroll. */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      {/* Track and drawn thread, down the middle on desktop, on the left on phones */}
      <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-ivory-100/10 md:left-1/2" />
      <motion.span
        aria-hidden
        className="absolute left-4 top-0 w-px origin-top bg-gradient-to-b from-gold-300 to-gold-600 md:left-1/2"
        style={{ scaleY: draw, height: "100%" }}
      />
      {milestones.map((m, i) => (
        <motion.li
          key={m.year}
          className="relative grid gap-2 pb-20 pl-14 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="absolute left-4 top-3 h-3 w-3 -translate-x-1/2 rotate-45 border border-gold-300 bg-ink md:left-1/2" />
          <p className={`font-display text-6xl font-light text-gold-gradient md:text-8xl ${i % 2 ? "md:order-2" : "md:text-right"}`}>
            {m.year}
          </p>
          <div className={i % 2 ? "md:order-1 md:text-right" : ""}>
            <h3 className="font-display text-3xl text-ivory-50 md:mt-4">{m.title}</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ivory-100/60">{m.text}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
