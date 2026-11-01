"use client";

import { motion } from "motion/react";
import { Check, Gift, MapPin, Package, Truck, Home, CreditCard } from "lucide-react";
import dynamic from "next/dynamic";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { products } from "@/data/products";
import { useMounted } from "@/hooks/useMounted";
import type { PaymentId } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";
import { useOrders } from "@/store/order";

const CelebrationCanvas = dynamic(() => import("@/components/three/CelebrationCanvas"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

const paymentLabel: Record<PaymentId, string> = {
  upi: "UPI",
  card: "Credit / debit card",
  netbanking: "Net banking",
  cod: "Cash on delivery",
};

const timeline = [
  { label: "Order placed", icon: Check },
  { label: "Packed by hand", icon: Package },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: Home },
];

export function OrderSuccessClient() {
  const mounted = useMounted();
  const order = useOrders((s) => s.lastOrder);

  if (!mounted) return <div className="min-h-[70vh]" />;

  if (!order) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4 text-center">
        <div>
          <p className="font-display text-5xl text-ivory-50">No recent order</p>
          <p className="mt-3 text-ivory-100/50">Orders you place will be confirmed here.</p>
          <Button href="/shop" className="mt-8">
            Explore the shop
          </Button>
        </div>
      </div>
    );
  }

  const firstName = order.address.name.split(" ")[0];
  const itemCount = order.lines.reduce((s, l) => s + l.qty, 0);

  return (
    <>
      {/* Celebration */}
      <section className="relative overflow-hidden px-4 pb-16 pt-16 text-center md:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine-700/30 blur-[120px]" />
          <CelebrationCanvas />
        </div>

        <div className="relative">
          <SuccessMark />
          <motion.p className="eyebrow mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            Order {order.id}
          </motion.p>
          <h1 className="mt-4 font-display text-5xl font-light leading-[1.02] text-ivory-50 md:text-7xl">
            {["Thank you,", `${firstName}.`].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={cn("block", i === 1 && "text-gold-gradient italic")}
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease, delay: 1 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mx-auto mt-6 max-w-lg text-ivory-100/65"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8, ease }}
          >
            Your {itemCount === 1 ? "saree is" : `${itemCount} sarees are`} being prepared by hand. We&apos;ve sent the details to{" "}
            <span className="text-ivory-50">{order.address.email}</span>.
          </motion.p>
          <motion.p
            className="mt-4 text-sm text-gold-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            Expected delivery: {order.eta}
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        {/* Status timeline */}
        <motion.ol
          className="relative mx-auto grid max-w-3xl grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8, ease }}
        >
          <span className="absolute left-[12.5%] right-[12.5%] top-5 h-px bg-ivory-100/10" aria-hidden />
          <motion.span
            className="absolute left-[12.5%] top-5 h-px bg-gold-400"
            initial={{ width: 0 }}
            animate={{ width: "12%" }}
            transition={{ delay: 2.2, duration: 1, ease }}
            aria-hidden
          />
          {timeline.map((t, i) => (
            <li key={t.label} className="relative flex flex-col items-center gap-3 text-center">
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full border",
                  i === 0 ? "border-gold-400 bg-gold-400 text-ink" : "border-ivory-100/20 bg-ink text-ivory-100/40",
                )}
              >
                <t.icon size={15} />
              </span>
              <span className={cn("text-[0.6rem] uppercase tracking-[0.2em]", i === 0 ? "text-ivory-50" : "text-ivory-100/40")}>
                {t.label}
              </span>
            </li>
          ))}
        </motion.ol>

        <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div>
            <p className="eyebrow mb-6">In your order</p>
            <ul className="divide-y divide-ivory-100/10 border-y border-ivory-100/10">
              {order.lines.map((l) => {
                const p = products.find((x) => x.id === l.productId);
                const cw = p?.colorways.find((c) => c.name === l.colorway) ?? p?.colorways[0];
                return (
                  <li key={`${l.productId}-${l.colorway}`} className="flex items-center gap-5 py-5">
                    <div className="h-28 w-20 shrink-0 overflow-hidden">
                      {p && cw && <ProductImage product={p} colorway={cw} uid={`os-${l.productId}-${l.colorway}`} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-2xl text-ivory-50">{l.name}</p>
                      <p className="mt-1 text-xs text-ivory-100/50">
                        {l.colorway} · Qty {l.qty}
                        {l.fallPico && " · Fall & pico"}
                      </p>
                    </div>
                    <span className="text-ivory-100">{formatPrice(l.unit * l.qty)}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <InfoCard icon={MapPin} title="Shipping to">
                <p className="text-ivory-50">{order.address.name}</p>
                <p>
                  {order.address.line1}
                  {order.address.line2 && `, ${order.address.line2}`}
                </p>
                <p>
                  {order.address.city}, {order.address.state} {order.address.pincode}
                </p>
                <p className="mt-1">+91 {order.address.phone}</p>
              </InfoCard>
              <InfoCard icon={CreditCard} title="Payment & delivery">
                <p className="text-ivory-50">{paymentLabel[order.payment]}</p>
                <p>{order.payment === "cod" ? "Pay when it arrives" : "Paid (demo)"}</p>
                <p className="mt-2 text-ivory-50">{order.delivery === "express" ? "Express delivery" : "Standard delivery"}</p>
                <p>{order.eta}</p>
              </InfoCard>
              {order.giftMessage && (
                <InfoCard icon={Gift} title="Your note" className="sm:col-span-2">
                  <p className="font-display text-xl italic text-ivory-50">“{order.giftMessage}”</p>
                </InfoCard>
              )}
            </div>
          </div>

          {/* Totals */}
          <aside className="lg:self-start">
            <div className="border border-gold-500/15 bg-wine-950 p-8">
              <p className="eyebrow mb-6">Payment summary</p>
              <OrderSummary totals={order.totals} coupon={order.coupon} />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Button href="/shop" size="lg">
                Continue shopping
              </Button>
              <Button href="/account" variant="outline" size="lg">
                View my orders
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

/** Gold ring and tick that draw themselves, with a soft pulse. */
function SuccessMark() {
  return (
    <div className="relative mx-auto h-24 w-24">
      <motion.span
        className="absolute inset-0 rounded-full border border-gold-400"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
        transition={{ delay: 0.8, duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
      />
      <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden>
        <motion.circle
          cx="48"
          cy="48"
          r="44"
          fill="none"
          stroke="var(--color-gold-400)"
          strokeWidth="2"
          initial={{ pathLength: 0, rotate: -90 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
        <motion.path
          d="M30 49 L43 62 L67 36"
          fill="none"
          stroke="var(--color-gold-200)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-ivory-100/10 p-5 text-sm leading-relaxed text-ivory-100/60", className)}>
      <p className="mb-3 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-gold-400">
        <Icon size={13} /> {title}
      </p>
      {children}
    </div>
  );
}
