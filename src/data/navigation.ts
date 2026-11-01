export type NavLink = { label: string; href: string };

export const mainNav: { label: string; href: string; mega?: boolean }[] = [
  { label: "Shop", href: "/shop", mega: true },
  { label: "Collections", href: "/collections/banarasi", mega: true },
  { label: "Bridal", href: "/shop?occasion=Bridal" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Our Story", href: "/about" },
];

export const shopByOccasion: NavLink[] = [
  { label: "Bridal", href: "/shop?occasion=Bridal" },
  { label: "Festive", href: "/shop?occasion=Festive" },
  { label: "Party", href: "/shop?occasion=Party" },
  { label: "Workwear", href: "/shop?occasion=Workwear" },
  { label: "Everyday", href: "/shop?occasion=Everyday" },
];

export const shopByFabric: NavLink[] = [
  { label: "Pure Silk", href: "/shop?fabric=Silk" },
  { label: "Organza", href: "/shop?fabric=Organza" },
  { label: "Tussar", href: "/shop?fabric=Tussar" },
  { label: "Cotton", href: "/shop?fabric=Cotton" },
  { label: "Linen", href: "/shop?fabric=Linen" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/shop?sort=new" },
      { label: "Bestsellers", href: "/shop?sort=popular" },
      { label: "Bridal Edit", href: "/shop?occasion=Bridal" },
      { label: "Gift Cards", href: "/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping", href: "/help/shipping" },
      { label: "Returns", href: "/help/returns" },
      { label: "FAQ", href: "/help/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Aanchal",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "The Weavers", href: "/about#weavers" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "Account", href: "/account" },
    ],
  },
];

export const announcements = [
  "Free shipping across India on orders above ₹5,000",
  "Every saree is certified handloom or Silk Mark",
  "Complimentary fall & pico on bridal sarees",
];
