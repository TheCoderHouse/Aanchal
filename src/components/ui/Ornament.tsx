import { cn } from "@/lib/utils";

/** Gold divider with a small lotus-diamond in the middle. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 text-gold-500", className)} aria-hidden>
      <span className="gold-hairline flex-1" />
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
        <path d="M14 1 L19 7 L14 13 L9 7 Z" stroke="currentColor" strokeWidth="1" />
        <circle cx="14" cy="7" r="1.6" fill="currentColor" />
        <circle cx="3" cy="7" r="1" fill="currentColor" />
        <circle cx="25" cy="7" r="1" fill="currentColor" />
      </svg>
      <span className="gold-hairline flex-1" />
    </div>
  );
}
