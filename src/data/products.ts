import type { Colorway, Product } from "./types";

// Reusable colourways
const c = (name: string, base: string, border: string, accent: string): Colorway => ({
  name,
  base,
  border,
  accent,
});

const WINE = c("Royal Wine", "#6b1530", "#c09a4c", "#e6cf96");
const RANI = c("Rani Pink", "#b3175f", "#d6b36c", "#f1e3c0");
const EMERALD = c("Emerald", "#0f4a3c", "#c09a4c", "#e6cf96");
const PEACOCK = c("Peacock", "#0e5468", "#c2186b", "#e6cf96");
const MARIGOLD = c("Marigold", "#d4851c", "#7d2140", "#f1e3c0");
const IVORY = c("Ivory Gold", "#efe4cf", "#c09a4c", "#9c7a36");
const MIDNIGHT = c("Midnight", "#161a3a", "#c09a4c", "#d6b36c");
const BLUSH = c("Blush", "#e9c9c0", "#c09a4c", "#fdfaf4");
const MUSTARD = c("Mustard", "#c99a22", "#5a1830", "#f7f0e3");
const BOTTLE = c("Bottle Green", "#1d3b2a", "#b8222e", "#d6b36c");
const LILAC = c("Lilac", "#9a86b8", "#c09a4c", "#fdfaf4");
const INDIGO = c("Indigo", "#24305e", "#e39a2d", "#f7f0e3");
const VERMILION = c("Vermilion", "#b8222e", "#0f4a3c", "#d6b36c");
const CHAMPAGNE = c("Champagne", "#d8c3a0", "#9c7a36", "#fdfaf4");
const MINT = c("Mint", "#a8cdb8", "#c09a4c", "#fdfaf4");
const BLACK = c("Kohl Black", "#121012", "#c09a4c", "#e6cf96");

const SILK_DETAILS = [
  "Saree length: 5.5 m, with 0.8 m unstitched blouse piece",
  "Fall and pico available as an add-on",
  "Dry clean only. Store wrapped in muslin",
];
const COTTON_DETAILS = [
  "Saree length: 5.5 m, with 0.8 m unstitched blouse piece",
  "Gentle hand wash in cold water, dry in shade",
  "Colours may bleed slightly on the first wash",
];

