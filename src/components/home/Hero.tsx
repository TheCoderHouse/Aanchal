"use client";

import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { HeroDust } from "./HeroDust";
import { Preloader } from "./Preloader";

const ease = [0.22, 1, 0.36, 1] as const;

// The hero photo and the points of interest in it, in the photo's own pixels
const PHOTO = { src: "/images/hero/weaver.png", w: 1672, h: 941 };
const LAMP = { x: 1148, y: 84 };
const SAREE_SPOT = { x: 1330, y: 735 };
const WEAVER_SPOT = { x: 960, y: 420 };
// Outline of the woven saree, for the zari shimmer
const SAREE_OUTLINE = [
  [1005, 515], [1230, 468], [1672, 610], [1672, 941], [1120, 941],
] as const;
// Where the photo is anchored (object-position), phones vs larger screens
const FOCUS_MOBILE = { x: 0.6, y: 0.5 };
const FOCUS_DESKTOP = { x: 0.85, y: 0.5 };
// Where the spotlight rests when the mouse isn't over the hero (% of the hero): on the weaver
const LIGHT_HOME = { x: 66, y: 46 };

const featured = getProduct("noor-kadhwa-banarasi")!;

type Mapper = { toPx: (ix: number, iy: number) => { x: number; y: number }; ready: boolean };

/**
 * Converts photo pixels to on-screen pixels inside an element where the
 * photo is drawn with object-fit: cover, so overlays stay pinned to the
 * lamp and the saree at any screen size.
 */
