import { BestsellersCarousel } from "@/components/home/BestsellersCarousel";
import { CollectionsScroller } from "@/components/home/CollectionsScroller";
import { ConsultationCTA } from "@/components/home/ConsultationCTA";
import { CraftStory } from "@/components/home/CraftStory";
import { DrapedByYou } from "@/components/home/DrapedByYou";
import { FabricMarquee } from "@/components/home/FabricMarquee";
import { Hero } from "@/components/home/Hero";
import { Promises } from "@/components/home/Promises";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <FabricMarquee />
      <CollectionsScroller />
      <BestsellersCarousel />
      <CraftStory />
      <ShopByOccasion />
      <Testimonials />
      <DrapedByYou />
      <ConsultationCTA />
      <Promises />
    </>
  );
}
