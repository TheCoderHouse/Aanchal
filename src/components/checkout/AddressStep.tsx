"use client";

import { Check, Sparkles } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";
import { Input } from "@/components/ui/Input";
import type { Address } from "@/store/order";

export const states = [
  "Andhra Pradesh", "Delhi", "Goa", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

export const emptyAddress: Address = { name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

const demoAddress: Address = {
  name: "Ananya Rao",
  email: "ananya@example.com",
  phone: "9876543210",
  line1: "12, Lotus Residency, 4th Cross",
  line2: "Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
};

export function validateAddress(a: Address) {
  const e: Partial<Record<keyof Address, string>> = {};
  if (a.name.trim().length < 2) e.name = "Please enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(a.email)) e.email = "Please enter a valid email";
  if (!/^[6-9]\d{9}$/.test(a.phone)) e.phone = "Enter a 10-digit mobile number";
  if (a.line1.trim().length < 5) e.line1 = "Please enter your house and street";
  if (a.city.trim().length < 2) e.city = "Please enter your city";
  if (!a.state) e.state = "Please choose a state";
  if (!/^\d{6}$/.test(a.pincode)) e.pincode = "Enter a 6-digit pincode";
  return e;
}

type Props = {
  value: Address;
  onChange: (a: Address) => void;
  errors: Partial<Record<keyof Address, string>>;
};

export function AddressStep({ value, onChange, errors }: Props) {
  const mounted = useMounted();
  const saved = useAuth((s) => s.addresses);
  const savedAddresses = mounted ? saved : [];
  const field = (key: keyof Address) => ({
    value: value[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, [key]: e.target.value }),
    error: errors[key],
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl text-ivory-50 md:text-4xl">Where should we send it?</h2>
        <button
          type="button"
          onClick={() => onChange(demoAddress)}
          className="flex shrink-0 items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-gold-300 hover:text-gold-200"
        >
          <Sparkles size={12} /> Fill demo details
        </button>
      </div>

      {savedAddresses.length > 0 && (
        <div className="mt-8">
          <p className="eyebrow mb-3">Saved addresses</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {savedAddresses.map((a) => {
              const selected = a.line1 === value.line1 && a.pincode === value.pincode && a.name === value.name;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    onChange({
                      name: a.name, email: a.email, phone: a.phone, line1: a.line1,
                      line2: a.line2, city: a.city, state: a.state, pincode: a.pincode,
                    });
                  }}
                  className={cn(
                    "relative border p-4 text-left text-xs leading-relaxed transition",
                    selected ? "border-gold-400 bg-gold-400/5" : "border-ivory-100/15 hover:border-ivory-100/35",
                  )}
                >
                  {selected && (
                    <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-gold-400 text-ink">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                  <span className="text-[0.6rem] uppercase tracking-[0.25em] text-gold-400">
                    {a.label}
                    {a.isDefault && " · Default"}
                  </span>
                  <span className="mt-1 block text-sm text-ivory-50">{a.name}</span>
                  <span className="block text-ivory-100/55">
                    {a.line1}, {a.city} {a.pincode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="eyebrow mb-2 mt-10">Contact</p>
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <Input label="Full name" autoComplete="name" {...field("name")} className="sm:col-span-2" />
        <Input label="Email" type="email" autoComplete="email" {...field("email")} />
        <Input
          label="Mobile number"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel-national"
          hint="For delivery updates on WhatsApp"
          {...field("phone")}
          onChange={(e) => onChange({ ...value, phone: e.target.value.replace(/\D/g, "") })}
        />
      </div>

      <p className="eyebrow mb-2 mt-12">Delivery address</p>
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <Input label="House, building, street" autoComplete="address-line1" {...field("line1")} className="sm:col-span-2" />
        <Input label="Area, landmark (optional)" autoComplete="address-line2" {...field("line2")} className="sm:col-span-2" />
        <Input label="City" autoComplete="address-level2" {...field("city")} />
        <Input
          label="Pincode"
          inputMode="numeric"
          maxLength={6}
          autoComplete="postal-code"
          {...field("pincode")}
          onChange={(e) => onChange({ ...value, pincode: e.target.value.replace(/\D/g, "") })}
        />
        <div className="relative pt-5 sm:col-span-2">
          <label htmlFor="state" className="absolute left-0 top-0 text-[0.7rem] text-ivory-100/50">
            State
          </label>
          <select
            id="state"
            value={value.state}
            onChange={(e) => onChange({ ...value, state: e.target.value })}
            aria-invalid={!!errors.state || undefined}
            className="w-full appearance-none border-0 border-b border-ivory-100/20 bg-transparent pb-2 text-[0.95rem] text-ivory-50 outline-none focus:border-gold-400 aria-[invalid]:border-wine-500"
          >
            <option value="" className="bg-wine-950">Choose a state</option>
            {states.map((s) => (
              <option key={s} value={s} className="bg-wine-950">
                {s}
              </option>
            ))}
          </select>
          {errors.state && <p className="mt-2 text-xs text-wine-500">{errors.state}</p>}
        </div>
      </div>
    </div>
  );
}
