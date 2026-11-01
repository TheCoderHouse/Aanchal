import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

/** Calm header for checkout: no menus, just a way back and the brand. */
export function CheckoutHeader({ backHref = "/cart", backLabel = "Back to bag" }: { backHref?: string; backLabel?: string }) {
  return (
    <header className="border-b border-gold-500/10 bg-wine-950/60">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
        <Link href={backHref} className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-ivory-100/60 hover:text-gold-300">
          <ArrowLeft size={14} /> <span className="max-sm:hidden">{backLabel}</span>
        </Link>
        <Logo />
        <p className="flex items-center justify-end gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-ivory-100/60">
          <Lock size={13} className="text-gold-400" /> <span className="max-sm:hidden">Secure checkout</span>
        </p>
      </div>
    </header>
  );
}
