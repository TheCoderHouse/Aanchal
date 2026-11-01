import type { MetadataRoute } from "next";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/lookbook", "/about", "/contact", "/help/faq", "/help/shipping", "/help/returns", "/help/care"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...collections.map((c) => ({ url: `${SITE_URL}/collections/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
  ];
}