export const products: Product[] = [
  // ── Banarasi ──
  {
    id: "p01", slug: "noor-kadhwa-banarasi", name: "Noor Kadhwa Banarasi",
    collection: "banarasi", fabric: "Silk", weave: "Kadhwa", region: "Varanasi",
    occasion: ["Bridal", "Festive"], motif: "buta", colorways: [WINE, RANI, EMERALD],
    price: 48500, compareAt: 54000, rating: 4.9, reviews: 128, isBestseller: true, handloom: true,
    description: "Pure katan silk with hand-knotted gold zari butas and a heavy floral pallu. Woven on a pit loom over five weeks.",
    details: SILK_DETAILS,
  },
  {
    id: "p02", slug: "mehtab-jaal-banarasi", name: "Mehtab Jaal Banarasi",
    collection: "banarasi", fabric: "Silk", weave: "Jangla", region: "Varanasi",
    occasion: ["Bridal"], motif: "jaal", colorways: [VERMILION, WINE],
    price: 62000, rating: 5.0, reviews: 41, handloom: true,
    description: "An all-over jangla jaal of vines in antique gold zari. Made for the bride who wants heirloom weight.",
    details: SILK_DETAILS,
  },
  {
    id: "p03", slug: "chandni-tissue-banarasi", name: "Chandni Tissue Banarasi",
    collection: "banarasi", fabric: "Silk", weave: "Tissue", region: "Varanasi",
    occasion: ["Festive", "Party"], motif: "stripes", colorways: [IVORY, CHAMPAGNE, BLUSH],
    price: 28900, compareAt: 32000, rating: 4.7, reviews: 86, isNew: true,
    description: "Shimmering tissue silk with a fine stripe of silver and gold, light enough to wear all evening.",
    details: SILK_DETAILS,
  },
  {
    id: "p04", slug: "raat-rani-banarasi", name: "Raat Rani Banarasi",
    collection: "banarasi", fabric: "Georgette", weave: "Cutwork", region: "Varanasi",
    occasion: ["Party"], motif: "buta", colorways: [BLACK, MIDNIGHT],
    price: 21500, rating: 4.8, reviews: 64, isBestseller: true,
    description: "Soft khaddi georgette with scattered gold cutwork butas. Drapes fluidly for cocktail nights.",
    details: SILK_DETAILS,
  },
  // ── Kanjeevaram ──
  {
    id: "p05", slug: "meenakshi-temple-kanjeevaram", name: "Meenakshi Temple Kanjeevaram",
    collection: "kanjeevaram", fabric: "Silk", weave: "Korvai", region: "Kanchipuram",
    occasion: ["Bridal", "Festive"], motif: "temple", colorways: [EMERALD, MARIGOLD, VERMILION],
    price: 54000, compareAt: 59500, rating: 4.9, reviews: 112, isBestseller: true, handloom: true,
    description: "Heavy mulberry silk with a hand-interlocked korvai temple border and a rich zari pallu.",
    details: SILK_DETAILS,
  },
  {
    id: "p06", slug: "kamakshi-checks-kanjeevaram", name: "Kamakshi Checks Kanjeevaram",
    collection: "kanjeevaram", fabric: "Silk", weave: "Kattam", region: "Kanchipuram",
    occasion: ["Festive"], motif: "checks", colorways: [MUSTARD, RANI],
    price: 36500, rating: 4.8, reviews: 73, handloom: true,
    description: "Classic kattam checks with a contrast border, a favourite for weddings and temple visits.",
    details: SILK_DETAILS,
  },
  {
    id: "p07", slug: "vaira-oosi-kanjeevaram", name: "Vaira Oosi Kanjeevaram",
    collection: "kanjeevaram", fabric: "Silk", weave: "Vaira Oosi", region: "Kanchipuram",
    occasion: ["Festive", "Party"], motif: "buta", colorways: [PEACOCK, BOTTLE],
    price: 41200, rating: 4.7, reviews: 39, isNew: true, handloom: true,
    description: "Needle-point diamond motifs woven across the body, finished with a slim gold border.",
    details: SILK_DETAILS,
  },
  {
    id: "p08", slug: "soft-silk-thazhampoo", name: "Thazhampoo Soft Silk",
    collection: "kanjeevaram", fabric: "Silk", weave: "Soft silk", region: "Kanchipuram",
    occasion: ["Workwear", "Festive"], motif: "stripes", colorways: [LILAC, MINT, BLUSH],
    price: 16800, compareAt: 18900, rating: 4.6, reviews: 95,
    description: "A lighter Kanjeevaram without heavy zari, easy to wear from office to evening puja.",
    details: SILK_DETAILS,
  },
  // ── Chanderi ──
  {
    id: "p09", slug: "sikka-buti-chanderi", name: "Sikka Buti Chanderi",
    collection: "chanderi", fabric: "Silk", weave: "Buti", region: "Chanderi",
    occasion: ["Festive", "Workwear"], motif: "checks", colorways: [BLUSH, MINT, IVORY],
    price: 12400, rating: 4.7, reviews: 58, isBestseller: true, handloom: true,
    description: "Sheer silk-cotton with tiny coin butis in gold. Light, airy and endlessly elegant.",
    details: SILK_DETAILS,
  },
  {
    id: "p10", slug: "nalferma-chanderi", name: "Nalferma Chanderi",
    collection: "chanderi", fabric: "Cotton", weave: "Nalferma", region: "Chanderi",
    occasion: ["Workwear", "Everyday"], motif: "stripes", colorways: [MUSTARD, INDIGO],
    price: 8900, rating: 4.5, reviews: 47, handloom: true,
    description: "Traditional nalferma stripes with a contrast gold border. Made for long days.",
    details: COTTON_DETAILS,
  },
  {
    id: "p11", slug: "gulnaar-chanderi", name: "Gulnaar Chanderi",
    collection: "chanderi", fabric: "Silk", weave: "Meenakari", region: "Chanderi",
    occasion: ["Festive"], motif: "paisley", colorways: [RANI, WINE],
    price: 14700, compareAt: 16500, rating: 4.8, reviews: 33, isNew: true,
    description: "Meenakari paisleys in pink and gold scattered across a translucent silk body.",
    details: SILK_DETAILS,
  },
  {
    id: "p12", slug: "safed-chanderi", name: "Safed Chanderi",
    collection: "chanderi", fabric: "Cotton", weave: "Plain", region: "Chanderi",
    occasion: ["Everyday", "Workwear"], motif: "checks", colorways: [IVORY],
    price: 6500, rating: 4.6, reviews: 71,
    description: "An ivory classic with a thin gold edge. The saree every wardrobe needs.",
    details: COTTON_DETAILS,
  },
  // ── Paithani ──
  {
    id: "p13", slug: "mor-pankh-paithani", name: "Mor Pankh Paithani",
    collection: "paithani", fabric: "Silk", weave: "Tapestry", region: "Paithan",
    occasion: ["Bridal", "Festive"], motif: "paisley", colorways: [PEACOCK, RANI, MARIGOLD],
    price: 72000, rating: 5.0, reviews: 27, isBestseller: true, handloom: true,
    description: "A tapestry-woven peacock pallu in shot silk. Each one is unique and takes up to two months.",
    details: SILK_DETAILS,
  },
  {
    id: "p14", slug: "asavali-paithani", name: "Asavali Paithani",
    collection: "paithani", fabric: "Silk", weave: "Asavali", region: "Paithan",
    occasion: ["Festive"], motif: "jaal", colorways: [MARIGOLD, EMERALD],
    price: 46500, compareAt: 51000, rating: 4.9, reviews: 19, handloom: true,
    description: "Flowering asavali vines climbing the border, set against a glowing marigold ground.",
    details: SILK_DETAILS,
  },
  {
    id: "p15", slug: "semi-paithani-kamal", name: "Kamal Semi Paithani",
    collection: "paithani", fabric: "Silk", weave: "Semi Paithani", region: "Yeola",
    occasion: ["Festive", "Party"], motif: "buta", colorways: [LILAC, BOTTLE],
    price: 18900, rating: 4.6, reviews: 52, isNew: true,
    description: "Lotus butis and a classic Paithani border at an easier weight and price.",
    details: SILK_DETAILS,
  },
  {
    id: "p16", slug: "kadiyal-paithani", name: "Kadiyal Paithani",
    collection: "paithani", fabric: "Silk", weave: "Kadiyal", region: "Paithan",
    occasion: ["Bridal"], motif: "temple", colorways: [VERMILION, PEACOCK],
    price: 58000, rating: 4.9, reviews: 14, handloom: true,
    description: "Interlocked contrast border and pallu, a technique passed down for generations.",
    details: SILK_DETAILS,
  },
  // ── Organza ──
  {
    id: "p17", slug: "shabnam-organza", name: "Shabnam Organza",
    collection: "organza", fabric: "Organza", weave: "Hand embroidered", region: "Bengaluru",
    occasion: ["Party", "Festive"], motif: "jaal", colorways: [CHAMPAGNE, BLUSH, MINT],
    price: 19500, compareAt: 22000, rating: 4.8, reviews: 88, isBestseller: true,
    description: "Crisp silk organza with dewdrop sequins and hand-embroidered floral vines.",
    details: SILK_DETAILS,
  },
  {
    id: "p18", slug: "gulabi-organza", name: "Gulabi Organza",
    collection: "organza", fabric: "Organza", weave: "Printed", region: "Bengaluru",
    occasion: ["Party"], motif: "paisley", colorways: [BLUSH, LILAC],
    price: 11800, rating: 4.5, reviews: 61, isNew: true,
    description: "Watercolour florals printed on sheer organza, with a scalloped zari edge.",
    details: SILK_DETAILS,
  },
  {
    id: "p19", slug: "sitara-organza", name: "Sitara Organza",
    collection: "organza", fabric: "Organza", weave: "Sequin", region: "Bengaluru",
    occasion: ["Party"], motif: "buta", colorways: [BLACK, MIDNIGHT, WINE],
    price: 23900, rating: 4.7, reviews: 44,
    description: "Hand-placed sequin stars on a deep sheer ground. Catches the light with every step.",
    details: SILK_DETAILS,
  },
  {
    id: "p20", slug: "tussar-organza-kantha", name: "Kantha Tussar Organza",
    collection: "organza", fabric: "Tussar", weave: "Kantha", region: "Shantiniketan",
    occasion: ["Festive", "Workwear"], motif: "stripes", colorways: [MUSTARD, CHAMPAGNE],
    price: 15600, rating: 4.6, reviews: 29, handloom: true,
    description: "Raw tussar body with kantha running-stitch stripes and a sheer organza pallu.",
    details: SILK_DETAILS,
  },
  // ── Handloom Cotton ──
  {
    id: "p21", slug: "dhakai-jamdani", name: "Dhakai Jamdani",
    collection: "handloom-cotton", fabric: "Cotton", weave: "Jamdani", region: "Phulia",
    occasion: ["Everyday", "Festive"], motif: "buta", colorways: [IVORY, INDIGO, VERMILION],
    price: 9800, compareAt: 11200, rating: 4.8, reviews: 103, isBestseller: true, handloom: true,
    description: "Fine count cotton with jamdani motifs woven in by hand, one thread at a time.",
    details: COTTON_DETAILS,
  },
  {
    id: "p22", slug: "neel-khadi-stripes", name: "Neel Khadi Stripes",
    collection: "handloom-cotton", fabric: "Cotton", weave: "Khadi", region: "Phulia",
    occasion: ["Everyday", "Workwear"], motif: "stripes", colorways: [INDIGO, BOTTLE],
    price: 4800, rating: 4.5, reviews: 136,
    description: "Hand-spun khadi in indigo stripes. Softens beautifully with every wash.",
    details: COTTON_DETAILS,
  },
  {
    id: "p23", slug: "maheshwari-linen", name: "Maheshwari Linen",
    collection: "handloom-cotton", fabric: "Linen", weave: "Maheshwari", region: "Maheshwar",
    occasion: ["Workwear", "Everyday"], motif: "checks", colorways: [MINT, LILAC, MUSTARD],
    price: 7600, rating: 4.6, reviews: 58, isNew: true, handloom: true,
    description: "Linen-cotton with the signature reversible Maheshwari border, cool for summer.",
    details: COTTON_DETAILS,
  },
  {
    id: "p24", slug: "ikat-pochampally", name: "Pochampally Ikat",
    collection: "handloom-cotton", fabric: "Cotton", weave: "Ikat", region: "Pochampally",
    occasion: ["Everyday", "Festive"], motif: "temple", colorways: [VERMILION, INDIGO],
    price: 8200, compareAt: 9500, rating: 4.7, reviews: 77, handloom: true,
    description: "Tie-dyed before weaving, so every geometric pattern has a soft, hand-made blur.",
    details: COTTON_DETAILS,
  },
];

