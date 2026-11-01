import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Returns & exchanges" };

const steps = [
  { title: "Request a return", text: "From Account → Orders, or on WhatsApp, within 7 days of delivery. Tell us if you'd like a refund or an exchange." },
  { title: "We collect it", text: "A courier picks up the saree from your door within 2 days. Pack it in its original box with the tags on." },
  { title: "Quality check", text: "Our studio checks the saree is unworn and undamaged. This usually takes a day." },
  { title: "Refund or exchange", text: "Refunds reach your original payment method in 5–7 business days. Exchanges ship the same day." },
];

const rules = [
  ["Can be returned", "Unworn sarees with tags and the Silk Mark seal intact, within 7 days"],
  ["Final sale", "Sarees with fall & pico added, custom and bridal orders, sale items"],
  ["Free returns", "Pickups are free within India. International returns are at the customer's cost"],
];

export default function ReturnsPage() {
  return (
    <>
      <h1 className="font-display text-5xl font-light text-ivory-50 md:text-7xl">Returns & exchanges</h1>
      <p className="mt-4 max-w-xl text-ivory-100/55">
        Not in love with your saree? Return or exchange it within 7 days, no questions asked.
      </p>

      <ol className="relative mt-14 space-y-10 pl-12">
        <span aria-hidden className="absolute bottom-2 left-4 top-2 w-px bg-gradient-to-b from-gold-400 to-gold-700/20" />
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="absolute -left-12 top-0 grid h-8 w-8 place-items-center rounded-full border border-gold-400 bg-ink font-display text-gold-200">
              {i + 1}
            </span>
            <p className="font-display text-2xl text-ivory-50">{s.title}</p>
            <p className="mt-1 max-w-lg text-sm leading-relaxed text-ivory-100/60">{s.text}</p>
          </li>
        ))}
      </ol>

      <dl className="mt-16 divide-y divide-ivory-100/10 border-y border-ivory-100/10">
        {rules.map(([k, v]) => (
          <div key={k} className="grid gap-2 py-5 sm:grid-cols-[180px_1fr]">
            <dt className="text-xs uppercase tracking-[0.2em] text-gold-400">{k}</dt>
            <dd className="text-sm text-ivory-100/70">{v}</dd>
          </div>
        ))}
      </dl>

      <Button href="/account" variant="outline" className="mt-10">
        Start a return from your orders
      </Button>
    </>
  );
}
