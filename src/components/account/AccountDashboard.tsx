"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Heart, LogOut, MapPin, Package, Pencil, Plus, RotateCcw, Star, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { products } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";
import { useAuth, type SavedAddress } from "@/store/auth";
import { useCart } from "@/store/cart";
import { useOrders, type Order } from "@/store/order";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";
import { AddressForm } from "./AddressForm";
import { CircleCard } from "./CircleCard";
import { formatOrderDate, orderStatusIndex, orderSteps } from "./orderStatus";

const ease = [0.22, 1, 0.36, 1] as const;

const tabs = [
  { id: "overview", label: "Overview", icon: Star },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "profile", label: "Profile", icon: User },
] as const;
type TabId = (typeof tabs)[number]["id"];

export function AccountDashboard() {
  const user = useAuth((s) => s.user)!;
  const signOut = useAuth((s) => s.signOut);
  const orders = useOrders((s) => s.orders);
  const toast = useUI((s) => s.toast);
  const [tab, setTab] = useState<TabId>("overview");
  const points = 500 + orders.reduce((s, o) => s + Math.floor(o.totals.total / 100), 0);

  return (
    <div>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="mt-4 font-display text-5xl font-light text-ivory-50 md:text-7xl">
            Namaste, <span className="text-gold-gradient italic">{user.name.split(" ")[0]}</span>
          </h1>
        </div>
        <button
          onClick={() => {
            signOut();
            toast("Signed out", "See you soon");
          }}
          className="flex items-center gap-2 self-start text-xs uppercase tracking-[0.2em] text-ivory-100/55 hover:text-gold-300 md:self-auto"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        {/* Tabs: sidebar on desktop, scrolling row on phones */}
        <nav className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0" aria-label="Account sections">
          <ul className="flex gap-2 lg:flex-col lg:gap-1" role="tablist">
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative isolate flex w-full items-center gap-3 whitespace-nowrap px-4 py-3 text-left text-sm transition-colors",
                    tab === t.id ? "text-ivory-50" : "text-ivory-100/50 hover:text-ivory-100",
                  )}
                >
                  {tab === t.id && (
                    <motion.span layoutId="account-tab" className="absolute inset-0 -z-10 border border-gold-500/30 bg-gold-400/5" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                  )}
                  <t.icon size={15} className={tab === t.id ? "text-gold-300" : ""} />
                  {t.label}
                  {t.id === "orders" && orders.length > 0 && <span className="ml-auto text-xs text-ivory-100/40">{orders.length}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="isolate min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease }}
            >
              {tab === "overview" && <Overview points={points} onTab={setTab} />}
              {tab === "orders" && <Orders />}
              {tab === "addresses" && <Addresses />}
              {tab === "profile" && <Profile />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Overview ──
function Overview({ points, onTab }: { points: number; onTab: (t: TabId) => void }) {
  const user = useAuth((s) => s.user)!;
  const addresses = useAuth((s) => s.addresses);
  const orders = useOrders((s) => s.orders);
  const wishCount = useWishlist((s) => s.ids.length);
  const latest = orders[0];

  return (
    <div className="space-y-12">
      <div className="grid items-center gap-10 xl:grid-cols-[1.1fr_1fr]">
        <CircleCard name={user.name} points={points} memberSince={user.memberSince} />
        <ul className="space-y-3 text-sm text-ivory-100/60">
          <li className="text-ivory-50">Your Circle benefits</li>
          <li>✦ 1 point for every ₹100 you spend</li>
          <li>✦ Free fall & pico on every saree at Zari tier</li>
          <li>✦ Private previews of new weaves at Kundan tier</li>
          <li>✦ Free lifetime saree care and re-polishing of zari</li>
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Orders", value: orders.length, icon: Package, tab: "orders" as const },
          { label: "Wishlist", value: wishCount, icon: Heart, href: "/wishlist" },
          { label: "Addresses", value: addresses.length, icon: MapPin, tab: "addresses" as const },
        ].map((s) => {
          const inner = (
            <>
              <s.icon size={18} strokeWidth={1.4} className="text-gold-300" />
              <p className="mt-6 font-display text-4xl text-ivory-50">{s.value}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-ivory-100/45">{s.label}</p>
            </>
          );
          const cls = "block border border-ivory-100/10 p-5 text-left transition hover:border-gold-500/40";
          return s.href ? (
            <Link key={s.label} href={s.href} className={cls}>{inner}</Link>
          ) : (
            <button key={s.label} onClick={() => onTab(s.tab!)} className={cls}>{inner}</button>
          );
        })}
      </div>

      <div>
        <p className="eyebrow mb-5">Latest order</p>
        {latest ? (
          <OrderCard order={latest} defaultOpen={false} />
        ) : (
          <div className="border border-dashed border-ivory-100/15 p-8 text-center">
            <p className="font-display text-2xl text-ivory-50">No orders yet</p>
            <Button href="/shop" variant="outline" size="sm" className="mt-5">Start shopping</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Orders ──
function Orders() {
  const orders = useOrders((s) => s.orders);
  if (!orders.length) {
    return (
      <div className="border border-dashed border-ivory-100/15 px-6 py-20 text-center">
        <Package size={28} className="mx-auto text-gold-400" strokeWidth={1.2} />
        <p className="mt-5 font-display text-3xl text-ivory-50">No orders yet</p>
        <p className="mt-2 text-sm text-ivory-100/50">Orders you place on this device will appear here.</p>
        <Button href="/shop" className="mt-8">Explore the shop</Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((o, i) => (
        <OrderCard key={o.id} order={o} defaultOpen={i === 0} />
      ))}
    </div>
  );
}

function OrderCard({ order, defaultOpen }: { order: Order; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const add = useCart((s) => s.add);
  const { toast, open: openPanel } = useUI();
  const status = orderStatusIndex(order.placedAt);
  const items = order.lines.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="border border-ivory-100/10">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full flex-wrap items-center gap-4 p-5 text-left">
        <div className="flex -space-x-3">
          {order.lines.slice(0, 3).map((l) => {
            const p = products.find((x) => x.id === l.productId);
            const cw = p?.colorways.find((c) => c.name === l.colorway) ?? p?.colorways[0];
            return (
              <span key={`${l.productId}-${l.colorway}`} className="h-14 w-11 overflow-hidden ring-2 ring-ink">
                {p && cw && <ProductImage product={p} colorway={cw} uid={`oc-${order.id}-${l.productId}-${l.colorway}`} />}
              </span>
            );
          })}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ivory-50">{order.id}</p>
          <p className="text-xs text-ivory-100/45">
            {formatOrderDate(order.placedAt)} · {items} {items === 1 ? "saree" : "sarees"}
          </p>
        </div>
        <span
          className={cn(
            "px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em]",
            status === 3 ? "bg-emerald-deep/60 text-ivory-50" : "bg-gold-400/15 text-gold-200",
          )}
        >
          {orderSteps[status]}
        </span>
        <span className="font-display text-xl text-ivory-50">{formatPrice(order.totals.total)}</span>
        <ChevronDown size={16} className={cn("text-gold-400 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
            <div className="border-t border-ivory-100/10 p-5 md:p-8">
              {/* Timeline */}
              <ol className="relative grid grid-cols-4">
                <span className="absolute left-[12.5%] right-[12.5%] top-2 h-px bg-ivory-100/10" aria-hidden />
                <motion.span
                  className="absolute left-[12.5%] top-2 h-px bg-gold-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(status / 3) * 75}%` }}
                  transition={{ duration: 0.9, ease, delay: 0.2 }}
                  aria-hidden
                />
                {orderSteps.map((s, i) => (
                  <li key={s} className="relative flex flex-col items-center gap-2">
                    <span className={cn("h-4 w-4 rotate-45 border", i <= status ? "border-gold-400 bg-gold-400" : "border-ivory-100/25 bg-ink")} />
                    <span className={cn("text-[0.6rem] uppercase tracking-[0.2em]", i <= status ? "text-ivory-100" : "text-ivory-100/35")}>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-center text-xs text-ivory-100/50">
                {status < 3 ? `Expected ${order.eta}` : "Delivered. We hope you love it."}
              </p>

              <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
                <ul className="space-y-3">
                  {order.lines.map((l) => (
                    <li key={`${l.productId}-${l.colorway}`} className="flex justify-between gap-4 text-sm">
                      <Link href={`/product/${l.slug}`} className="text-ivory-100 hover:text-gold-200">
                        {l.name} <span className="text-ivory-100/45">· {l.colorway} × {l.qty}</span>
                      </Link>
                      <span className="text-ivory-100/80">{formatPrice(l.unit * l.qty)}</span>
                    </li>
                  ))}
                  <li className="pt-4 text-xs leading-relaxed text-ivory-100/50">
                    Shipping to {order.address.name}, {order.address.line1}, {order.address.city} {order.address.pincode}
                  </li>
                </ul>
                <OrderSummary totals={order.totals} coupon={order.coupon} />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="sm"
                  onClick={() => {
                    order.lines.forEach((l) => add(l.productId, l.colorway));
                    toast("Added to bag", `${order.lines.length} ${order.lines.length === 1 ? "saree" : "sarees"} from ${order.id}`);
                    openPanel("cart");
                  }}
                >
                  <RotateCcw size={12} /> Buy again
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toast("We'll call you shortly", "Our stylist team will reach out about this order")}>
                  Need help?
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Addresses ──
function Addresses() {
  const user = useAuth((s) => s.user)!;
  const addresses = useAuth((s) => s.addresses);
  const { saveAddress, removeAddress, setDefault } = useAuth();
  const toast = useUI((s) => s.toast);
  const [editing, setEditing] = useState<SavedAddress | "new" | null>(null);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {addresses.map((a) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn("flex flex-col border p-5 text-sm", a.isDefault ? "border-gold-500/50" : "border-ivory-100/10")}
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.6rem] uppercase tracking-[0.25em] text-gold-400">{a.label}</span>
                {a.isDefault && <span className="bg-gold-400 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-ink">Default</span>}
              </div>
              <p className="mt-3 text-ivory-50">{a.name}</p>
              <p className="mt-1 leading-relaxed text-ivory-100/55">
                {a.line1}
                {a.line2 && `, ${a.line2}`}
                <br />
                {a.city}, {a.state} {a.pincode}
                <br />+91 {a.phone}
              </p>
              <div className="mt-auto flex gap-4 pt-5 text-xs uppercase tracking-[0.15em]">
                <button onClick={() => setEditing(a)} className="flex items-center gap-1.5 text-ivory-100/60 hover:text-gold-300">
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => {
                    removeAddress(a.id);
                    toast("Address removed");
                  }}
                  className="flex items-center gap-1.5 text-ivory-100/60 hover:text-wine-500"
                >
                  <Trash2 size={12} /> Remove
                </button>
                {!a.isDefault && (
                  <button onClick={() => setDefault(a.id)} className="ml-auto text-gold-300 hover:text-gold-200">
                    Make default
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          <motion.button
            key="add"
            layout
            onClick={() => setEditing("new")}
            className="grid min-h-[200px] place-items-center border border-dashed border-ivory-100/20 text-ivory-100/50 transition hover:border-gold-400 hover:text-gold-300"
          >
            <span className="flex flex-col items-center gap-3 text-xs uppercase tracking-[0.2em]">
              <Plus size={20} /> Add a new address
            </span>
          </motion.button>
        </AnimatePresence>
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} label="Address" className="max-w-2xl">
        {editing !== null && (
          <AddressForm
            key={editing === "new" ? "new" : editing.id}
            initial={editing === "new" ? undefined : editing}
            defaults={{ name: user.name, email: user.email, phone: user.phone }}
            onCancel={() => setEditing(null)}
            onSave={(a) => {
              saveAddress(a);
              toast(editing === "new" ? "Address added" : "Address updated");
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

// ── Profile ──
function Profile() {
  const user = useAuth((s) => s.user)!;
  const updateProfile = useAuth((s) => s.updateProfile);
  const toast = useUI((s) => s.toast);
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [prefs, setPrefs] = useState({ whatsapp: true, newArrivals: true, offers: false });

  return (
    <form
      className="max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        updateProfile({ name: form.name.trim() || user.name, email: form.email, phone: form.phone });
        toast("Profile saved");
      }}
    >
      <p className="eyebrow mb-2">Personal details</p>
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="sm:col-span-2" />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Mobile" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} />
      </div>

      <p className="eyebrow mb-4 mt-12">Communication</p>
      <div className="divide-y divide-ivory-100/10 border-y border-ivory-100/10">
        {([
          ["whatsapp", "Order updates on WhatsApp"],
          ["newArrivals", "New weaves and private previews"],
          ["offers", "Festive offers and sales"],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center justify-between py-4 text-sm text-ivory-100/80">
            {label}
            <button
              type="button"
              role="switch"
              aria-checked={prefs[key]}
              onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}
              className={cn("relative h-6 w-11 rounded-full border transition-colors", prefs[key] ? "border-gold-400 bg-gold-400/20" : "border-ivory-100/20")}
            >
              <motion.span
                className={cn("absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full", prefs[key] ? "bg-gold-300" : "bg-ivory-100/40")}
                animate={{ left: prefs[key] ? 22 : 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </label>
        ))}
      </div>
      <Button type="submit" className="mt-10">Save changes</Button>
    </form>
  );
}
