"use client";

import { useEffect, useState } from "react";
import { chapters } from "@/data/lookbook";
import { cn } from "@/lib/utils";

/** Sticky chapter index that highlights the chapter in view. */
export function ChapterNav() {
  const [active, setActive] = useState(chapters[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Lookbook chapters" className="glass sticky top-0 z-20 border-y border-gold-500/10">
      <ul className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-4 md:justify-center md:gap-10 md:px-8">
        {chapters.map((c) => (
          <li key={c.id} className="shrink-0">
            <a
              href={`#${c.id}`}
              className={cn(
                "flex items-baseline gap-2 text-xs uppercase tracking-[0.2em] transition-colors",
                active === c.id ? "text-gold-200" : "text-ivory-100/45 hover:text-ivory-100",
              )}
            >
              <span className="font-display text-base normal-case tracking-normal">{c.number}</span>
              {c.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
