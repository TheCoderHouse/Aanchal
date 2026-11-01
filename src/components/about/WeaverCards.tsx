"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { SareeArt } from "@/components/product/SareeArt";
import { getCollection } from "@/data/collections";
import { weavers } from "@/data/story";

/** Weaver profiles. Portraits use their weave's pattern with a monogram until real photos are added. */
export function WeaverCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {weavers.map((w, i) => {
        const c = getCollection(w.collection)!;
        const initials = w.name.replace("Ustad ", "").split(" ").map((p) => p[0]).join("");
        return (
          <motion.article
            key={w.id}
            className="group relative overflow-hidden border border-gold-500/15"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[3/4]">
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-silk group-hover:scale-110">
                <SareeArt colorway={c.palette} motif={c.motif} view="pallu" uid={`weaver-${w.id}`} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
              <span className="absolute left-1/2 top-[32%] grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold-300/60 bg-ink/50 font-display text-4xl text-gold-200 backdrop-blur-sm">
                {initials}
              </span>
              {/* Quote slides up on hover */}
              <div className="absolute inset-0 flex items-center bg-ink/85 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="translate-y-4 font-display text-xl italic leading-snug text-ivory-50 transition-transform duration-700 ease-silk group-hover:translate-y-0">
                  <Quote size={18} className="mb-3 text-gold-400" />“{w.quote}”
                </p>
              </div>
              <div className="absolute inset-x-5 bottom-5 transition-opacity duration-500 group-hover:opacity-0">
                <p className="text-[0.6rem] uppercase tracking-[0.25em] text-gold-300">{w.craft}</p>
                <h3 className="mt-1 font-display text-2xl text-ivory-50">{w.name}</h3>
                <p className="text-xs text-ivory-100/55">
                  {w.region} · {w.years} years
                </p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
