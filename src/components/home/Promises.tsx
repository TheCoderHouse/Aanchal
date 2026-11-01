import { RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/RevealText";

const items = [
  { icon: ShieldCheck, title: "Silk Mark certified", text: "Every silk saree is tested and tagged." },
  { icon: Sparkles, title: "Direct from weavers", text: "Fair prices paid to 40+ weaver families." },
  { icon: Truck, title: "Free insured shipping", text: "Across India on orders above ₹5,000." },
  { icon: RotateCcw, title: "7-day easy returns", text: "Not in love? Send it back, no questions." },
];

export function Promises() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-20 md:px-8 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, text }, i) => (
        <Reveal key={title} delay={i * 0.08} className="flex flex-col items-start gap-4 sm:flex-row">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-500/30 text-gold-300">
            <Icon size={18} strokeWidth={1.4} />
          </span>
          <div>
            <p className="font-display text-xl text-ivory-50">{title}</p>
            <p className="mt-1 text-sm text-ivory-100/50">{text}</p>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
