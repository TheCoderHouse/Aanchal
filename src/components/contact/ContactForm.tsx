"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const topics = ["An order", "Bridal & custom", "Returns", "Saree care", "Something else"];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [topic, setTopic] = useState(topics[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Please enter a valid email";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = "Enter a 10-digit mobile number";
    if (form.message.trim().length < 10) errs.message = "Tell us a little more (at least 10 characters)";
    setErrors(errs);
    if (!Object.keys(errs).length) setSent(true);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid min-h-[420px] place-items-center border border-gold-500/20 p-10 text-center"
        >
          <div>
            <motion.span
              className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-400 text-ink"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
            >
              <Check size={26} strokeWidth={3} />
            </motion.span>
            <p className="mt-6 font-display text-4xl text-ivory-50">Thank you, {form.name.split(" ")[0]}</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-ivory-100/55">
              We&apos;ve received your message about “{topic.toLowerCase()}” and will reply to {form.email} within a day.
            </p>
            <Button
              variant="ghost"
              className="mt-6"
              onClick={() => {
                setSent(false);
                setForm({ name: "", email: "", phone: "", message: "" });
              }}
            >
              Send another message
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="space-y-7" noValidate>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ivory-100/50">I&apos;m writing about</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  aria-pressed={topic === t}
                  className={cn(
                    "border px-4 py-2 text-xs transition",
                    topic === t ? "border-gold-400 bg-gold-400/10 text-gold-200" : "border-ivory-100/15 text-ivory-100/60 hover:text-ivory-100",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
            <Input label="Your name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <Input
              label="Mobile (optional)"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
              error={errors.phone}
              className="sm:col-span-2"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="text-xs uppercase tracking-[0.2em] text-ivory-100/50">
              Your message
            </label>
            <textarea
              id="contact-message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              aria-invalid={!!errors.message || undefined}
              className="mt-3 w-full resize-none border border-ivory-100/15 bg-transparent p-4 text-sm text-ivory-50 outline-none focus:border-gold-400 aria-[invalid]:border-wine-500"
            />
            {errors.message && <p className="mt-1 text-xs text-wine-500">{errors.message}</p>}
          </div>
          <Button type="submit" size="lg">
            <Send size={13} /> Send message
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
