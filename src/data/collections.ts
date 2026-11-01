import type { Collection } from "./types";

export const collections: Collection[] = [
  {
    slug: "banarasi",
    name: "Banarasi",
    tagline: "Woven gold from the ghats of Varanasi",
    region: "Varanasi, Uttar Pradesh",
    story:
      "Mughal-era kadhwa weaving, where every buta is hand-knotted with real zari on a pit loom. A single saree can take a master weaver up to six weeks.",
    palette: { name: "Royal Wine", base: "#6b1530", border: "#c09a4c", accent: "#e6cf96" },
    motif: "buta",
  },
  {
    slug: "kanjeevaram",
    name: "Kanjeevaram",
    tagline: "Temple borders, mulberry silk",
    region: "Kanchipuram, Tamil Nadu",
    story:
      "Body and border are woven separately and interlocked by hand with korvai, so the contrast border never fades or tears.",
    palette: { name: "Temple Green", base: "#0f4a3c", border: "#b8222e", accent: "#d6b36c" },
    motif: "temple",
  },
  {
    slug: "chanderi",
    name: "Chanderi",
    tagline: "Featherlight sheer, coin butis",
    region: "Chanderi, Madhya Pradesh",
    story:
      "A sheer blend of silk and cotton with a glass-like finish, scattered with tiny gold coin motifs woven by hand.",
    palette: { name: "Pearl Blush", base: "#e9c9c0", border: "#c09a4c", accent: "#fdfaf4" },
    motif: "checks",
  },
  {
    slug: "paithani",
    name: "Paithani",
    tagline: "Peacocks on a tapestry pallu",
    region: "Paithan, Maharashtra",
    story:
      "Known as the queen of silks, its pallu is woven like a tapestry, with peacocks and lotus vines in a shot-silk ground.",
    palette: { name: "Peacock Teal", base: "#0e5468", border: "#c2186b", accent: "#e6cf96" },
    motif: "paisley",
  },
  {
    slug: "organza",
    name: "Organza",
    tagline: "Modern sheer, hand-embroidered",
    region: "Bengaluru, Karnataka",
    story:
      "Crisp silk organza with delicate hand embroidery, made for cocktail evenings and modern celebrations.",
    palette: { name: "Champagne", base: "#d8c3a0", border: "#9c7a36", accent: "#fdfaf4" },
    motif: "jaal",
  },
  {
    slug: "handloom-cotton",
    name: "Handloom Cotton",
    tagline: "Breathable, everyday elegance",
    region: "Phulia, West Bengal",
    story:
      "Soft handspun cotton in jamdani and stripe weaves, made for long days and easy draping.",
    palette: { name: "Indigo Dusk", base: "#24305e", border: "#e39a2d", accent: "#f7f0e3" },
    motif: "stripes",
  },
];

// Every collection has an editorial photo named after its slug
for (const c of collections) c.image = `/images/collections/${c.slug}.png`;

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}
