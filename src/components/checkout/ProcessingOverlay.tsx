"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const messages = ["Securing your payment", "Reserving your saree", "Wrapping it with care"];

/** Full-screen loom animation while the (pretend) order is placed. */
export function ProcessingOverlay({ show }: { show: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!show) return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, messages.length - 1)), 1100);
    return () => {
      clearInterval(t);
      setStep(0);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center bg-ink/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center">
            {/* Warp threads with a gold weft thread weaving through them */}
            <svg width="180" height="120" viewBox="0 0 180 120" aria-hidden>
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={i} x1={10 + i * 16} y1="0" x2={10 + i * 16} y2="120" stroke="var(--color-ivory-100)" strokeOpacity="0.15" />
              ))}
              {[30, 60, 90].map((y, row) => (
                <motion.path
                  key={y}
                  d={`M0 ${y} ${Array.from({ length: 11 }, (_, i) => `Q ${10 + i * 16} ${y + (i % 2 ? -7 : 7)} ${18 + i * 16} ${y}`).join(" ")}`}
                  fill="none"
                  stroke="var(--color-gold-400)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: row * 0.8, ease: "easeInOut" }}
                />
              ))}
            </svg>
            <div className="mt-8 h-8 overflow-hidden text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  className="font-display text-2xl italic text-ivory-50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {messages[step]}…
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-3 text-[0.6rem] uppercase tracking-[0.3em] text-ivory-100/40">Please don&apos;t close this page</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
