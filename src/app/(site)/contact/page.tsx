import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { VideoCallBooking } from "@/components/contact/VideoCallBooking";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { RevealText } from "@/components/ui/RevealText";

export const metadata: Metadata = { title: "Contact us" };

const channels = [
  { icon: MessageCircle, label: "WhatsApp", value: "+91 98765 43210", note: "Replies within an hour", href: "https://wa.me/919876543210" },
  { icon: Phone, label: "Call us", value: "1800 123 4567", note: "Toll free, 10 am – 8 pm", href: "tel:18001234567" },
  { icon: Mail, label: "Email", value: "care@aanchal.example", note: "Replies within a day", href: "mailto:care@aanchal.example" },
];

const studios = [
  { city: "Varanasi", name: "Flagship studio & workshop", address: "D 47/12, Ramapura, near Dashashwamedh Ghat, Varanasi 221001", hours: "10 am – 8 pm, all days" },
  { city: "Bengaluru", name: "Styling studio", address: "14, 1st Floor, 12th Main, Indiranagar, Bengaluru 560038", hours: "11 am – 8 pm, closed Tuesdays" },
];

export default function ContactPage() {
  return (
    <PageShell>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <RevealText as="h1" text="We'd love to hear from you" className="mt-8 font-display text-5xl font-light leading-[1.02] text-ivory-50 md:text-7xl" />
      <p className="mt-5 max-w-xl text-ivory-100/55">
        Questions about an order, a bridal piece, or which weave suits an occasion? Write to us, call, or book a video
        styling session.
      </p>

      <div className="mt-16 grid gap-16 lg:grid-cols-[1.3fr_1fr]">
        <ContactForm />

        <aside className="space-y-10">
          <ul className="space-y-3">
            {channels.map(({ icon: Icon, label, value, note, href }) => (
              <li key={label}>
                <a href={href} className="group flex items-center gap-4 border border-ivory-100/10 p-4 transition hover:border-gold-500/40">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-500/30 text-gold-300 transition group-hover:bg-gold-400 group-hover:text-ink">
                    <Icon size={17} strokeWidth={1.4} />
                  </span>
                  <span>
                    <span className="block text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/45">{label}</span>
                    <span className="block text-ivory-50">{value}</span>
                    <span className="block text-xs text-ivory-100/45">{note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {studios.map((s) => (
            <div key={s.city}>
              <p className="eyebrow">{s.city}</p>
              <p className="mt-2 font-display text-2xl text-ivory-50">{s.name}</p>
              <p className="mt-2 flex gap-2 text-sm text-ivory-100/60">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold-500" /> {s.address}
              </p>
              <p className="mt-1 flex gap-2 text-sm text-ivory-100/60">
                <Clock size={15} className="mt-0.5 shrink-0 text-gold-500" /> {s.hours}
              </p>
            </div>
          ))}
        </aside>
      </div>

      <section id="video" className="mt-28 scroll-mt-28">
        <VideoCallBooking />
      </section>
    </PageShell>
  );
}
