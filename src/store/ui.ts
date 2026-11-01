"use client";

import { create } from "zustand";

type Panel = "cart" | "search" | "menu" | null;

type Toast = { id: number; title: string; description?: string };

type UIState = {
  panel: Panel;
  open: (panel: Exclude<Panel, null>) => void;
  close: () => void;
  quickViewSlug: string | null;
  setQuickView: (slug: string | null) => void;
  toasts: Toast[];
  toast: (title: string, description?: string) => void;
  dismissToast: (id: number) => void;
};

let toastId = 0;

export const useUI = create<UIState>()((set) => ({
  panel: null,
  open: (panel) => set({ panel }),
  close: () => set({ panel: null }),
  quickViewSlug: null,
  setQuickView: (slug) => set({ quickViewSlug: slug }),
  toasts: [],
  toast: (title, description) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, title, description }].slice(-3) }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
