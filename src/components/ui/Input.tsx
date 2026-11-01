import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input"> & { label: string; hint?: string; error?: string | null };

/** Underlined input with a floating label. */
export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const inputId = id ?? `in-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={cn("group relative pt-5", className)}>
      <input
        id={inputId}
        placeholder=" "
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className="peer w-full border-0 border-b border-ivory-100/20 bg-transparent aria-[invalid]:border-wine-500 pb-2 font-sans text-[0.95rem] text-ivory-50 outline-none transition-colors duration-300 focus:border-gold-400"
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute left-0 top-5 origin-left text-[0.95rem] text-ivory-100/50 transition-all duration-300 ease-silk peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-gold-400 peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-75"
      >
        {label}
      </label>
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold-300 transition-transform duration-500 ease-silk peer-focus:scale-x-100" />
      {error ? (
        <p id={`${inputId}-error`} className="mt-2 text-xs text-wine-500">
          {error}
        </p>
      ) : (
        hint && <p className="mt-2 text-xs text-ivory-100/40">{hint}</p>
      )}
    </div>
  );
}
