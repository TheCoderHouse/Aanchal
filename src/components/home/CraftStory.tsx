"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    title: "The silk",
    text: "Mulberry silk from Karnataka, reeled by hand and twisted into yarn fine enough to pass through a ring.",
    stat: "3 kg", statLabel: "of silk per bridal saree",
  },
  {
    title: "The colour",
    text: "Yarn is dyed in small batches, then dried in the sun. Colours are matched by eye, as they have been for generations.",
    stat: "21", statLabel: "days of dyeing and drying",
  },
  {
    title: "The loom",
    text: "On a pit loom, the weaver and an assistant work in rhythm, lifting thousands of threads for every row of the pattern.",
    stat: "6", statLabel: "weeks on the loom",
  },
  {
    title: "The zari",
    text: "Silver thread dipped in gold is woven in by hand, motif by motif, so the saree catches light like jewellery.",
    stat: "1,200 m", statLabel: "of real zari thread",
  },
];


/** Sticky saree visual on one side, steps on the other, joined by a gold thread that draws as you scroll. */
export function CraftStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const draw = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const zoom = useTransform(scrollYProgress, [0, 1], [1.05, 1.5]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <section ref={ref} className="relative bg-wine-950 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 md:grid-cols-2 md:px-8">
        {/* Sticky visual */}
        <div className="md:sticky md:top-28 md:h-[calc(100vh-10rem)]">
          <div className="relative h-[60vh] overflow-hidden md:h-full">
            <motion.div style={{ scale: zoom, rotate }} className="absolute inset-0">
              <Image src="/images/craft-zari.jpg" alt="Gold zari threads being woven into wine-red silk on a handloom" fill sizes="(min-width: 768px) 50vw, 100vw" quality={90} className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-transparent to-wine-950/40" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="eyebrow">Real zari, woven by hand</p>
              <p className="mt-2 font-display text-3xl text-ivory-50">Silver thread, dipped in gold</p>
            </div>
          </div>
        </div>

        {/* Steps with the drawn thread */}
        <div className="relative">
          <p className="eyebrow">Our craft</p>
          <h2 className="mt-5 font-display text-5xl font-light leading-[1.02] text-ivory-50 md:text-6xl">
            Six weeks. <br />
            <span className="text-gold-gradient italic">Two hands.</span> One saree.
          </h2>

          <div className="relative mt-16 pl-12">
            <svg className="absolute left-3 top-0 h-full w-6 overflow-visible" viewBox="0 0 24 1000" preserveAspectRatio="none" aria-hidden>
              <path d="M12 0 C 24 120, 0 240, 12 360 S 24 620, 12 740 S 0 900, 12 1000" stroke="var(--color-ivory-100)" strokeOpacity="0.08" fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <motion.path
                d="M12 0 C 24 120, 0 240, 12 360 S 24 620, 12 740 S 0 900, 12 1000"
                stroke="var(--color-gold-400)"
                fill="none"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: draw }}
              />
            </svg>

            <ol className="space-y-24 md:space-y-36">
              {steps.map((s, i) => (
                <motion.li
                  key={s.title}
                  className="relative"
                  initial={{ opacity: 0.25 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ margin: "-40% 0px -40% 0px" }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="absolute -left-12 top-1 grid h-6 w-6 place-items-center rounded-full border border-gold-400 bg-wine-950 text-[0.6rem] text-gold-300">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-3xl text-ivory-50 md:text-4xl">{s.title}</h3>
                  <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ivory-100/60">{s.text}</p>
                  <p className="mt-6 flex items-baseline gap-3">
                    <span className="font-display text-5xl text-gold-300">{s.stat}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-ivory-100/45">{s.statLabel}</span>
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>

          <Button href="/about" variant="outline" className="ml-12 mt-20">
            Meet the weavers
          </Button>
        </div>
      </div>
    </section>
  );
}
