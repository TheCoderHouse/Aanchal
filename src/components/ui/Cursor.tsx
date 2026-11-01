"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const TRAIL_POINTS = 26;

/**
 * Custom pointer for desktop:
 * - a small gold diamond at the pointer, trailing a fading "zari thread"
 * - over links/buttons the diamond fills with gold
 * - over elements with data-cursor="..." a garment swing-tag hangs from
 *   the pointer and sways with mouse movement
 */
export function Cursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  // Horizontal speed drives the tag's swing
  const velocity = useMotionValue(0);
  const swing = useSpring(
    useTransform(velocity, [-1.5, 0, 1.5], [-28, 0, 28], { clamp: true }),
    { stiffness: 140, damping: 9, mass: 0.6 },
  );

  // Pointer tracking + target detection
  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");
    let lastX = 0;
    let lastT = performance.now();

    const move = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      velocity.set((e.clientX - lastX) / dt);
      lastX = e.clientX;
      lastT = now;
      x.set(e.clientX);
      y.set(e.clientY);

      const el = e.target as HTMLElement | null;
      setLabel(el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null);
      setHover(!!el?.closest("a, button, [role=button], input, label, select, textarea"));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    // Let the swing settle when the mouse stops
    const settle = setInterval(() => {
      if (performance.now() - lastT > 60) velocity.set(0);
    }, 60);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      clearInterval(settle);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [fine, x, y, velocity]);

  // Zari thread trail on a canvas
  useEffect(() => {
    if (!fine || reduceMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: TRAIL_POINTS }, () => ({ x: x.get(), y: y.get() }));
    let raf = 0;

    const draw = () => {
      // Each point eases toward the one ahead of it, like a thread being pulled
      pts[0].x = x.get();
      pts[0].y = y.get();
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.42;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.42;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = "round";
      for (let i = 1; i < pts.length - 1; i++) {
        const t = 1 - i / pts.length; // 1 at the head, 0 at the tail
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        const pmx = (pts[i - 1].x + pts[i].x) / 2;
        const pmy = (pts[i - 1].y + pts[i].y) / 2;
        ctx.beginPath();
        ctx.moveTo(pmx, pmy);
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
        ctx.lineWidth = 0.4 + t * 1.8;
        // Alternate tones give a twisted-thread shimmer
        ctx.strokeStyle = i % 3 === 0 ? `rgba(241,227,192,${t * 0.9})` : `rgba(214,179,108,${t * 0.85})`;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [fine, reduceMotion, x, y]);

  if (!fine) return null;

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[199] h-full w-full" />

      {/* Diamond pointer */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[201]"
        style={{ x, y }}
      >
        <motion.span
          className="absolute block border border-gold-300"
          style={{ left: -5, top: -5, width: 10, height: 10 }}
          animate={{
            rotate: hover || label ? 0 : 45,
            scale: pressed ? 0.6 : hover ? 1.5 : 1,
            backgroundColor: hover || label ? "rgba(230,207,150,1)" : "rgba(230,207,150,0)",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
        />
      </motion.div>

      {/* Swing tag hanging from the pointer */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200]"
        style={{ x, y }}
      >
        <AnimatePresence>
          {label && (
            <motion.div
              key="tag"
              className="absolute left-0 top-0"
              style={{ rotate: swing, transformOrigin: "0px 0px" }}
              initial={{ opacity: 0, scaleY: 0.2 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.2 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* String */}
              <span className="absolute left-0 top-0 block h-7 w-px -translate-x-1/2 bg-gold-300/90" />
              {/* Tag body with clipped top corners and an eyelet */}
              <div
                className="absolute top-7 -translate-x-1/2 bg-ivory-100 px-3.5 pb-2.5 pt-4 text-center shadow-[0_12px_30px_-10px_rgba(0,0,0,0.7)]"
                style={{ clipPath: "polygon(22% 0, 78% 0, 100% 18%, 100% 100%, 0 100%, 0 18%)" }}
              >
                <span className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-gold-600 bg-ink" />
                <span className="block whitespace-nowrap font-display text-base italic leading-none text-wine-800">
                  {label}
                </span>
                <span className="mt-1.5 block text-[0.45rem] uppercase tracking-[0.3em] text-gold-700">Aanchal</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
