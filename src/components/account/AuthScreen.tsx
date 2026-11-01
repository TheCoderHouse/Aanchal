"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Mail, Smartphone } from "lucide-react";
import { useRef, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getProduct } from "@/data/products";
import { cn } from "@/lib/utils";
import { findKnown, useAuth } from "@/store/auth";
import { useUI } from "@/store/ui";

const ease = [0.22, 1, 0.36, 1] as const;
const DEMO_OTP = "123456";
const morPankh = getProduct("mor-pankh-paithani")!;

function today() {
  return new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function nameFromEmail(email: string) {
  const base = email.split("@")[0].replace(/[._\d]+/g, " ").trim();
  return base ? base.replace(/\b\w/g, (c) => c.toUpperCase()) : "Patron";
}

/** Sign in / create account. Demo only: any password works, the OTP is 123456. */
export function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [method, setMethod] = useState<"email" | "phone">("email");

  return (
    <div className="grid min-h-[80vh] overflow-hidden border border-gold-500/15 lg:grid-cols-2">
      {/* Visual */}
      <div className="relative hidden lg:block">
        <motion.div className="absolute inset-0" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2, ease }}>
          <ProductImage product={morPankh} view="pallu" uid="auth-visual" sizes="50vw" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="absolute inset-x-10 bottom-10">
          <p className="eyebrow">The Aanchal Circle</p>
          <p className="mt-4 font-display text-5xl font-light leading-tight text-ivory-50">
            Early access to new weaves, <span className="text-gold-gradient italic">private previews</span> and saree care for life.
          </p>
        </div>
      </div>

      {/* Forms */}
      <div className="flex flex-col justify-center bg-wine-950 px-6 py-12 md:px-14">
        <div className="mx-auto w-full max-w-md">
          <div className="flex gap-8 border-b border-ivory-100/10" role="tablist">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={cn("relative pb-3 font-display text-2xl transition-colors", mode === m ? "text-ivory-50" : "text-ivory-100/40 hover:text-ivory-100")}
              >
                {m === "signin" ? "Sign in" : "Create account"}
                {mode === m && <motion.span layoutId="auth-tab" className="absolute inset-x-0 -bottom-px h-px bg-gold-400" />}
              </button>
            ))}
          </div>

          {mode === "signin" && (
            <div className="mt-8 grid grid-cols-2 gap-2">
              {([
                ["email", "Email", Mail],
                ["phone", "Phone (OTP)", Smartphone],
              ] as const).map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  className={cn(
                    "flex items-center justify-center gap-2 border py-2.5 text-xs uppercase tracking-[0.15em] transition",
                    method === id ? "border-gold-400 text-gold-200" : "border-ivory-100/15 text-ivory-100/50 hover:text-ivory-100",
                  )}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${method}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
              className="mt-8"
            >
              {mode === "signup" ? <SignUpForm /> : method === "email" ? <EmailSignIn onSwitch={() => setMode("signup")} /> : <PhoneSignIn />}
            </motion.div>
          </AnimatePresence>

          <p className="mt-10 text-center text-[0.7rem] leading-relaxed text-ivory-100/35">
            Demo store: accounts are saved only in this browser. Any password works.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmailSignIn({ onSwitch }: { onSwitch: () => void }) {
  const signIn = useAuth((s) => s.signIn);
  const known = useAuth((s) => s.known);
  const toast = useUI((s) => s.toast);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
        if (password.length < 6) errs.password = "At least 6 characters";
        setErrors(errs);
        if (Object.keys(errs).length) return;
        const existing = findKnown(known, { email });
        const name = existing?.name ?? nameFromEmail(email);
        signIn({ name, email, phone: existing?.phone ?? "", memberSince: existing?.memberSince ?? today() });
        toast(`Welcome back, ${name.split(" ")[0]}`);
      }}
    >
      <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <Input label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      <div className="flex justify-between text-xs">
        <button type="button" className="text-ivory-100/50 hover:text-gold-300">Forgot password?</button>
        <button type="button" onClick={onSwitch} className="text-gold-300 hover:text-gold-200">New here? Create an account</button>
      </div>
      <Button type="submit" size="lg" className="w-full">
        Sign in <ArrowRight size={14} />
      </Button>
    </form>
  );
}

