import type { Metadata } from "next";
import { ChapterNav } from "@/components/lookbook/ChapterNav";
import { LookbookChapter } from "@/components/lookbook/LookbookChapter";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealText } from "@/components/ui/RevealText";
import { chapters } from "@/data/lookbook";

export const metadata: Metadata = {
  title: "Lookbook · The Weave Edit",
  description: "Four chapters of handwoven sarees styled for weddings, temple mornings, city nights and summer days.",
};

export default function LookbookPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-36 md:px-8 md:pt-44">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Lookbook" }]} />
        <p className="eyebrow mt-10">Lookbook · Festive 2026</p>
        <RevealText
          as="h1"
          text="The Weave Edit"
          className="mt-5 font-display text-7xl font-light leading-[0.9] text-ivory-50 md:text-[10rem]"
        />
        <Reveal delay={0.3}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory-100/60">
            Four moods, sixteen sarees, one thread running through them all. Scroll through the chapters and shop any
            look straight from the page.
          </p>
        </Reveal>
      </section>

      <ChapterNav />

      {chapters.map((c, i) => (
        <LookbookChapter key={c.id} chapter={c} flip={i % 2 === 1} />
      ))}

      <section className="px-4 py-28 text-center md:px-8">
        <RevealText text="Find the one that feels like yours" className="justify-center font-display text-4xl font-light text-ivory-50 md:text-6xl" />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/shop" size="lg">
            Shop all sarees
          </Button>
          <Button href="/contact#video" variant="outline" size="lg">
            Book a styling call
          </Button>
        </div>
      </section>
    </>
  );
}
