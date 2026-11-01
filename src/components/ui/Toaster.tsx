"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useUI } from "@/store/ui";

export function Toaster() {
  const toasts = useUI((s) => s.toasts);
  const dismiss = useUI((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            onClick={() => dismiss(t.id)}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass pointer-events-auto flex items-start gap-3 border border-gold-500/25 px-4 py-3 text-left shadow-xl"
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-400 text-ink">
              <Check size={12} strokeWidth={3} />
            </span>
            <span>
              <span className="block text-sm text-ivory-50">{t.title}</span>
              {t.description && <span className="block text-xs text-ivory-100/55">{t.description}</span>}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
