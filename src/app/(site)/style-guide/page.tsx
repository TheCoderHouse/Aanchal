import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductCard } from "@/components/product/ProductCard";
import { RatingStars } from "@/components/product/RatingStars";
import { SareeArt } from "@/components/product/SareeArt";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/RevealText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { DisclosureDemo, InteractiveButtons, SwatchDemo } from "./Demos";

export const metadata: Metadata = { title: "Style guide" };

const palette = [
  { group: "Wine", tokens: [["ink", "#0d0608"], ["wine-950", "#160910"], ["wine-900", "#220c16"], ["wine-800", "#3a1222"], ["wine-700", "#5a1830"], ["wine-600", "#7d2140"], ["wine-500", "#a12d52"]] },
  { group: "Antique gold", tokens: [["gold-200", "#f1e3c0"], ["gold-300", "#e6cf96"], ["gold-400", "#d6b36c"], ["gold-500", "#c09a4c"], ["gold-600", "#9c7a36"], ["gold-700", "#6f5626"]] },
  { group: "Ivory", tokens: [["ivory-50", "#fdfaf4"], ["ivory-100", "#f7f0e3"], ["ivory-200", "#ece0c9"], ["ivory-300", "#d9c9aa"]] },
  { group: "Jewel accents", tokens: [["emerald-deep", "#0f4a3c"], ["peacock", "#0e5468"], ["marigold", "#e39a2d"], ["rani", "#c2186b"]] },
] as const;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-ivory-100/10 py-16">
      <p className="eyebrow mb-8">{title}</p>
      {children}
    </section>
  );
}

export default function StyleGuide() {
  const cards = [products[0], products[4], products[12], products[16]];

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Round 1 · Foundation"
        title="The Aanchal style guide"
        description="Colours, type and building blocks shared by every screen. Review these before we build the 3D home page."
      />

      <Section id="colours" title="01 · Colour">
        <div className="space-y-10">
          {palette.map((g) => (
            <div key={g.group}>
              <p className="mb-4 font-display text-2xl text-ivory-50">{g.group}</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {g.tokens.map(([name, hex]) => (
                  <div key={name}>
                    <div className="aspect-square ring-1 ring-ivory-100/10" style={{ background: hex }} />
                    <p className="mt-2 text-xs text-ivory-100/80">{name}</p>
                    <p className="text-[0.65rem] uppercase text-ivory-100/40">{hex}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="type" title="02 · Typography">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-xs text-ivory-100/40">Display: Cormorant Garamond</p>
            <p className="font-display text-7xl font-light leading-none text-ivory-50 md:text-8xl">Kanjeevaram</p>
            <p className="font-display text-5xl italic text-gold-gradient">Woven in gold</p>
            <p className="font-display text-3xl text-ivory-100">Heirlooms for every celebration</p>
          </div>
          <div className="space-y-6">
            <p className="text-xs text-ivory-100/40">Body: Manrope</p>
            <p className="eyebrow">Eyebrow · small caps label</p>
            <p className="text-lg text-ivory-100/85">
              Pure katan silk with hand-knotted gold zari butas and a heavy floral pallu.
            </p>
            <p className="text-sm leading-relaxed text-ivory-100/55">
              Body copy sits in soft ivory at reduced opacity, so gold accents and display headings carry the page.
              Line length stays under 70 characters for comfortable reading.
            </p>
            <div className="flex items-center gap-6">
              <PriceTag price={48500} compareAt={54000} size="lg" />
              <RatingStars rating={4.7} reviews={128} size={14} />
            </div>
          </div>
        </div>
      </Section>

      <Section id="buttons" title="03 · Buttons & badges">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <Button>Add to bag</Button>
            <Button variant="outline">Explore collection</Button>
            <Button variant="ivory">Book a video call</Button>
            <Button variant="ghost">
              Read the story <ArrowUpRight size={14} />
            </Button>
            <Button size="sm">Small</Button>
            <Button disabled>Sold out</Button>
          </div>
          <InteractiveButtons />
          <div className="flex flex-wrap gap-3">
            <Badge>Bestseller</Badge>
            <Badge tone="ivory">New</Badge>
            <Badge tone="wine">Only 2 left</Badge>
            <Badge tone="outline">Handloom</Badge>
          </div>
        </div>
      </Section>

      <Section id="forms" title="04 · Form fields">
        <div className="grid max-w-3xl gap-8 sm:grid-cols-2">
          <Input label="Full name" />
          <Input label="Email address" type="email" />
          <Input label="Phone" type="tel" hint="We'll only call about your order." />
          <Input label="Pincode" inputMode="numeric" />
        </div>
      </Section>

      <Section id="cards" title="05 · Product cards">
        <p className="mb-8 max-w-xl text-sm text-ivory-100/55">
          Hover a card to see the 3D tilt, light glare and pallu close-up. Swatches change the colour. Quick add opens
          the bag.
        </p>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {cards.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </Section>

      <Section id="art" title="06 · Placeholder artwork">
        <p className="mb-8 max-w-xl text-sm text-ivory-100/55">
          Each saree is drawn from its colours and motif until real photos are added. These also become textures for
          the 3D scenes in Round 2.
        </p>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {collections.map((c) => (
            <Reveal key={c.slug}>
              <div className="aspect-[3/4] overflow-hidden">
                <SareeArt colorway={c.palette} motif={c.motif} uid={`sg-${c.slug}`} />
              </div>
              <p className="mt-2 font-display text-lg text-ivory-50">{c.name}</p>
              <p className="text-[0.65rem] uppercase tracking-widest text-ivory-100/40">{c.motif}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <SwatchDemo />
        </div>
      </Section>

      <Section id="disclosure" title="07 · Accordion & tabs">
        <DisclosureDemo />
      </Section>

      <Section id="ornament" title="08 · Ornament">
        <Ornament />
      </Section>
    </PageShell>
  );
}
