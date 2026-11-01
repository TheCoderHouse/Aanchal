"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEscape } from "@/hooks/useEscape";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  label?: string;
};

export function Modal({ open, onClose, children, className, label = "Dialog" }: ModalProps) {
  useScrollLock(open);
  useEscape(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[85] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <motion.button
            aria-label="Close"
            className="absolute inset-0 bg-ink/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "relative max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-gold-500/20 bg-wine-950 shadow-2xl",
              className,
            )}
            initial={{ opacity: 0, y: 40, scale: 0.96, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1200 }}
            data-lenis-prevent
          >
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink/60 text-ivory-100 transition duration-500 hover:rotate-90 hover:text-gold-300"
            >
              <X size={16} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
