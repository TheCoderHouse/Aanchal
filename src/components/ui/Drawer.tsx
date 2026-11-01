"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEscape } from "@/hooks/useEscape";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function Drawer({ open, onClose, side = "right", title, children, footer, className }: DrawerProps) {
  useScrollLock(open);
  useEscape(open, onClose);
  const from = side === "right" ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
          <motion.button
            aria-label="Close"
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <motion.aside
            className={cn(
              "absolute top-0 flex h-full w-full max-w-md flex-col border-gold-500/15 bg-wine-950",
              side === "right" ? "right-0 border-l" : "left-0 border-r",
              className,
            )}
            initial={{ x: from }}
            animate={{ x: 0 }}
            exit={{ x: from }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
          >
            <header className="flex items-center justify-between border-b border-ivory-100/10 px-6 py-5">
              <div className="font-display text-2xl text-ivory-50">{title}</div>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="grid h-10 w-10 place-items-center rounded-full border border-ivory-100/15 text-ivory-100 transition hover:rotate-90 hover:border-gold-400 hover:text-gold-300 duration-500"
              >
                <X size={16} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer && <footer className="border-t border-ivory-100/10 px-6 py-5">{footer}</footer>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
