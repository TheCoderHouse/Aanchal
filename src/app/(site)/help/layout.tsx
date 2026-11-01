import { MessageCircle } from "lucide-react";
import { HelpNav } from "@/components/help/HelpNav";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell>
      <p className="eyebrow">Help & care</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <HelpNav />
          <div className="mt-10 hidden border border-gold-500/15 p-5 lg:block">
            <p className="font-display text-xl text-ivory-50">Still need help?</p>
            <p className="mt-2 text-xs leading-relaxed text-ivory-100/50">Our team replies on WhatsApp within an hour, 10 am – 8 pm.</p>
            <Button href="/contact" variant="outline" size="sm" className="mt-4 w-full">
              <MessageCircle size={13} /> Contact us
            </Button>
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </PageShell>
  );
}
