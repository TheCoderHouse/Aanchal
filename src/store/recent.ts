"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentState = {
  viewed: string[]; // product ids, newest first
  searches: string[];
  addViewed: (id: string) => void;
  addSearch: (q: string) => void;
  clearSearches: () => void;
};

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      viewed: [],
      searches: [],
      addViewed: (id) => set((s) => ({ viewed: [id, ...s.viewed.filter((v) => v !== id)].slice(0, 8) })),
      addSearch: (q) => {
        const term = q.trim();
        if (term.length < 2) return;
        set((s) => ({
          searches: [term, ...s.searches.filter((v) => v.toLowerCase() !== term.toLowerCase())].slice(0, 6),
        }));
      },
      clearSearches: () => set({ searches: [] }),
    }),
    { name: "aanchal-recent" },
  ),
);
