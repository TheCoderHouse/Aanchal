"use client";

import { AnimatePresence, motion } from "motion/react";

const ease = [0.65, 0, 0.35, 1] as const;

/** Intro curtain: the wordmark rises letter by letter, a gold thread draws, then the curtain lifts. */
export function Preloader({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[150] grid place-items-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.1, ease }}
        >
          <div className="flex flex-col items-center">
            <div className="flex overflow-hidden font-display text-5xl font-light tracking-[0.3em] text-ivory-50 md:text-7xl">
              {"AANCHAL".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.06 }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>
            <div className="mt-6 h-px w-48 overflow-hidden bg-ivory-100/10">
              <motion.div
                className="h-full bg-gold-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: 1.4, ease }}
              />
            </div>
            <motion.p
              className="mt-4 text-[0.6rem] uppercase tracking-[0.5em] text-gold-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Weaving your experience
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
