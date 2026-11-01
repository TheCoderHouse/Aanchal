"use client";

import { AnimatePresence, motion } from "motion/react";
import { Banknote, Building2, CreditCard, Smartphone } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Input } from "@/components/ui/Input";
import { COD_FEE, type PaymentId } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";
import { CardPreview, type CardData } from "./CardPreview";

export type PaymentData = { upi: string; card: CardData; bank: string };
export const emptyPayment: PaymentData = { upi: "", card: { number: "", name: "", expiry: "", cvv: "" }, bank: "" };

const banks = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank", "Yes Bank"];
const upiApps = ["Google Pay", "PhonePe", "Paytm", "BHIM"];

export function validatePayment(method: PaymentId, d: PaymentData) {
  const e: Record<string, string> = {};
  if (method === "upi" && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(d.upi)) e.upi = "Enter a UPI ID like name@okbank";
  if (method === "card") {
    const digits = d.card.number.replace(/\D/g, "");
    if (digits.length < 15) e.number = "Enter the full card number";
    if (d.card.name.trim().length < 2) e.name = "Enter the name on the card";
    const [mm, yy] = d.card.expiry.split("/").map(Number);
    if (!mm || mm > 12 || !yy || yy < 26) e.expiry = "Enter a valid expiry (MM/YY)";
    if (!/^\d{3,4}$/.test(d.card.cvv)) e.cvv = "3 or 4 digits";
  }
  if (method === "netbanking" && !d.bank) e.bank = "Choose your bank";
  return e;
}

type Props = {
  method: PaymentId;
  onMethod: (m: PaymentId) => void;
  data: PaymentData;
  onData: (d: PaymentData) => void;
  errors: Record<string, string>;
};

export function PaymentStep({ method, onMethod, data, onData, errors }: Props) {
  const [cvvFocus, setCvvFocus] = useState(false);
  const setCard = (patch: Partial<CardData>) => onData({ ...data, card: { ...data.card, ...patch } });

  const options: { id: PaymentId; label: string; note: string; icon: typeof CreditCard; body: ReactNode }[] = [
    {
      id: "upi",
      label: "UPI",
      note: "Instant, no extra charges",
      icon: Smartphone,
      body: (
        <div>
          <div className="flex flex-wrap gap-2">
            {upiApps.map((app) => (
              <span key={app} className="border border-ivory-100/15 px-3 py-1.5 text-xs text-ivory-100/70">
                {app}
              </span>
            ))}
          </div>
          <Input
            label="UPI ID"
            className="mt-4"
            value={data.upi}
            onChange={(e) => onData({ ...data, upi: e.target.value.trim() })}
            error={errors.upi}
            hint="You'll approve the payment in your UPI app"
          />
        </div>
      ),
    },
    {
      id: "card",
      label: "Credit or debit card",
      note: "Visa, Mastercard, RuPay, Amex",
      icon: CreditCard,
      body: (
        <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
          <CardPreview card={data.card} flipped={cvvFocus} />
          <div className="grid grid-cols-2 gap-x-5 gap-y-5">
            <Input
              label="Card number"
              inputMode="numeric"
              autoComplete="cc-number"
              className="col-span-2"
              value={data.card.number}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                setCard({ number: digits.replace(/(.{4})/g, "$1 ").trim() });
              }}
              error={errors.number}
            />
            <Input
              label="Name on card"
              autoComplete="cc-name"
              className="col-span-2"
              value={data.card.name}
              onChange={(e) => setCard({ name: e.target.value.toUpperCase().slice(0, 26) })}
              error={errors.name}
            />
            <Input
              label="Expiry (MM/YY)"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={data.card.expiry}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                setCard({ expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d });
              }}
              error={errors.expiry}
            />
            <Input
              label="CVV"
              inputMode="numeric"
              autoComplete="cc-csc"
              type="password"
              value={data.card.cvv}
              onFocus={() => setCvvFocus(true)}
              onBlur={() => setCvvFocus(false)}
              onChange={(e) => setCard({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              error={errors.cvv}
            />
          </div>
        </div>
      ),
    },
    {
      id: "netbanking",
      label: "Net banking",
      note: "All major Indian banks",
      icon: Building2,
      body: (
        <div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {banks.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onData({ ...data, bank: b })}
                className={cn(
                  "border px-3 py-3 text-left text-xs transition",
                  data.bank === b ? "border-gold-400 bg-gold-400/10 text-ivory-50" : "border-ivory-100/15 text-ivory-100/65 hover:border-ivory-100/35",
                )}
              >
                {b}
              </button>
            ))}
          </div>
          {errors.bank && <p className="mt-2 text-xs text-wine-500">{errors.bank}</p>}
        </div>
      ),
    },
    {
      id: "cod",
      label: "Cash on delivery",
      note: `+${formatPrice(COD_FEE)} handling fee`,
      icon: Banknote,
      body: (
        <p className="text-sm leading-relaxed text-ivory-100/60">
          Pay in cash or by UPI when your saree arrives. For orders above ₹50,000 we&apos;ll call to confirm before
          dispatch.
        </p>
      ),
    },
  ];

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory-50 md:text-4xl">How would you like to pay?</h2>
      <div className="mt-10 space-y-3" role="radiogroup" aria-label="Payment method">
        {options.map((o) => {
          const active = method === o.id;
          return (
            <div key={o.id} className={cn("border transition-colors duration-500", active ? "border-gold-400/70 bg-gold-400/[0.03]" : "border-ivory-100/15")}>
              <button role="radio" aria-checked={active} onClick={() => onMethod(o.id)} className="flex w-full items-center gap-4 p-5 text-left">
                <span className={cn("h-4 w-4 shrink-0 rounded-full border", active ? "border-gold-400 bg-gold-400 ring-2 ring-inset ring-ink" : "border-ivory-100/30")} />
                <o.icon size={18} strokeWidth={1.4} className={active ? "text-gold-300" : "text-ivory-100/50"} />
                <span className="flex-1">
                  <span className="block text-sm text-ivory-50">{o.label}</span>
                  <span className="block text-xs text-ivory-100/45">{o.note}</span>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {active && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 md:pl-[4.25rem]">{o.body}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
