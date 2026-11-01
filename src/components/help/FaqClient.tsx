"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { faqs } from "@/data/help";
import { cn } from "@/lib/utils";

const groups = ["All", ...Array.from(new Set(faqs.map((f) => f.group)))];

export function FaqClient() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");

  const shown = useMemo(() => {
    const q = query.toLowerCase().trim();
    return faqs.filter(
      (f) => (group === "All" || f.group === group) && (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)),
    );
  }, [query, group]);

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-ivory-100/20 pb-2 focus-within:border-gold-400">
        <Search size={18} className="text-gold-400" />
        <label htmlFor="faq-search" className="sr-only">
          Search questions
        </label>
        <input
          id="faq-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions, e.g. refund, zari, delivery"
          className="flex-1 bg-transparent py-2 text-lg text-ivory-50 outline-none placeholder:text-ivory-100/30"
        />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            aria-pressed={group === g}
            className={cn(
              "border px-4 py-1.5 text-xs transition",
              group === g ? "border-gold-400 bg-gold-400/10 text-gold-200" : "border-ivory-100/15 text-ivory-100/55 hover:text-ivory-100",
            )}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="mt-10">
        {shown.length ? (
          <Accordion key={`${group}-${query}`} items={shown.map((f, i) => ({ id: String(i), title: f.q, content: f.a }))} />
        ) : (
          <p className="py-10 text-center text-ivory-100/50">No questions match “{query}”. Try another word, or contact us.</p>
        )}
      </div>
    </div>
  );
}
