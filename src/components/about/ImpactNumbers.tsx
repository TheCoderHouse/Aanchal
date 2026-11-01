"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { impact } from "@/data/story";

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const target = parseInt(value, 10) || 0;
  const suffix = value.replace(/^\d+/, "");
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, { duration: 1.8, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, target, count]);

  return <motion.span ref={ref}>{text}</motion.span>;
}

export function ImpactNumbers() {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden border border-gold-500/15 bg-gold-500/15 md:grid-cols-4">
      {impact.map((i) => (
        <div key={i.label} className="bg-ink px-6 py-10 text-center">
          <dt className="sr-only">{i.label}</dt>
          <dd className="font-display text-6xl font-light text-gold-gradient md:text-7xl">
            <CountUp value={i.value} />
          </dd>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-ivory-100/50">{i.label}</p>
        </div>
      ))}
    </dl>
  );
}
