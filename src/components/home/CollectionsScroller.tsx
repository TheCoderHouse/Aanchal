"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CollectionImage } from "@/components/product/CollectionImage";
import { collections } from "@/data/collections";
import { getProductsByCollection } from "@/data/products";
import type { Collection } from "@/data/types";

/**
 * Pinned section: scrolling down moves the collection cards sideways.
 */
export function CollectionsScroller() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // How far the track needs to travel = its width minus the screen width
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const progress = useTransform(smooth, [0, 1], ["0%", "100%"]);

  return (
    <section ref={section} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-6 px-4 md:gap-10 md:px-8">
          {/* Intro panel */}
          <div className="w-[80vw] shrink-0 sm:w-[60vw] md:w-[34vw]">
            <p className="eyebrow">The collections</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-[1] text-ivory-50 md:text-7xl">
              Six weaves, <span className="text-gold-gradient italic">six</span> stories
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory-100/55">
              From the ghats of Varanasi to the temples of Kanchipuram, each weave carries the hands and history of
              its region.
            </p>
            <p className="mt-10 text-[0.6rem] uppercase tracking-[0.3em] text-ivory-100/40">Keep scrolling →</p>
          </div>

          {collections.map((c, i) => (
            <CollectionCard key={c.slug} collection={c} index={i} progress={smooth} />
          ))}
        </motion.div>

        {/* Progress thread */}
        <div className="mx-4 mt-12 h-px bg-ivory-100/10 md:mx-8">
          <motion.div className="h-full bg-gold-400" style={{ width: progress }} />
        </div>
      </div>
    </section>
  );
}

function CollectionCard({
  collection,
  index,
  progress,
}: {
  collection: Collection;
  index: number;
  progress: MotionValue<number>;
}) {
  const count = getProductsByCollection(collection.slug).length;
  // Inner image drifts the opposite way for depth
  const imageX = useTransform(progress, [0, 1], ["-8%", "8%"]);

  return (
    <Link
      href={`/collections/${collection.slug}`}
      data-cursor="Explore"
      className="group relative block w-[72vw] shrink-0 sm:w-[46vw] md:w-[26vw]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-wine-900">
        <motion.div style={{ x: imageX }} className="absolute inset-[-10%]">
          <div className="h-full w-full transition-transform duration-[1.4s] ease-silk group-hover:scale-110">
            <CollectionImage collection={collection} uid={`col-${collection.slug}`} />
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
        <span className="absolute left-5 top-4 font-display text-6xl font-light text-ivory-50/25">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-ivory-100/30 text-ivory-50 transition duration-500 group-hover:rotate-45 group-hover:border-gold-300 group-hover:bg-gold-400 group-hover:text-ink">
          <ArrowUpRight size={16} />
        </span>
        <div className="absolute inset-x-5 bottom-5">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gold-300">{collection.region}</p>
          <h3 className="mt-2 font-display text-4xl text-ivory-50">{collection.name}</h3>
          <p className="mt-1 text-sm text-ivory-100/60">{collection.tagline}</p>
          <p className="mt-4 max-h-0 overflow-hidden text-xs text-ivory-100/50 opacity-0 transition-all duration-700 ease-silk group-hover:max-h-24 group-hover:opacity-100">
            {collection.story}
          </p>
          <p className="mt-3 text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/40">{count} sarees</p>
        </div>
      </div>
    </Link>
  );
}
