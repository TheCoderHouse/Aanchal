import { BadgeCheck } from "lucide-react";
import { getReviews, ratingBreakdown } from "@/data/reviews";
import type { Product } from "@/data/types";
import { RatingStars } from "./RatingStars";

export function ReviewsSection({ product }: { product: Product }) {
  const reviews = getReviews(product);
  const breakdown = ratingBreakdown(product.rating);

  return (
    <section id="reviews" className="scroll-mt-32 border-t border-ivory-100/10 py-20">
      <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-20">
        <div>
          <p className="eyebrow">Reviews</p>
          <p className="mt-4 font-display text-7xl font-light text-ivory-50">{product.rating.toFixed(1)}</p>
          <RatingStars rating={product.rating} size={16} className="mt-2" />
          <p className="mt-2 text-sm text-ivory-100/50">Based on {product.reviews} reviews</p>
          <div className="mt-8 space-y-2">
            {breakdown.map((pct, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-ivory-100/50">
                <span className="w-3">{5 - i}</span>
                <div className="h-1 flex-1 bg-ivory-100/10">
                  <div className="h-full bg-gold-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-ivory-100/10 pb-8">
              <RatingStars rating={r.rating} />
              <p className="mt-3 font-display text-2xl text-ivory-50">{r.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ivory-100/60">{r.body}</p>
              <p className="mt-4 flex flex-wrap items-center gap-x-2 text-xs text-ivory-100/45">
                <span className="text-ivory-100/80">{r.name}</span> · {r.city} · {r.date}
                {r.verified && (
                  <span className="flex items-center gap-1 text-gold-400">
                    <BadgeCheck size={12} /> Verified buyer
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
