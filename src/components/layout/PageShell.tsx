import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Standard page container that clears the fixed header. */
export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-7xl px-4 pb-24 pt-36 md:px-8 md:pt-40", className)}>{children}</div>;
}