// Real photos live in public/images/products as [slug]-[colour]-drape.png / -pallu.png.
// They show each saree's first colourway; other colours reuse them with a small note.
const PHOTO_COLOUR: Record<string, string> = {
  "noor-kadhwa-banarasi": "royal-wine",
  "mehtab-jaal-banarasi": "vermilion-red",
  "chandni-tissue-banarasi": "ivory-gold",
  "raat-rani-banarasi": "kohl-black",
  "meenakshi-temple-kanjeevaram": "emerald-green",
  "kamakshi-checks-kanjeevaram": "mustard-yellow",
  "vaira-oosi-kanjeevaram": "peacock-blue",
  "soft-silk-thazhampoo": "lilac",
  "sikka-buti-chanderi": "blush-pink",
  "nalferma-chanderi": "mustard",
  "gulnaar-chanderi": "rani-pink",
  "safed-chanderi": "ivory",
  "mor-pankh-paithani": "peacock-blue-green",
  "asavali-paithani": "marigold",
  "semi-paithani-kamal": "lilac",
  "kadiyal-paithani": "vermilion",
  "shabnam-organza": "champagne",
  "gulabi-organza": "blush-pink",
  "sitara-organza": "kohl-black",
  "tussar-organza-kantha": "mustard",
  "dhakai-jamdani": "ivory",
  "neel-khadi-stripes": "indigo",
  "maheshwari-linen": "mint-green",
  "ikat-pochampally": "vermilion",
};

for (const p of products) {
  const colour = PHOTO_COLOUR[p.slug];
  if (!colour) continue;
  const base = `/images/products/${p.slug}-${colour}`;
  p.photos = { [p.colorways[0].name]: { drape: `${base}-drape.png`, pallu: `${base}-pallu.png` } };
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(slug: string) {
  return products.filter((p) => p.collection === slug);
}

export const bestsellers = products.filter((p) => p.isBestseller);
export const newArrivals = products.filter((p) => p.isNew);
