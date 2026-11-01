import { seededRandom } from "@/lib/random";
import type { Product } from "./types";

export type Review = {
  id: string;
  name: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
};

const names = ["Ananya", "Priya", "Meera", "Kavya", "Ritu", "Sneha", "Divya", "Lakshmi", "Neha", "Aditi", "Pooja", "Shreya"];
const cities = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Pune", "Hyderabad", "Jaipur", "Kochi", "Ahmedabad"];
const lines = [
  { title: "Even better in person", body: "The colour is richer than the photos and the zari has a soft, old-gold glow. Got so many compliments." },
  { title: "Worth every rupee", body: "You can feel the handwork. The border is heavy and the fall of the fabric is beautiful." },
  { title: "Lovely packaging", body: "Came in a hand-made box with the weaver's card. Felt like opening a gift from family." },
  { title: "Perfect for the wedding", body: "Wore it for my sister's sangeet. Comfortable all evening and draped easily." },
  { title: "Light and elegant", body: "Much lighter than I expected. Easy to carry for a full day of functions." },
  { title: "Beautiful weave", body: "The motifs are crisp and even. Customer service also helped me choose a blouse colour." },
  { title: "Slightly different shade", body: "The colour was a little deeper than on my screen, but still gorgeous. Keeping it." },
  { title: "My new favourite", body: "This is the saree I'll pass on to my daughter. Thank you for keeping these crafts alive." },
];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

/** Deterministic dummy reviews for a product, matching its average rating and never repeating a review. */
export function getReviews(product: Product, count = 6): Review[] {
  const random = seededRandom(product.id.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
  // Near-perfect sarees skip the mixed review; shuffle so each review appears once
  const pool = lines
    .filter((l) => product.rating < 4.9 || !l.title.startsWith("Slightly"))
    .map((l) => ({ l, k: random() }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.l);
  // Share of 4-star reviews so the list roughly matches the average
  const fourChance = Math.max(0, Math.min(0.6, (5 - product.rating) * 1.6));

  return pool.slice(0, count).map((line, i) => ({
    id: `${product.id}-r${i}`,
    name: `${names[Math.floor(random() * names.length)]} ${String.fromCharCode(65 + Math.floor(random() * 26))}.`,
    city: cities[Math.floor(random() * cities.length)],
    rating: line.title.startsWith("Slightly") || random() < fourChance ? 4 : 5,
    title: line.title,
    body: line.body,
    date: `${1 + Math.floor(random() * 27)} ${months[Math.floor(random() * months.length)]} 2026`,
    verified: random() > 0.15,
  }));
}

/** Share of 5/4/3/2/1-star reviews (adds up to 100), derived from the average rating. */
export function ratingBreakdown(rating: number) {
  const five = Math.round(Math.min(96, Math.max(40, (rating - 3.6) * 60 + 12)));
  const four = Math.round((100 - five) * 0.7);
  const three = Math.round((100 - five - four) * 0.6);
  const one = rating >= 4.9 ? 0 : 1;
  const two = Math.max(0, 100 - five - four - three - one);
  return [five, four, three, two, one];
}
