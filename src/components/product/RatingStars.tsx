import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  reviews,
  size = 12,
  className,
}: {
  rating: number;
  reviews?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-label={`Rated ${rating} out of 5`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="absolute text-ivory-100/20" strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} className="fill-gold-400 text-gold-400" strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      {reviews !== undefined && <span className="text-[0.7rem] text-ivory-100/45">({reviews})</span>}
    </div>
  );
}
