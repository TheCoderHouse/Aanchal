"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

export const tiers = [
  { name: "Resham", min: 0 },
  { name: "Zari", min: 1500 },
  { name: "Kundan", min: 5000 },
] as const;

export function tierFor(points: number) {
  const index = tiers.findLastIndex((t) => points >= t.min);
  return { tier: tiers[index], next: tiers[index + 1] };
}

/** Loyalty card that tilts towards the pointer with a moving gold sheen. */
export function CircleCard({ name, points, memberSince }: { name: string; points: number; memberSince: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [10, -10]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-14, 14]), { stiffness: 180, damping: 18 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(circle at ${gx} 30%, rgba(255,240,205,0.35), transparent 50%)`;
  const { tier, next } = tierFor(points);
  const progress = next ? (points - tier.min) / (next.min - tier.min) : 1;

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative aspect-[1.6] w-full overflow-hidden rounded-2xl border border-gold-400/40 p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] md:p-8"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#9c7a36_0%,#e6cf96_30%,#c09a4c_55%,#6f5626_100%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden>
          <defs>
            <pattern id="circle-jaal" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M18 0 L36 18 L18 36 L0 18 Z" fill="none" stroke="#160910" strokeWidth="0.8" />
              <circle cx="18" cy="18" r="2" fill="#160910" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circle-jaal)" />
        </svg>
        <motion.div className="absolute inset-0" style={{ background: sheen }} />
        <div className="relative flex h-full flex-col justify-between text-wine-900" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.35em]">The Aanchal Circle</p>
              <p className="mt-1 font-display text-3xl italic">{tier.name} member</p>
            </div>
            <span className="font-display text-lg tracking-[0.3em]">AANCHAL</span>
          </div>
          <div>
            <p className="font-display text-5xl leading-none">{points.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-[0.6rem] uppercase tracking-[0.3em]">Circle points</p>
          </div>
          <div>
            {next && (
              <div className="mb-3">
                <div className="h-1 bg-wine-900/20">
                  <div className="h-full bg-wine-900" style={{ width: `${progress * 100}%` }} />
                </div>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em]">
                  {(next.min - points).toLocaleString("en-IN")} points to {next.name}
                </p>
              </div>
            )}
            <div className="flex justify-between text-[0.65rem] uppercase tracking-[0.2em]">
              <span>{name}</span>
              <span>Since {memberSince}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
