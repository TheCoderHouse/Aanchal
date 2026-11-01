"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const motionTags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p };

type RevealTextProps = {
  text: string;
  as?: keyof typeof motionTags;
  className?: string;
  delay?: number;
  stagger?: number;
};

/** Words slide up from behind a mask when the text scrolls into view. */
export function RevealText({ text, as = "h2", className, delay = 0, stagger = 0.06 }: RevealTextProps) {
  const words = text.split(" ");
  // The wrapper watches the viewport (the masked words can't, since they start clipped)
  // and passes "shown" down to each word.
  const MotionTag = motionTags[as];
  return (
    <MotionTag
      className={cn("flex flex-wrap", className)}
      aria-label={text}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] last:mr-0">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", rotate: 4 },
              shown: { y: "0%", rotate: 0 },
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Generic fade-and-rise on scroll. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
