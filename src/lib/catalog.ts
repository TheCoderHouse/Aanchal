import { collections } from "@/data/collections";
import { products } from "@/data/products";
import type { Fabric, Occasion, Product } from "@/data/types";
import { searchProducts } from "./search";

/** Colour families used by the colour filter. */
export const colorFamilies = [
  { id: "red", label: "Red & Wine", swatch: "#8c1d36", names: ["Royal Wine", "Vermilion"] },
  { id: "pink", label: "Pink", swatch: "#c2186b", names: ["Rani Pink", "Blush"] },
  { id: "green", label: "Green", swatch: "#0f4a3c", names: ["Emerald", "Bottle Green", "Mint"] },
  { id: "blue", label: "Blue", swatch: "#1f3f6e", names: ["Peacock", "Indigo", "Midnight"] },
  { id: "yellow", label: "Yellow & Gold", swatch: "#d4a02a", names: ["Marigold", "Mustard"] },
  { id: "neutral", label: "Ivory & Beige", swatch: "#e9dcc3", names: ["Ivory Gold", "Champagne"] },
  { id: "purple", label: "Purple", swatch: "#9a86b8", names: ["Lilac"] },
  { id: "black", label: "Black", swatch: "#121012", names: ["Kohl Black"] },
] as const;

export const fabrics: Fabric[] = ["Silk", "Organza", "Tussar", "Cotton", "Linen", "Georgette"];
export const occasions: Occasion[] = ["Bridal", "Festive", "Party", "Workwear", "Everyday"];

export const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "New arrivals" },
  { id: "popular", label: "Most loved" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];

export const PRICE_MIN = 0;
export const PRICE_MAX = 75000;

export type Filters = {
  q: string;
  fabric: string[];
  occasion: string[];
  collection: string[];
  color: string[];
  handloom: boolean;
  min: number;
  max: number;
  sort: SortId;
};

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

/** Read filters from the URL query. */
export function parseFilters(params: URLSearchParams): Filters {
  const sort = params.get("sort");
  return {
    q: params.get("q")?.trim() ?? "",
    fabric: list(params.get("fabric")),
    occasion: list(params.get("occasion")),
    collection: list(params.get("collection")),
    color: list(params.get("color")),
    handloom: params.get("handloom") === "1",
    min: Number(params.get("min")) || PRICE_MIN,
    max: Number(params.get("max")) || PRICE_MAX,
    sort: sortOptions.some((o) => o.id === sort) ? (sort as SortId) : "featured",
  };
}

/** Write filters back to a query string (empty values are left out). */
export function filtersToQuery(f: Filters) {
  const q = new URLSearchParams();
  if (f.q) q.set("q", f.q);
  if (f.fabric.length) q.set("fabric", f.fabric.join(","));
  if (f.occasion.length) q.set("occasion", f.occasion.join(","));
  if (f.collection.length) q.set("collection", f.collection.join(","));
  if (f.color.length) q.set("color", f.color.join(","));
  if (f.handloom) q.set("handloom", "1");
  if (f.min > PRICE_MIN) q.set("min", String(f.min));
  if (f.max < PRICE_MAX) q.set("max", String(f.max));
  if (f.sort !== "featured") q.set("sort", f.sort);
  return q.toString();
}

export function activeFilterCount(f: Filters) {
  return (
    (f.q ? 1 : 0) +
    f.fabric.length +
    f.occasion.length +
    f.collection.length +
    f.color.length +
    (f.handloom ? 1 : 0) +
    (f.min > PRICE_MIN || f.max < PRICE_MAX ? 1 : 0)
  );
}

function matchesColor(p: Product, families: string[]) {
  if (!families.length) return true;
  const names = colorFamilies.filter((c) => families.includes(c.id)).flatMap((c) => c.names as readonly string[]);
  return p.colorways.some((cw) => names.includes(cw.name));
}

export function applyFilters(all: Product[], f: Filters) {
  const searched = f.q ? new Set(searchProducts(f.q, 100).map((p) => p.id)) : null;
  const result = all.filter(
    (p) =>
      (!searched || searched.has(p.id)) &&
      (!f.fabric.length || f.fabric.includes(p.fabric)) &&
      (!f.occasion.length || p.occasion.some((o) => f.occasion.includes(o))) &&
      (!f.collection.length || f.collection.includes(p.collection)) &&
      (!f.handloom || p.handloom) &&
      p.price >= f.min &&
      p.price <= f.max &&
      matchesColor(p, f.color),
  );

  const sorted = [...result];
  switch (f.sort) {
    case "new":
      sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
      break;
    case "popular":
      sorted.sort((a, b) => b.reviews - a.reviews);
      break;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    default:
      // Featured: bestsellers first, keep catalogue order otherwise
      sorted.sort((a, b) => Number(!!b.isBestseller) - Number(!!a.isBestseller));
  }
  return sorted;
}

/** How many products each filter option would match, for the counts beside options. */
export function optionCount(key: "fabric" | "occasion" | "collection", value: string) {
  return products.filter((p) =>
    key === "occasion" ? p.occasion.includes(value as Occasion) : p[key] === value,
  ).length;
}

export function relatedProducts(product: Product, count = 4) {
  const same = products.filter((p) => p.id !== product.id && p.collection === product.collection);
  const others = products.filter(
    (p) => p.id !== product.id && p.collection !== product.collection && p.occasion.some((o) => product.occasion.includes(o)),
  );
  return [...same, ...others].slice(0, count);
}

export { collections, products };
