import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "ivory";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-sans font-medium uppercase tracking-[0.18em] transition-[color,background-color,border-color,transform] duration-500 ease-silk disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "border border-gold-400 bg-gold-400 text-ink hover:text-gold-200 hover:border-gold-300 shadow-[0_10px_30px_-12px_var(--color-gold-500)]",
  outline:
    "border border-gold-500/60 text-gold-200 hover:border-gold-300 hover:text-ink",
  ghost: "text-ivory-100 hover:text-gold-300",
  ivory: "bg-ivory-100 text-wine-900 hover:bg-ivory-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.65rem]",
  md: "h-12 px-7 text-[0.7rem]",
  lg: "h-14 px-10 text-xs",
  icon: "h-11 w-11 text-xs",
};

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AsButton = Common & Omit<ComponentProps<"button">, keyof Common> & { href?: undefined };
type AsLink = Common & Omit<ComponentProps<typeof Link>, keyof Common> & { href: string };

/**
 * Hover effects drawn behind the label.
 * - outline: gold fill sweeps in from the left.
 * - primary: a dark wine panel rises from the bottom (text turns gold),
 *   and a thin line of light glints across once.
 */
function Sweep({ variant }: { variant: Variant }) {
  if (variant === "outline") {
    return (
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gold-300 transition-transform duration-500 ease-silk group-hover/btn:scale-x-100"
      />
    );
  }
  if (variant === "primary") {
    return (
      <>
        <span
          aria-hidden
          className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-gradient-to-t from-ink to-wine-950 transition-transform duration-500 ease-silk group-hover/btn:scale-y-100"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold-200/40 to-transparent opacity-0 transition-[left,opacity] duration-700 ease-silk group-hover/btn:left-[120%] group-hover/btn:opacity-100"
        />
      </>
    );
  }
  return null;
}

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], "isolate", className);

  if (typeof rest.href === "string") {
    return (
      <Link {...(rest as Omit<AsLink, keyof Common>)} className={classes}>
        <Sweep variant={variant} />
        {children}
      </Link>
    );
  }
  return (
    <button {...(rest as Omit<AsButton, keyof Common>)} className={classes}>
      <Sweep variant={variant} />
      {children}
    </button>
  );
}