function SignUpForm() {
  const signIn = useAuth((s) => s.signIn);
  const toast = useUI((s) => s.toast);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (form.name.trim().length < 2) errs.name = "Enter your name";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
        if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = "Enter a 10-digit mobile number";
        if (form.password.length < 6) errs.password = "At least 6 characters";
        setErrors(errs);
        if (Object.keys(errs).length) return;
        signIn({ name: form.name.trim(), email: form.email, phone: form.phone, memberSince: today() });
        toast("Welcome to the Aanchal Circle", "You've earned 500 welcome points");
      }}
    >
      <Input label="Full name" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
      <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
      <Input
        label="Mobile (optional)"
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
        error={errors.phone}
      />
      <Input label="Create password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} error={errors.password} />
      <Button type="submit" size="lg" className="w-full">
        Create account <ArrowRight size={14} />
      </Button>
    </form>
  );
}

function PhoneSignIn() {
  const signIn = useAuth((s) => s.signIn);
  const known = useAuth((s) => s.known);
  const toast = useUI((s) => s.toast);
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const verify = (code: string) => {
    if (code !== DEMO_OTP) {
      setError("That code isn't right. Use 123456 for the demo.");
      return;
    }
    const existing = findKnown(known, { phone });
    const name = existing?.name ?? "Aanchal Patron";
    signIn({ name, email: existing?.email ?? "", phone, memberSince: existing?.memberSince ?? today() });
    toast(existing ? `Welcome back, ${name.split(" ")[0]}` : "Signed in with your phone");
  };

  if (!sent) {
    return (
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^[6-9]\d{9}$/.test(phone)) {
            setError("Enter a 10-digit mobile number");
            return;
          }
          setError(null);
          setSent(true);
          setTimeout(() => boxes.current[0]?.focus(), 350);
        }}
      >
        <div className="flex items-end gap-3">
          <span className="pb-2 text-ivory-100/60">+91</span>
          <Input
            label="Mobile number"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className="flex-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            error={error}
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Send OTP <ArrowRight size={14} />
        </Button>
      </form>
    );
  }

  return (
    <div>
      <p className="text-sm text-ivory-100/60">
        Enter the 6-digit code sent to <span className="text-ivory-50">+91 {phone}</span>{" "}
        <button onClick={() => setSent(false)} className="text-gold-300 underline underline-offset-4">
          change
        </button>
      </p>
      <div className="mt-6 flex justify-between gap-2">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              boxes.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            value={d}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(-1);
              const next = [...otp];
              next[i] = v;
              setOtp(next);
              setError(null);
              if (v && i < 5) boxes.current[i + 1]?.focus();
              if (next.every(Boolean)) verify(next.join(""));
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !otp[i] && i > 0) boxes.current[i - 1]?.focus();
            }}
            onPaste={(e) => {
              const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
              if (digits.length === 6) {
                e.preventDefault();
                setOtp(digits);
                verify(digits.join(""));
              }
            }}
            className={cn(
              "h-14 w-full border bg-transparent text-center font-display text-2xl text-ivory-50 outline-none transition focus:border-gold-400",
              error ? "border-wine-500" : d ? "border-gold-500/60" : "border-ivory-100/20",
            )}
          />
        ))}
      </div>
      {error && <p className="mt-3 text-xs text-wine-500">{error}</p>}
      <p className="mt-6 text-center text-xs text-ivory-100/45">
        Demo code: <span className="tracking-[0.3em] text-gold-300">{DEMO_OTP}</span>
      </p>
    </div>
  );
}
