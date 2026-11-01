import { Video } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";

export function ConsultationCTA() {
  return (
    <section className="px-4 pb-24 md:px-8 md:pb-32">
      <div className="relative mx-auto max-w-7xl overflow-hidden border border-gold-500/20">
        <Image
          src="/images/consultation.jpg"
          alt="A stylist unfolding a peacock Paithani saree for a video call in the Aanchal studio"
          fill
          sizes="(min-width: 1280px) 80rem, 100vw"
          quality={90}
          className="object-cover object-[80%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/10" />
        <div className="relative grid max-w-2xl gap-10 px-6 py-16 md:px-16 md:py-24">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <Video size={14} /> Shop from home
            </p>
            <RevealText
              text="See every weave up close on a video call"
              className="mt-5 font-display text-4xl font-light leading-tight text-ivory-50 md:text-6xl"
            />
            <p className="mt-5 max-w-lg text-ivory-100/60">
              Our saree stylists will drape, compare and help you choose, live from our studio. Free, 30 minutes, in
              English, Hindi, Tamil or Bengali.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href="/contact#video" size="lg">
              Book a video call
            </Button>
            <p className="text-xs text-ivory-100/55">Available 10 am – 8 pm, all days</p>
          </div>
        </div>
      </div>
    </section>
  );
}
