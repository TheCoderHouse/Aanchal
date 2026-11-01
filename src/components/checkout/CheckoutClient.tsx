"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ChevronDown, Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { CouponField } from "@/components/cart/CouponField";
import { GiftWrapToggle } from "@/components/cart/GiftWrapToggle";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { useMounted } from "@/hooks/useMounted";
import { computeTotals, type DeliveryId, type PaymentId } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";
import { useAuth } from "@/store/auth";
import { useCart, useCartSummary } from "@/store/cart";
import { useOrders, type Address } from "@/store/order";
import { AddressStep, emptyAddress, validateAddress } from "./AddressStep";
import { CheckoutStepper } from "./CheckoutStepper";
import { DeliveryStep } from "./DeliveryStep";
import { emptyPayment, PaymentStep, validatePayment, type PaymentData } from "./PaymentStep";
import { ProcessingOverlay } from "./ProcessingOverlay";

const ease = [0.22, 1, 0.36, 1] as const;

/** Readable date range, e.g. "Tue 28 Oct – Thu 30 Oct". */
function etaRange(fromDays: number, toDays: number) {
  const fmt = (d: number) => {
    const date = new Date();
    date.setDate(date.getDate() + d);
    return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  };
  return `${fmt(fromDays)} – ${fmt(toDays)}`;
}

