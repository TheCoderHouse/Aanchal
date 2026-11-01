import { cn } from "@/lib/utils";
import { RevealText } from "./RevealText";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <RevealText
        text={title}
        className={cn(
          "font-display text-4xl font-light leading-[1.05] text-ivory-50 md:text-6xl",
          align === "center" && "justify-center",
        )}
      />
      {description && <p className="mt-5 text-[0.95rem] leading-relaxed text-ivory-100/60">{description}</p>}
    </div>
  );
}
