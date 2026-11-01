"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "./order";

export type User = { name: string; email: string; phone: string; memberSince: string };
export type SavedAddress = Address & { id: string; label: string; isDefault: boolean };

type AuthState = {
  user: User | null;
  /** Accounts created on this device, so signing back in restores the profile. */
  known: User[];
  addresses: SavedAddress[];
  signIn: (user: User) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<User>) => void;
  saveAddress: (address: Omit<SavedAddress, "id" | "isDefault"> & { id?: string; isDefault?: boolean }) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
};

function sameAccount(a: User, b: User) {
  return (!!a.email && a.email === b.email) || (!!a.phone && a.phone === b.phone);
}

/** Find a known account by email or phone. */
export function findKnown(known: User[], by: { email?: string; phone?: string }) {
  return known.find((k) => (by.email && k.email === by.email) || (by.phone && k.phone === by.phone));
}

let nextId = 0;
const makeId = () => `addr-${Date.now().toString(36)}-${nextId++}`;

/** Demo sign-in: everything lives in this browser only. */
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      known: [],
      addresses: [],
      signIn: (user) =>
        set((s) => ({
          user,
          known: [user, ...s.known.filter((k) => !sameAccount(k, user))].slice(0, 5),
        })),
      signOut: () => set({ user: null }),
      updateProfile: (patch) =>
        set((s) => {
          if (!s.user) return s;
          const user = { ...s.user, ...patch };
          return { user, known: s.known.map((k) => (sameAccount(k, s.user!) ? user : k)) };
        }),
      saveAddress: ({ id, isDefault, ...address }) =>
        set((s) => {
          const exists = id && s.addresses.some((a) => a.id === id);
          const makeDefault = isDefault || s.addresses.length === 0;
          const list = exists
            ? s.addresses.map((a) => (a.id === id ? { ...a, ...address } : a))
            : [...s.addresses, { ...address, id: makeId(), isDefault: false }];
          const targetId = exists ? id : list[list.length - 1].id;
          return {
            addresses: makeDefault ? list.map((a) => ({ ...a, isDefault: a.id === targetId })) : list,
          };
        }),
      removeAddress: (id) =>
        set((s) => {
          const list = s.addresses.filter((a) => a.id !== id);
          if (list.length && !list.some((a) => a.isDefault)) list[0] = { ...list[0], isDefault: true };
          return { addresses: list };
        }),
      setDefault: (id) => set((s) => ({ addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })) })),
    }),
    { name: "aanchal-account" },
  ),
);
