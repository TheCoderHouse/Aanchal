import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "gold" | "wine" | "ivory" | "outline";

const tones: Record<Tone, string> = {
  gold: "bg-gold-400 text-ink",
  wine: "bg-wine-600 text-ivory-50",
  ivory: "bg-ivory-100 text-wine-900",
  outline: "border border-gold-400/50 text-gold-300",
};

export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
