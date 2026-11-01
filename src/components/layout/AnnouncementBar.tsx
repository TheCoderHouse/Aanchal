"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { announcements } from "@/data/navigation";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative z-50 h-9 overflow-hidden bg-wine-800 text-center text-[0.55rem] uppercase tracking-[0.18em] text-gold-200 sm:text-[0.65rem] sm:tracking-[0.25em]">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="absolute inset-0 grid place-items-center truncate whitespace-nowrap px-4"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {announcements[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
