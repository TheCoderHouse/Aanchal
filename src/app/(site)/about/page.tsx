import type { Metadata } from "next";
import Image from "next/image";
import { ImpactNumbers } from "@/components/about/ImpactNumbers";
import { LoomSection } from "@/components/about/LoomSection";
import { Timeline } from "@/components/about/Timeline";
import { WeaverCards } from "@/components/about/WeaverCards";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal, RevealText } from "@/components/ui/RevealText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { values } from "@/data/story";

export const metadata: Metadata = {
  title: "Our story",
  description: "Since 1962, Aanchal has worked with master weavers across India to bring handwoven sarees from their looms to you.",
};

export default function AboutPage() {
  return (
    <>
      {/* Opening */}
      <section className="relative overflow-hidden pb-24 pt-36 md:pt-44">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Our story" }]} />
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow">Our story · Since 1962</p>
            <RevealText
              as="h1"
              text="One thread at a time, for three generations"
              className="mt-5 font-display text-5xl font-light leading-[1.02] text-ivory-50 md:text-7xl"
            />
            <Reveal delay={0.3}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ivory-100/65">
                Aanchal began with one loom by the ghats of Varanasi. Today we work with forty weaver families across
                six traditions, and every saree we sell is still made by hand.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="relative aspect-[4/5] overflow-hidden border border-gold-500/20">
            {/* Close crop of the weaver's hands from the home page photo */}
            <Image
              src="/images/hero/weaver.png"
              alt="A weaver's hands on the beater of a handloom"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              quality={90}
              className="scale-[1.9] object-cover object-[68%_55%]"
              style={{ transformOrigin: "68% 50%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/70">
              Ustad Rafiq Ansari · Varanasi
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y border-gold-500/10 bg-wine-950 px-4 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow="Since 1962" title="Six decades on the loom" align="center" className="mb-20" />
        <Timeline />
      </section>

      {/* Live loom */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeading
          eyebrow="The craft"
          title="See how a saree is woven"
          description="Every thread of a handloom saree is placed in three movements, repeated tens of thousands of times. Drag the loom to look around it."
          className="mb-14"
        />
        <LoomSection />
      </section>

      {/* Weavers */}
      <section id="weavers" className="scroll-mt-28 border-t border-gold-500/10 bg-wine-950 px-4 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="The hands behind it"
            title="Meet the weavers"
            description="Hover a portrait to hear from them. Every saree ships with a card signed by the person who wove it."
            className="mb-14"
          />
          <WeaverCards />
        </div>
      </section>

      {/* Impact and values */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <ImpactNumbers />
        <div className="mt-24 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <span className="font-display text-5xl text-gold-500/40">0{i + 1}</span>
              <h3 className="mt-3 font-display text-2xl text-ivory-50">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory-100/55">{v.text}</p>
            </Reveal>
          ))}
        </div>
        <Ornament className="mx-auto my-24 max-w-md" />
        <div className="text-center">
          <RevealText
            text="Carry a piece of their story"
            className="justify-center font-display text-4xl font-light text-ivory-50 md:text-6xl"
          />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/shop" size="lg">
              Shop the collection
            </Button>
            <Button href="/lookbook" variant="outline" size="lg">
              View the lookbook
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
