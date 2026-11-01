export type Motif = "buta" | "checks" | "stripes" | "jaal" | "temple" | "paisley";

export type Occasion = "Bridal" | "Festive" | "Party" | "Workwear" | "Everyday";

export type Fabric =
  | "Silk"
  | "Organza"
  | "Cotton"
  | "Linen"
  | "Georgette"
  | "Tussar";

/** One colour option of a saree. The three hex values drive the placeholder artwork and, later, 3D textures. */
export type Colorway = {
  name: string;
  base: string;
  border: string;
  accent: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  collection: string; // collection slug
  fabric: Fabric;
  weave: string;
  region: string;
  occasion: Occasion[];
  motif: Motif;
  colorways: Colorway[];
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestseller?: boolean;
  handloom?: boolean;
  description: string;
  details: string[];
  /** Real photos per colourway name. Anything missing falls back to the drawn SareeArt. */
  photos?: Record<string, { drape?: string; pallu?: string }>;
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  region: string;
  story: string;
  palette: Colorway;
  motif: Motif;
  /** Editorial photo in public/images/collections. Falls back to the drawn pattern. */
  image?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  quote: string;
  product: string;
  rating: number;
};
