import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { Reveal } from "@/components/ui/RevealText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

const tiles = [
  { occasion: "Bridal", note: "Heirlooms for your big day", slug: "mehtab-jaal-banarasi", span: "md:col-span-2 md:row-span-2" },
  { occasion: "Festive", note: "Pujas, Diwali and more", slug: "meenakshi-temple-kanjeevaram", span: "" },
  { occasion: "Party", note: "Cocktails and receptions", slug: "sitara-organza", span: "" },
  { occasion: "Workwear", note: "Light, easy, elegant", slug: "maheshwari-linen", span: "" },
  { occasion: "Everyday", note: "Breathable handloom cotton", slug: "dhakai-jamdani", span: "" },
];

export function ShopByOccasion() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading eyebrow="Shop by occasion" title="A saree for every moment" align="center" />
      <div className="mt-14 grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[260px] md:grid-cols-4">
        {tiles.map((t, i) => {
          const p = products.find((x) => x.slug === t.slug)!;
          return (
            <Reveal key={t.occasion} delay={i * 0.06} className={cn("h-full", t.span, i === 0 && "col-span-2 row-span-2")}>
              <Link
                href={`/shop?occasion=${t.occasion}`}
                data-cursor={t.occasion}
                className="group relative block h-full overflow-hidden"
              >
                <div className="absolute inset-0 transition-transform duration-[1.4s] ease-silk group-hover:scale-110">
                  <ProductImage product={p} colorway={p.colorways[0]} uid={`occ-${t.occasion}`} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition-opacity duration-700 group-hover:opacity-70" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                  <div>
                    <h3 className={cn("font-display text-ivory-50", i === 0 ? "text-5xl md:text-6xl" : "text-3xl")}>
                      {t.occasion}
                    </h3>
                    <p className="mt-1 text-xs text-ivory-100/60">{t.note}</p>
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="shrink-0 -translate-x-2 translate-y-2 text-gold-300 opacity-0 transition duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
