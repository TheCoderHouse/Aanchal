import { cn, discountPercent, formatPrice } from "@/lib/utils";

export function PriceTag({
  price,
  compareAt,
  size = "md",
  className,
}: {
  price: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const off = discountPercent(price, compareAt);
  return (
    <div className={cn("flex items-baseline gap-2.5", className)}>
      <span
        className={cn(
          "font-display text-ivory-50",
          size === "sm" && "text-lg",
          size === "md" && "text-xl",
          size === "lg" && "text-4xl",
        )}
      >
        {formatPrice(price)}
      </span>
      {off > 0 && (
        <>
          <span className="text-xs text-ivory-100/40 line-through">{formatPrice(compareAt!)}</span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-gold-400">{off}% off</span>
        </>
      )}
    </div>
  );
}
