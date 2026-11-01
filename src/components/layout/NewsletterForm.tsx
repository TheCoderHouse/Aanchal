"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  return (
    <div className="mt-8 max-w-md">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 border-b border-gold-400/50 py-3 text-sm text-ivory-100/80"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-400 text-ink">
              <Check size={13} strokeWidth={3} />
            </span>
            You&apos;re on the list. Watch for our next private preview.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -8 }}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setState(/^\S+@\S+\.\S+$/.test(email) ? "done" : "error");
            }}
          >
            <div className="flex items-end gap-3 border-b border-ivory-100/20 pb-2 focus-within:border-gold-400">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="Your email address"
                aria-invalid={state === "error" || undefined}
                className="flex-1 bg-transparent py-2 text-sm text-ivory-50 outline-none placeholder:text-ivory-100/35"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-10 w-10 place-items-center rounded-full bg-gold-400 text-ink transition hover:bg-gold-300"
              >
                <ArrowRight size={16} />
              </button>
            </div>
            {state === "error" && <p className="mt-2 text-xs text-wine-500">Please enter a valid email address.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