function useCoverMapping(ref: React.RefObject<HTMLDivElement | null>): Mapper {
  const [box, setBox] = useState<{ w: number; h: number; mobile: boolean } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight, mobile: window.innerWidth < 768 });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  const toPx = useCallback(
    (ix: number, iy: number) => {
      if (!box) return { x: 0, y: 0 };
      const focus = box.mobile ? FOCUS_MOBILE : FOCUS_DESKTOP;
      const scale = Math.max(box.w / PHOTO.w, box.h / PHOTO.h);
      const offX = (box.w - PHOTO.w * scale) * focus.x;
      const offY = (box.h - PHOTO.h * scale) * focus.y;
      return { x: offX + ix * scale, y: offY + iy * scale };
    },
    [box],
  );

  return { toPx, ready: !!box };
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);
  const ready = loaded && minTimeDone;
  const { toPx, ready: mapped } = useCoverMapping(layer);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), 1400);
    // If the photo is slow, don't hold the intro screen forever
    const fallback = setTimeout(() => setLoaded(true), 4000);
    return () => {
      clearTimeout(t);
      clearTimeout(fallback);
    };
  }, []);

  // Mouse parallax: the photo moves a little, the dust a little more (depth)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const photoX = useTransform(smx, (v) => v * -14);
  const photoY = useTransform(smy, (v) => v * -10);
  const dustX = useTransform(smx, (v) => v * -34);
  const dustY = useTransform(smy, (v) => v * -24);

  // Spotlight: the photo sits in shadow and a soft light follows the cursor
  const lx = useMotionValue(LIGHT_HOME.x);
  const ly = useMotionValue(LIGHT_HOME.y);
  const slx = useSpring(lx, { stiffness: 90, damping: 22, mass: 0.6 });
  const sly = useSpring(ly, { stiffness: 90, damping: 22, mass: 0.6 });
  const shade = useMotionTemplate`radial-gradient(circle 30vmax at ${slx}% ${sly}%, rgba(13,6,8,0) 0%, rgba(13,6,8,0.25) 45%, rgba(13,6,8,0.72) 100%)`;
  const glow = useMotionTemplate`radial-gradient(circle 18vmax at ${slx}% ${sly}%, rgba(255,214,150,0.22) 0%, rgba(255,200,130,0.06) 55%, transparent 100%)`;

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !section.current) return;
    const r = section.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
    lx.set(((e.clientX - r.left) / r.width) * 100);
    ly.set(((e.clientY - r.top) / r.height) * 100);
  };

  // Scroll: photo drifts down slower than the page, text lifts and fades
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const photoScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const lamp = mapped ? toPx(LAMP.x, LAMP.y) : null;
  const sareeSpot = toPx(SAREE_SPOT.x, SAREE_SPOT.y);
  const weaverSpot = toPx(WEAVER_SPOT.x, WEAVER_SPOT.y);
  const outline = SAREE_OUTLINE.map(([x, y]) => toPx(x, y))
    .map((p) => `${p.x}px ${p.y}px`)
    .join(", ");

  return (
    <section
      ref={section}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
        lx.set(LIGHT_HOME.x);
        ly.set(LIGHT_HOME.y);
      }}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink"
    >
      <Preloader done={ready} />

      {/* ── Photo and everything pinned to it ── */}
      <motion.div className="absolute inset-0" style={{ y: photoScrollY }}>
        <motion.div
          ref={layer}
          // Starts below the header so the brass lamp stays visible; zoom is anchored at the top
          className="absolute inset-x-[-3%] bottom-[-3%] top-[8%]"
          style={{ x: photoX, y: photoY, transformOrigin: "50% 0%" }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={ready ? { scale: [1.1, 1.0, 1.05], opacity: 1 } : {}}
          transition={{
            scale: { duration: 24, times: [0, 0.12, 1], ease: "easeOut", repeat: Infinity, repeatType: "mirror" },
            opacity: { duration: 1.4, ease },
          }}
        >
          <Image
            src={PHOTO.src}
            alt="A master weaver at a traditional handloom in Varanasi, weaving a wine and gold Banarasi silk saree under a brass lamp"
            fill
            preload
            quality={90}
            sizes="106vw"
            onLoad={() => setLoaded(true)}
            className="object-cover object-[60%_50%] md:object-[85%_50%]"
          />

          {mapped && lamp && (
            <>
              {/* Lamp glow with a gentle flicker */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
                style={{
                  left: lamp.x,
                  top: lamp.y + 10,
                  background: "radial-gradient(circle, rgba(255,214,150,0.55) 0%, rgba(255,190,110,0.18) 28%, transparent 62%)",
                }}
                animate={{ opacity: [0.85, 1, 0.9, 0.97, 0.82, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Faint beam of light */}
              <div
                aria-hidden
                className="pointer-events-none absolute -translate-x-1/2 opacity-[0.18] mix-blend-screen"
                style={{
                  left: lamp.x,
                  top: lamp.y + 12,
                  width: "70vh",
                  height: "80vh",
                  clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)",
                  background: "linear-gradient(to bottom, rgba(255,214,150,0.7), rgba(255,200,130,0.12) 55%, transparent 85%)",
                  filter: "blur(18px)",
                }}
              />
              {/* Zari shimmer: a band of light passing across the saree now and then */}
              <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block" style={{ clipPath: `polygon(${outline})` }}>
                <motion.div
                  className="absolute inset-y-0 w-[30%] mix-blend-color-dodge"
                  style={{
                    background: "linear-gradient(100deg, transparent 0%, rgba(255,226,160,0.35) 50%, transparent 100%)",
                  }}
                  initial={{ left: "-30%" }}
                  animate={ready ? { left: ["-30%", "110%"] } : {}}
                  transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 4.5, delay: 2 }}
                />
              </div>

              {/* Hotspots (larger screens) */}
              <div className="hidden md:block">
                <Hotspot at={sareeSpot} delay={2.2} show={ready} label="Shop this saree">
                  <Link href={`/product/${featured.slug}`} className="group flex w-64 gap-3">
                    <span className="relative h-24 w-16 shrink-0 overflow-hidden">
                      <ProductImage product={featured} uid="hero-hotspot" sizes="64px" />
                    </span>
                    <span className="flex flex-col justify-center">
                      <span className="text-[0.55rem] uppercase tracking-[0.25em] text-gold-500">On the loom</span>
                      <span className="font-display text-lg leading-tight text-ivory-50">{featured.name}</span>
                      <span className="text-xs text-ivory-100/60">{formatPrice(featured.price)}</span>
                      <span className="mt-1 flex items-center gap-1 text-[0.6rem] uppercase tracking-[0.2em] text-gold-300 group-hover:text-gold-200">
                        Shop this saree <ArrowUpRight size={11} />
                      </span>
                    </span>
                  </Link>
                </Hotspot>
                <Hotspot at={weaverSpot} delay={2.5} show={ready} label="Meet the weaver">
                  <Link href="/about#weavers" className="group block w-56">
                    <span className="text-[0.55rem] uppercase tracking-[0.25em] text-gold-500">The hands behind it</span>
                    <span className="mt-1 block font-display text-lg leading-tight text-ivory-50">Ustad Rafiq Ansari</span>
                    <span className="block text-xs text-ivory-100/60">42 years at the loom, Varanasi</span>
                    <span className="mt-2 flex items-center gap-1 text-[0.6rem] uppercase tracking-[0.2em] text-gold-300 group-hover:text-gold-200">
                      Meet the weavers <ArrowUpRight size={11} />
                    </span>
                  </Link>
                </Hotspot>
              </div>
            </>
          )}
        </motion.div>

        {/* Dust floats in front of the photo and moves more with the mouse */}
        <motion.div
          className="pointer-events-none absolute inset-x-[-3%] bottom-[-3%] top-[8%]"
          style={{ x: dustX, y: dustY, transformOrigin: "50% 0%" }}
        >
          {ready && <HeroDust lamp={lamp} />}
        </motion.div>
      </motion.div>

      {/* Spotlight (larger screens): darkens the photo except where the cursor is, plus a warm glow there */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ background: shade }}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1.6, ease, delay: 0.6 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden mix-blend-soft-light md:block"
        style={{ background: glow }}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1.6, ease, delay: 0.6 }}
      />

      {/* Shading: blend the photo's top edge into the dark, and keep text readable */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-ink via-ink/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-ink/85 via-ink/35 to-transparent md:block" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-ink via-ink/85 to-transparent md:hidden" />

      {/* ── Text ── */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-12 md:justify-center md:px-8 md:pb-0"
      >
        <div className="pointer-events-auto max-w-xl">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            Handwoven in India · Since 1962
          </motion.p>

          <h1 className="mt-4 font-display text-[3.2rem] font-light leading-[0.95] text-ivory-50 sm:text-7xl md:mt-5 lg:text-[6.2rem]">
            {["Draped in", "heritage,", "woven in gold"].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={i === 2 ? "text-gold-gradient block italic" : "block"}
                  initial={{ y: "105%" }}
                  animate={ready ? { y: "0%" } : {}}
                  transition={{ duration: 1.1, ease, delay: 0.4 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-6 hidden max-w-md text-[0.95rem] leading-relaxed text-ivory-100/70 sm:block"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.8 }}
          >
            Heirloom sarees from master weavers across India. Every thread of zari placed by hand, every piece one of a
            kind.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-1 md:mt-8 md:gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.95 }}
          >
            <Button href="/shop" size="lg" className="max-sm:h-12 max-sm:px-6">
              Shop the collection <ArrowRight size={14} />
            </Button>
            <Button href="/about" variant="ghost" size="lg" className="px-4 max-sm:hidden">
              Our craft
            </Button>
          </motion.div>

          {/* Editorial caption for the photo */}
          <motion.p
            className="mt-10 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-ivory-100/45"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.3 }}
          >
            <span className="h-px w-10 bg-gold-500" />
            Kadhwa Banarasi on the loom · Varanasi
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-ivory-100/50 md:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        Scroll to explore
        <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory-100/20">
          <ArrowDown size={14} className="animate-float" />
        </span>
      </motion.div>
    </section>
  );
}

/** Pulsing gold dot that reveals a small card on hover or focus. */
function Hotspot({
  at,
  delay,
  show,
  label,
  children,
}: {
  at: { x: number; y: number };
  delay: number;
  show: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="absolute z-10"
      style={{ left: at.x, top: at.y }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={show ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.6, ease }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="relative grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-gold-300/40 [animation-duration:2.4s]" />
        <span className="absolute inset-1 rounded-full border border-gold-200/80 bg-ink/30 backdrop-blur-sm" />
        <span className="relative h-2 w-2 rounded-full bg-gold-200" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="glass absolute bottom-6 left-1/2 -translate-x-1/2 border border-gold-500/30 p-3 shadow-2xl"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.3, ease }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
