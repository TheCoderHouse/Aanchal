export type Weaver = {
  id: string;
  name: string;
  craft: string;
  region: string;
  years: number;
  quote: string;
  collection: string; // collection slug, used for the portrait pattern
};

export const weavers: Weaver[] = [
  {
    id: "rafiq",
    name: "Ustad Rafiq Ansari",
    craft: "Kadhwa Banarasi",
    region: "Varanasi, Uttar Pradesh",
    years: 42,
    quote: "A saree remembers every mood of the weaver. On a good day the zari sits like light on water.",
    collection: "banarasi",
  },
  {
    id: "meenakshi",
    name: "Meenakshi Sundaram",
    craft: "Korvai Kanjeevaram",
    region: "Kanchipuram, Tamil Nadu",
    years: 31,
    quote: "My grandmother taught me korvai. Two shuttles, one rhythm, and a border that never lets go.",
    collection: "kanjeevaram",
  },
  {
    id: "sunita",
    name: "Sunita Kale",
    craft: "Tapestry Paithani",
    region: "Yeola, Maharashtra",
    years: 26,
    quote: "A peacock pallu takes me two months. I talk to it every morning before I begin.",
    collection: "paithani",
  },
  {
    id: "abdul",
    name: "Abdul Karim",
    craft: "Dhakai Jamdani",
    region: "Phulia, West Bengal",
    years: 37,
    quote: "Jamdani is drawing with thread. There is no pattern on paper, only in the hands.",
    collection: "handloom-cotton",
  },
];

export const milestones = [
  { year: "1962", title: "A single loom in Varanasi", text: "Kamla Devi Mehra opens a small workshop by the ghats, selling Banarasi sarees to families in her lane." },
  { year: "1984", title: "South to Kanchipuram", text: "Her son partners with temple-town weavers, bringing korvai Kanjeevarams to the north." },
  { year: "2001", title: "The weavers' cooperative", text: "Aanchal helps form a cooperative so weaver families own their looms and set fair prices." },
  { year: "2015", title: "Silk Mark certified", text: "Every silk saree is now tested and tagged, so authenticity is never a question." },
  { year: "2026", title: "From our looms to your door", text: "Forty weaver families, six weaving traditions, and one promise: every saree is made by hand." },
];

export const impact = [
  { value: "40+", label: "weaver families" },
  { value: "6", label: "weaving traditions" },
  { value: "30%", label: "above market wages" },
  { value: "0", label: "power looms" },
];

export const values = [
  { title: "Handloom only", text: "Every saree is woven by hand on a pit or frame loom. Never a power loom, never a print passed off as weave." },
  { title: "Fair to the weaver", text: "Weavers set their own prices through the cooperative and are paid before the saree is sold." },
  { title: "Made to last", text: "Real zari, pure silk and natural dyes, so a saree can be passed down, not thrown away." },
  { title: "Care for life", text: "Free re-polishing of zari and repairs for as long as you own your Aanchal saree." },
];