/** Called only when the order is placed (an event), never during render. */
function makeOrderId() {
  return `AAN-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function CheckoutClient() {
  const router = useRouter();
  const mounted = useMounted();
  const cart = useCartSummary();
  const clearCart = useCart((s) => s.clear);
  const placeOrder = useOrders((s) => s.place);
  const signedIn = useAuth((s) => s.user);
  const savedAddresses = useAuth((s) => s.addresses);
  const saveAddress = useAuth((s) => s.saveAddress);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const [delivery, setDelivery] = useState<DeliveryId>("standard");
  const [giftMessage, setGiftMessage] = useState("");
  const [payment, setPayment] = useState<PaymentId>("upi");
  const [paymentData, setPaymentData] = useState<PaymentData>(emptyPayment);
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const orderPlaced = useRef(false);

  // Next.js keeps this page alive (hidden) after you leave it. If an order was placed,
  // start fresh next time instead of showing the "placing order" screen again.
  // Card details are always cleared when leaving.
  useLayoutEffect(
    () => () => {
      setPaymentData(emptyPayment);
      if (orderPlaced.current) {
        orderPlaced.current = false;
        setPlacing(false);
        setStep(0);
        setGiftMessage("");
        setPaymentErrors({});
      }
    },
    [],
  );

  const totals = computeTotals({
    subtotal: cart.subtotal,
    couponCode: cart.coupon,
    giftWrap: cart.giftWrap,
    delivery,
    payment: step === 2 ? payment : undefined,
  });

  // Dates only on the client, so the server and browser render the same HTML
  const etas: Record<DeliveryId, string> = mounted
    ? { standard: etaRange(4, 6), express: etaRange(1, 2) }
    : { standard: "", express: "" };

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (step === 0) {
      const e = validateAddress(address);
      setAddressErrors(e);
      if (Object.keys(e).length) return;
    }
    go(step + 1);
  };

  const submit = () => {
    const e = validatePayment(payment, paymentData);
    setPaymentErrors(e);
    if (Object.keys(e).length) return;

    setPlacing(true);
    orderPlaced.current = true;
    // Signed-in shoppers: keep a new address in their address book
    if (signedIn && !savedAddresses.some((a) => a.line1 === address.line1 && a.pincode === address.pincode)) {
      saveAddress({ ...address, label: "Home" });
    }
    const order = {
      id: makeOrderId(),
      placedAt: new Date().toISOString(),
      eta: delivery === "express" ? etaRange(1, 2) : etaRange(4, 6),
      lines: cart.lines.map((l) => ({
        productId: l.product.id,
        slug: l.product.slug,
        name: l.product.name,
        colorway: l.colorway.name,
        qty: l.item.qty,
        unit: l.unit,
        fallPico: l.item.fallPico,
      })),
      address,
      delivery,
      payment,
      giftMessage: giftMessage || undefined,
      coupon: totals.discount > 0 ? cart.coupon : null,
      totals: {
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        gift: totals.gift,
        cod: payment === "cod" ? totals.cod : 0,
        total: totals.total,
      },
    };
    // Pretend to talk to a payment gateway
    setTimeout(() => {
      placeOrder(order);
      router.push("/order/success");
      // Clear after navigating so the empty-bag view never flashes
      setTimeout(clearCart, 600);
    }, 2800);
  };

  if (!mounted) return <CheckoutSkeleton />;

  if (cart.lines.length === 0 && !placing) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <p className="font-display text-5xl text-ivory-50">Your bag is empty</p>
          <p className="mt-3 text-ivory-100/50">Add a saree to your bag to check out.</p>
          <Button href="/shop" className="mt-8">
            Explore the shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProcessingOverlay show={placing} />

      {/* Mobile: collapsible summary */}
      <div className="mb-8 border border-ivory-100/10 lg:hidden">
        <button onClick={() => setSummaryOpen(!summaryOpen)} className="flex w-full items-center justify-between px-4 py-4 text-sm">
          <span className="flex items-center gap-2 text-gold-300">
            {summaryOpen ? "Hide" : "Show"} order summary
            <ChevronDown size={14} className={cn("transition-transform", summaryOpen && "rotate-180")} />
          </span>
          <span className="font-display text-xl text-ivory-50">{formatPrice(totals.total)}</span>
        </button>
        <AnimatePresence initial={false}>
          {summaryOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="border-t border-ivory-100/10 p-4">
                <SummaryPanel cart={cart} totals={totals} delivery={delivery} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div>
          <CheckoutStepper current={step} onStep={go} />

          <div className="relative mt-14 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d * 60, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d * -60, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease }}
              >
                {step === 0 && <AddressStep value={address} onChange={setAddress} errors={addressErrors} />}
                {step === 1 && (
                  <>
                    <AddressRecap address={address} onEdit={() => go(0)} />
                    <DeliveryStep
                      value={delivery}
                      onChange={setDelivery}
                      etas={etas}
                      freeShipping={totals.shipping === 0 || (delivery === "express" && totals.shipping === 350)}
                      giftMessage={giftMessage}
                      onGiftMessage={setGiftMessage}
                      giftWrap={cart.giftWrap}
                    />
                  </>
                )}
                {step === 2 && (
                  <>
                    <AddressRecap address={address} onEdit={() => go(0)} />
                    <PaymentStep method={payment} onMethod={setPayment} data={paymentData} onData={setPaymentData} errors={paymentErrors} />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center justify-between gap-4 border-t border-ivory-100/10 pt-8">
            {step > 0 ? (
              <button onClick={() => go(step - 1)} className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ivory-100/60 hover:text-gold-300">
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <Button size="lg" onClick={next}>
                Continue to {step === 0 ? "delivery" : "payment"} <ArrowRight size={14} />
              </Button>
            ) : (
              <Button size="lg" onClick={submit} disabled={placing}>
                <Lock size={13} /> Place order · {formatPrice(totals.total)}
              </Button>
            )}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-ivory-100/40">
            <ShieldCheck size={14} className="text-gold-500" /> This is a demo store. No payment is taken and no data leaves your browser.
          </p>
        </div>

        {/* Desktop summary */}
        <aside className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
          <div className="border border-gold-500/15 bg-wine-950 p-8">
            <SummaryPanel cart={cart} totals={totals} delivery={delivery} />
          </div>
        </aside>
      </div>
    </>
  );
}

function SummaryPanel({
  cart,
  totals,
  delivery,
}: {
  cart: ReturnType<typeof useCartSummary>;
  totals: ReturnType<typeof computeTotals>;
  delivery: DeliveryId;
}) {
  return (
    <>
      <p className="eyebrow mb-6">Your order</p>
      <ul className="space-y-4">
        {cart.lines.map(({ item, product, colorway, lineTotal }) => (
          <li key={item.key} className="flex items-center gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden">
              <ProductImage product={product} colorway={colorway} uid={`co-${item.key}`} sizes="160px" />
              <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-gold-400 text-[0.6rem] font-bold text-ink">
                {item.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg text-ivory-50">{product.name}</p>
              <p className="text-xs text-ivory-100/45">
                {colorway.name}
                {item.fallPico && " · Fall & pico"}
              </p>
            </div>
            <span className="text-sm text-ivory-100">{formatPrice(lineTotal)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 space-y-3 border-t border-ivory-100/10 pt-6">
        <CouponField discount={totals.discount} error={totals.couponError} />
        <GiftWrapToggle />
      </div>
      <div className="mt-6">
        <OrderSummary totals={totals} coupon={cart.coupon} shippingLabel={delivery === "express" ? "Express shipping" : "Shipping"} />
      </div>
    </>
  );
}

function AddressRecap({ address, onEdit }: { address: Address; onEdit: () => void }) {
  return (
    <div className="mb-10 flex items-start justify-between gap-4 border border-ivory-100/10 p-4 text-sm">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/40">Shipping to</p>
        <p className="mt-1 text-ivory-50">{address.name}</p>
        <p className="text-ivory-100/55">
          {address.line1}
          {address.line2 && `, ${address.line2}`}, {address.city}, {address.state} {address.pincode}
        </p>
      </div>
      <button onClick={onEdit} className="text-xs uppercase tracking-[0.2em] text-gold-300 hover:text-gold-200">
        Edit
      </button>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        <div className="h-10 animate-pulse bg-wine-900" />
        <div className="h-12 w-2/3 animate-pulse bg-wine-900" />
        <div className="h-64 animate-pulse bg-wine-900" />
      </div>
      <div className="hidden h-96 animate-pulse bg-wine-900 lg:block" />
    </div>
  );
}
