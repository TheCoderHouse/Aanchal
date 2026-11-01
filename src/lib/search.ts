import { collections } from "@/data/collections";
import { products } from "@/data/products";
import type { Collection, Product } from "@/data/types";

export const trendingSearches = ["Bridal Banarasi", "Kanjeevaram", "Organza", "Pastel", "Handloom cotton", "Paithani"];

// Extra words people search for that map onto our catalogue
const synonyms: Record<string, string[]> = {
  pastel: ["blush", "mint", "lilac", "champagne", "ivory"],
  red: ["vermilion", "wine"],
  pink: ["rani", "blush"],
  green: ["emerald", "bottle", "mint"],
  blue: ["peacock", "indigo", "midnight"],
  yellow: ["mustard", "marigold"],
  gold: ["zari", "tissue"],
  wedding: ["bridal"],
  office: ["workwear"],
  kanchipuram: ["kanjeevaram"],
  kanjivaram: ["kanjeevaram"],
  benarasi: ["banarasi"],
};

function haystack(p: Product) {
  return [
    p.name,
    p.weave,
    p.fabric,
    p.region,
    p.collection.replace("-", " "),
    ...p.occasion,
    ...p.colorways.map((c) => c.name),
    p.handloom ? "handloom" : "",
  ]
    .join(" ")
    .toLowerCase();
}

/** Every word must match (directly or through a synonym). Name matches rank first. */
export function searchProducts(query: string, limit = 24) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return products
    .map((p) => {
      const text = haystack(p);
      let score = 0;
      for (const w of words) {
        const options = [w, ...(synonyms[w] ?? [])];
        const hit = options.find((o) => text.includes(o));
        if (!hit) return null;
        score += p.name.toLowerCase().includes(hit) ? 3 : 1;
      }
      if (p.isBestseller) score += 0.5;
      return { p, score };
    })
    .filter((r): r is { p: Product; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.p);
}

export function searchCollections(query: string): Collection[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return collections.filter(
    (c) => c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q) || (synonyms[q] ?? []).includes(c.slug),
  );
}
