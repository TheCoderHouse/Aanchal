import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Aanchal home" className={cn("group inline-flex flex-col items-center leading-none", className)}>
      <span className="font-display text-[1.9rem] font-light tracking-[0.28em] text-ivory-50 transition-colors duration-500 group-hover:text-gold-200">
        AANCHAL
      </span>
      <span className="mt-1 text-[0.5rem] uppercase tracking-[0.55em] text-gold-400">Handwoven · Since 1962</span>
    </Link>
  );
}
