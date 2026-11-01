"use client";

import { motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tab = { id: string; label: string; content: ReactNode };

export function Tabs({ tabs, className }: { tabs: Tab[]; className?: string }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const layoutId = useId();
  const current = tabs.find((t) => t.id === active);

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-8 border-b border-ivory-100/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            onClick={() => setActive(t.id)}
            className={cn(
              "relative pb-3 text-xs uppercase tracking-[0.2em] transition-colors duration-300",
              t.id === active ? "text-gold-300" : "text-ivory-100/50 hover:text-ivory-100",
            )}
          >
            {t.label}
            {t.id === active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-x-0 -bottom-px h-px bg-gold-400"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </button>
        ))}
      </div>
      <motion.div
        key={active}
        role="tabpanel"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-6 text-sm leading-relaxed text-ivory-100/70"
      >
        {current?.content}
      </motion.div>
    </div>
  );
}
