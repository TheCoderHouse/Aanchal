"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Item = { id: string; title: string; content: ReactNode };

export function Accordion({ items, defaultOpen }: { items: Item[]; defaultOpen?: string }) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null);
  return (
    <div className="divide-y divide-ivory-100/10 border-y border-ivory-100/10">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              className="flex w-full items-center justify-between py-5 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className="text-sm uppercase tracking-[0.18em] text-ivory-100">{item.title}</span>
              <Plus
                size={16}
                className={cn("text-gold-400 transition-transform duration-500 ease-silk", isOpen && "rotate-45")}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-sm leading-relaxed text-ivory-100/65">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
