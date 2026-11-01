import Link from "next/link";
import { Ornament } from "@/components/ui/Ornament";
import { FacebookIcon, InstagramIcon, PinterestIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { footerNav } from "@/data/navigation";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gold-500/15 bg-wine-950">
      {/* Soft gold glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20 md:px-8">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">The Aanchal letter</p>
            <h3 className="mt-4 font-display text-4xl font-light leading-tight text-ivory-50">
              New weaves, artisan stories and private previews.
            </h3>
            <NewsletterForm />
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {footerNav.map((col) => (
              <div key={col.title}>
                <p className="eyebrow mb-5">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-ivory-100/65 transition-colors hover:text-gold-200">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Ornament className="my-14" />

        {/* Giant wordmark */}
        <p
          aria-hidden
          className="text-gold-gradient select-none text-center font-display text-[18vw] font-light leading-[0.8] tracking-[0.06em] lg:text-[13rem]"
        >
          AANCHAL
        </p>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 text-xs text-ivory-100/45 md:flex-row">
          <p>© 2026 Aanchal Handlooms. A demo storefront.</p>
          <div className="flex items-center gap-5 text-ivory-100/60">
            {(
              [
                ["Instagram", InstagramIcon],
                ["Facebook", FacebookIcon],
                ["Pinterest", PinterestIcon],
                ["YouTube", YoutubeIcon],
              ] as const
            ).map(([name, Icon]) => (
              <a key={name} href="#" aria-label={`Aanchal on ${name} (demo link)`} className="transition-colors hover:text-gold-300">
                <Icon />
              </a>
            ))}
          </div>
          <p className="tracking-[0.2em] uppercase">Visa · Mastercard · UPI · RuPay</p>
        </div>
      </div>
    </footer>
  );
}
