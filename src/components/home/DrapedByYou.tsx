import Link from "next/link";
import Image from "next/image";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { Reveal } from "@/components/ui/RevealText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/data/products";

// Customer photos (public/images/ugc-*.jpg), each linked to the saree she's wearing
const posts = [
  { image: "/images/ugc-1.jpg", slug: "noor-kadhwa-banarasi", handle: "@ananya.drapes", place: "Anniversary dinner" },
  { image: "/images/ugc-2.jpg", slug: "mehtab-jaal-banarasi", handle: "@priya.in.silk", place: "Sister's sangeet" },
  { image: "/images/ugc-3.jpg", slug: "meenakshi-temple-kanjeevaram", handle: "@lakshmi.v", place: "Temple at dusk" },
  { image: "/images/ugc-4.jpg", slug: "mor-pankh-paithani", handle: "@meera.k", place: "Rooftop, Mumbai" },
  { image: "/images/ugc-5.jpg", slug: "shabnam-organza", handle: "@thesareestory", place: "Cocktail evening" },
  { image: "/images/ugc-6.jpg", slug: "dhakai-jamdani", handle: "@ishita.b", place: "Durga Puja" },
];

export function DrapedByYou() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow="#DrapedInAanchal" title="Draped by you" />
        <a href="#" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-300 hover:text-gold-200">
          <InstagramIcon size={16} /> Follow @aanchal
        </a>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {posts.map((post, i) => {
          const p = products.find((x) => x.slug === post.slug)!;
          return (
            <Reveal key={post.handle} delay={i * 0.05} className={i % 2 ? "lg:mt-10" : ""}>
              <Link href={`/product/${p.slug}`} data-cursor="Shop look" className="group relative block aspect-[4/5] overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-[1.2s] ease-silk group-hover:scale-110">
                  <Image
                    src={post.image}
                    alt={`${post.handle} wearing the ${p.name} at a ${post.place.toLowerCase()}`}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-ink/0 p-3 transition-colors duration-500 group-hover:bg-ink/55">
                  <p className="translate-y-3 text-xs text-ivory-50 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {post.handle} · {post.place}
                  </p>
                  <p className="translate-y-3 font-display text-lg text-gold-200 opacity-0 transition delay-75 duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {p.name}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
