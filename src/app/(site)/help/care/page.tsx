import type { Metadata } from "next";
import { SareeArt } from "@/components/product/SareeArt";
import { Reveal } from "@/components/ui/RevealText";
import { collections } from "@/data/collections";
import { careGuide } from "@/data/help";

export const metadata: Metadata = { title: "Saree care guide" };

export default function CarePage() {
  return (
    <>
      <h1 className="font-display text-5xl font-light text-ivory-50 md:text-7xl">Caring for your saree</h1>
      <p className="mt-4 max-w-xl text-ivory-100/55">
        A handwoven saree can last generations. A little care keeps the silk soft and the zari bright. And every Aanchal
        saree gets free zari re-polishing for life.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {careGuide.map((g, i) => {
          const c = collections[i % collections.length];
          return (
            <Reveal key={g.title} delay={i * 0.06} className="group relative overflow-hidden border border-gold-500/15 p-6">
              <div className="absolute inset-0 opacity-[0.12] transition-opacity duration-700 group-hover:opacity-25">
                <SareeArt colorway={c.palette} motif={c.motif} view="pallu" uid={`care-${i}`} />
              </div>
              <div className="relative">
                <p className="font-display text-3xl text-ivory-50">{g.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {g.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-relaxed text-ivory-100/70">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
