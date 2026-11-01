"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { helpNav } from "@/data/help";
import { cn } from "@/lib/utils";

export function HelpNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Help topics" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
      <ul className="flex gap-2 lg:flex-col lg:gap-1">
        {helpNav.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative isolate block whitespace-nowrap px-4 py-3 text-sm transition-colors",
                  active ? "text-ivory-50" : "text-ivory-100/50 hover:text-ivory-100",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="help-nav"
                    className="absolute inset-0 -z-10 border-l-2 border-gold-400 bg-gold-400/5"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
