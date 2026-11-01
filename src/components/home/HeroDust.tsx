"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type Props = {
  /** Lamp position inside the hero, in px. Dust gathers in the light below it. */
  lamp: { x: number; y: number } | null;
};

/** Soft specks of gold dust drifting and twinkling in the lamp's light. Plain 2D canvas, no WebGL. */
export function HeroDust({ lamp }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const small = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !lamp) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles live in a cone under the lamp: most inside the beam, a few drifting further out
    const count = small ? 45 : 110;
    const spawn = (anywhere: boolean) => {
      const spread = Math.random() < 0.8 ? 0.45 : 1.2;
      const depth = Math.random();
      const yy = anywhere ? Math.random() : 1.05;
      return {
        x: lamp.x + (Math.random() - 0.5) * h * spread * (0.3 + yy),
        y: lamp.y + yy * (h - lamp.y),
        r: 0.4 + depth * 1.6,
        vy: -(0.04 + depth * 0.18),
        vx: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.6 + Math.random() * 1.6,
      };
    };
    const dots = Array.from({ length: count }, () => spawn(true));

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(now - last, 50) / 16.7;
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (!reduceMotion) {
          d.y += d.vy * dt;
          d.x += (d.vx + Math.sin(now / 2400 + d.phase) * 0.05) * dt;
        }
        if (d.y < lamp.y + 10) dots[i] = spawn(false);
        // Brighter near the centre of the beam
        const beam = Math.max(0, 1 - Math.abs(d.x - lamp.x) / (h * 0.55));
        const alpha = (0.25 + 0.75 * beam) * (0.45 + 0.55 * Math.sin(now / 1000 * d.twinkle + d.phase) ** 2);
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3);
        g.addColorStop(0, `rgba(255, 236, 196, ${alpha})`);
        g.addColorStop(1, "rgba(230, 200, 130, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [lamp, reduceMotion, small]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
