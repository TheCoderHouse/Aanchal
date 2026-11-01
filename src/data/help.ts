export const helpNav = [
  { href: "/help/faq", label: "FAQ" },
  { href: "/help/shipping", label: "Shipping" },
  { href: "/help/returns", label: "Returns & exchanges" },
  { href: "/help/care", label: "Saree care" },
  { href: "/contact", label: "Contact us" },
];

export type Faq = { q: string; a: string; group: string };

export const faqs: Faq[] = [
  { group: "Orders", q: "How do I know a saree is genuinely handwoven?", a: "Every silk saree carries a Silk Mark tag, and every handloom saree comes with a card signed by its weaver. Handloom sarees have tiny irregularities in the weave, which is the sign of a human hand." },
  { group: "Orders", q: "Can I change or cancel my order?", a: "You can change or cancel any order until it is packed, usually within 12 hours. Write to us on WhatsApp or from your account's Orders page." },
  { group: "Orders", q: "Do you take custom or bridal orders?", a: "Yes. Custom colours and bridal pieces are woven to order in 6–10 weeks. Book a video call and a stylist will plan it with you and the weaver." },
  { group: "Shipping", q: "How long does delivery take?", a: "Standard delivery takes 4–6 business days across India, and express takes 1–2 days in major cities. Bridal and custom pieces have their own timelines." },
  { group: "Shipping", q: "Do you ship outside India?", a: "Yes, to over 30 countries. International orders take 7–12 business days and duties are shown at checkout." },
  { group: "Shipping", q: "Is my saree insured in transit?", a: "Every order is fully insured until it reaches you. If anything goes wrong, we replace or refund it." },
  { group: "Payments", q: "Which payment methods do you accept?", a: "UPI, all major credit and debit cards, net banking and cash on delivery (a ₹50 fee applies). EMI is available on cards for orders above ₹10,000." },
  { group: "Payments", q: "Is it safe to pay on Aanchal?", a: "Payments are processed by a certified payment partner. We never see or store your card details." },
  { group: "Returns", q: "What is your return policy?", a: "Unworn sarees with tags intact can be returned within 7 days of delivery for a full refund or exchange. Sarees with fall & pico added are final sale." },
  { group: "Returns", q: "How long do refunds take?", a: "Refunds reach you within 5–7 business days after the saree passes a quality check at our studio." },
  { group: "Care", q: "How should I store a silk saree?", a: "Fold it in a muslin cloth, away from sunlight and damp. Refold it along different lines every few months so the zari doesn't crack." },
  { group: "Care", q: "Can I wash a silk saree at home?", a: "We recommend dry cleaning for silk and zari. Cotton and linen sarees can be hand washed in cold water with a mild detergent." },
];

export const shippingZones = [
  { zone: "Metro cities", standard: "3–4 days", express: "1 day", cost: "Free above ₹5,000" },
  { zone: "Rest of India", standard: "4–6 days", express: "2 days", cost: "Free above ₹5,000" },
  { zone: "North-East & islands", standard: "6–9 days", express: "Not available", cost: "Free above ₹5,000" },
  { zone: "International", standard: "7–12 days", express: "4–6 days", cost: "Calculated at checkout" },
];

export const careGuide = [
  { title: "Silk & zari", points: ["Dry clean only, ideally with a cleaner who knows handloom", "Air it out for a few hours after wearing, before folding", "Never spray perfume directly on zari; it tarnishes the gold"] },
  { title: "Storage", points: ["Wrap each saree in white muslin, not plastic", "Refold along new lines every 3 months", "Keep neem leaves or cloves nearby instead of mothballs"] },
  { title: "Cotton & linen", points: ["Hand wash in cold water with a mild detergent", "Wash dark colours separately for the first few washes", "Dry in the shade and iron while slightly damp"] },
  { title: "Organza & georgette", points: ["Dry clean to keep the crisp finish", "Steam instead of ironing", "Hang on a padded hanger, never a wire one"] },
];
