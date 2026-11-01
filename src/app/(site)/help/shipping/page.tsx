import type { Metadata } from "next";
import { Gift, Package, ShieldCheck, Truck } from "lucide-react";
import { shippingZones } from "@/data/help";

export const metadata: Metadata = { title: "Shipping" };

const notes = [
  { icon: Package, title: "Packed by hand", text: "Every saree is folded in muslin and placed in a keepsake box with its weaver's card." },
  { icon: ShieldCheck, title: "Fully insured", text: "Your order is insured until it's in your hands. Damaged or lost parcels are replaced." },
  { icon: Truck, title: "Live tracking", text: "You'll get tracking links on WhatsApp and email the moment your saree leaves our studio." },
  { icon: Gift, title: "Gifting", text: "Add a silk potli gift wrap and a handwritten note at checkout. Prices are never included." },
];

export default function ShippingPage() {
  return (
    <>
      <h1 className="font-display text-5xl font-light text-ivory-50 md:text-7xl">Shipping</h1>
      <p className="mt-4 max-w-xl text-ivory-100/55">
        Orders are dispatched within 2 business days from our Varanasi studio. Free insured shipping across India on orders
        above ₹5,000.
      </p>

      <div className="mt-12 overflow-x-auto border border-gold-500/15">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-wine-950 text-[0.65rem] uppercase tracking-[0.2em] text-gold-400">
            <tr>
              <th className="px-5 py-4 font-medium">Destination</th>
              <th className="px-5 py-4 font-medium">Standard</th>
              <th className="px-5 py-4 font-medium">Express</th>
              <th className="px-5 py-4 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-100/10">
            {shippingZones.map((z) => (
              <tr key={z.zone} className="transition-colors hover:bg-ivory-100/[0.02]">
                <td className="px-5 py-4 text-ivory-50">{z.zone}</td>
                <td className="px-5 py-4 text-ivory-100/70">{z.standard}</td>
                <td className="px-5 py-4 text-ivory-100/70">{z.express}</td>
                <td className="px-5 py-4 text-ivory-100/70">{z.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ivory-100/40">Express costs ₹350 in India. Bridal and custom pieces have their own timelines.</p>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {notes.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-500/30 text-gold-300">
              <Icon size={17} strokeWidth={1.4} />
            </span>
            <div>
              <p className="font-display text-xl text-ivory-50">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ivory-100/55">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
