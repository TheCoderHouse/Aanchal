export type LookbookChapter = {
  id: string;
  number: string;
  title: string;
  mood: string;
  text: string;
  /** Product slugs: the first is the hero image, the rest fill the collage. */
  looks: string[];
  tone: string; // background tint
};

export const chapters: LookbookChapter[] = [
  {
    id: "monsoon-wedding",
    number: "01",
    title: "Monsoon Wedding",
    mood: "Rain on marigolds, a courtyard full of family",
    text: "Heirloom Banarasi and Paithani in the colours of a wedding in the rains: wine, vermilion and peacock, heavy with gold.",
    looks: ["noor-kadhwa-banarasi", "mor-pankh-paithani", "mehtab-jaal-banarasi", "kadiyal-paithani"],
    tone: "#3a1222",
  },
  {
    id: "temple-mornings",
    number: "02",
    title: "Temple Mornings",
    mood: "Jasmine in the hair, bells at dawn",
    text: "Kanjeevaram silks with temple borders and soft Chanderi for long mornings of prayer and family breakfasts.",
    looks: ["meenakshi-temple-kanjeevaram", "kamakshi-checks-kanjeevaram", "sikka-buti-chanderi", "vaira-oosi-kanjeevaram"],
    tone: "#0f2a22",
  },
  {
    id: "city-nights",
    number: "03",
    title: "City Nights",
    mood: "Rooftops, cocktails, a skyline in gold",
    text: "Sheer organza, sequin stars and kohl-black Banarasi georgette, made for evenings that run late.",
    looks: ["sitara-organza", "raat-rani-banarasi", "shabnam-organza", "chandni-tissue-banarasi"],
    tone: "#121022",
  },
  {
    id: "summer-ease",
    number: "04",
    title: "Summer Ease",
    mood: "Linen, sunlight and slow afternoons",
    text: "Breathable jamdani, khadi and Maheshwari for workdays, lunches and everything in between.",
    looks: ["dhakai-jamdani", "maheshwari-linen", "neel-khadi-stripes", "ikat-pochampally"],
    tone: "#2a2214",
  },
];
