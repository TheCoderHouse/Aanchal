"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { getCollection } from "@/data/collections";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const LoomCanvas = dynamic(() => import("@/components/three/LoomCanvas"), { ssr: false });

const steps = [
  { title: "Lift the shed", text: "Foot pedals raise half the silk threads and lower the rest, opening a narrow tunnel." },
  { title: "Throw the shuttle", text: "The wooden shuttle flies through the tunnel, laying a single thread of gold zari." },
  { title: "Beat it in", text: "The beater swings forward and packs the new thread tight. Then it all begins again." },
];

const weaves = ["banarasi", "kanjeevaram", "paithani"].map((s) => getCollection(s)!);

/** The live 3D loom with the weaving steps lighting up in time. */
export function LoomSection() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [weave, setWeave] = useState(0);
  const lite = useMediaQuery("(max-width: 767px)");
  const w = weaves[weave];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden border border-gold-500/15 bg-[radial-gradient(ellipse_at_50%_30%,var(--color-wine-800),var(--color-ink)_70%)]">
        <LoomCanvas colorway={w.palette} motif={w.motif} onPhase={setPhase} lite={lite} />
        <span className="absolute left-4 top-4 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/60">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-wine-500" /> Live on the loom
        </span>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {weaves.map((c, i) => (
            <button
              key={c.slug}
              onClick={() => setWeave(i)}
              aria-pressed={weave === i}
              className={cn(
                "glass flex items-center gap-2 border px-3 py-1.5 text-[0.65rem] transition",
                weave === i ? "border-gold-400 text-ivory-50" : "border-ivory-100/15 text-ivory-100/55",
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: `linear-gradient(135deg, ${c.palette.base} 50%, ${c.palette.border} 50%)` }} />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={cn(
              "relative border-l-2 py-4 pl-6 transition-all duration-500",
              phase === i ? "border-gold-400 bg-gold-400/[0.04]" : "border-ivory-100/10 opacity-50",
            )}
          >
            <p className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-gold-400">
              Step {i + 1}
              {phase === i && <motion.span layoutId="loom-step" className="h-px w-8 bg-gold-400" />}
            </p>
            <p className="mt-2 font-display text-2xl text-ivory-50">{s.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ivory-100/60">{s.text}</p>
          </li>
        ))}
        <li className="pt-4 text-sm text-ivory-100/45">
          A bridal Banarasi needs around <span className="text-gold-300">60,000</span> of these cycles.
        </li>
      </ol>
    </div>
  );
}
