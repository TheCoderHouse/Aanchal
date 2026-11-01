"use client";

import { useState } from "react";
import { states, validateAddress } from "@/components/checkout/AddressStep";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { SavedAddress } from "@/store/auth";
import type { Address } from "@/store/order";

const labels = ["Home", "Work", "Other"];

export function AddressForm({
  initial,
  defaults,
  onSave,
  onCancel,
}: {
  initial?: SavedAddress;
  defaults: Pick<Address, "name" | "email" | "phone">;
  onSave: (a: Omit<SavedAddress, "id" | "isDefault"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [a, setA] = useState<Address & { label: string }>(
    initial ?? { ...defaults, line1: "", line2: "", city: "", state: "", pincode: "", label: "Home" },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const field = (k: keyof Address) => ({
    value: a[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setA({ ...a, [k]: e.target.value }),
    error: errors[k],
  });

  return (
    <form
      className="p-6 md:p-10"
      onSubmit={(e) => {
        e.preventDefault();
        const errs = validateAddress(a);
        setErrors(errs);
        if (Object.keys(errs).length) return;
        onSave({ ...a, id: initial?.id });
      }}
    >
      <p className="font-display text-3xl text-ivory-50">{initial ? "Edit address" : "New address"}</p>
      <div className="mt-6 flex gap-2">
        {labels.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setA({ ...a, label: l })}
            className={cn("border px-4 py-1.5 text-xs transition", a.label === l ? "border-gold-400 text-gold-200" : "border-ivory-100/15 text-ivory-100/55")}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <Input label="Full name" {...field("name")} />
        <Input label="Mobile" inputMode="numeric" maxLength={10} {...field("phone")} onChange={(e) => setA({ ...a, phone: e.target.value.replace(/\D/g, "") })} />
        <Input label="Email" type="email" {...field("email")} className="sm:col-span-2" />
        <Input label="House, building, street" {...field("line1")} className="sm:col-span-2" />
        <Input label="Area, landmark (optional)" {...field("line2")} className="sm:col-span-2" />
        <Input label="City" {...field("city")} />
        <Input label="Pincode" inputMode="numeric" maxLength={6} {...field("pincode")} onChange={(e) => setA({ ...a, pincode: e.target.value.replace(/\D/g, "") })} />
        <div className="relative pt-5 sm:col-span-2">
          <label htmlFor="addr-state" className="absolute left-0 top-0 text-[0.7rem] text-ivory-100/50">State</label>
          <select
            id="addr-state"
            value={a.state}
            onChange={(e) => setA({ ...a, state: e.target.value })}
            className="w-full appearance-none border-0 border-b border-ivory-100/20 bg-transparent pb-2 text-ivory-50 outline-none focus:border-gold-400"
          >
            <option value="" className="bg-wine-950">Choose a state</option>
            {states.map((s) => (
              <option key={s} value={s} className="bg-wine-950">{s}</option>
            ))}
          </select>
          {errors.state && <p className="mt-2 text-xs text-wine-500">{errors.state}</p>}
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save address</Button>
      </div>
    </form>
  );
}
