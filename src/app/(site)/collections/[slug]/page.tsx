import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { CollectionImage } from "@/components/product/CollectionImage";
import { GridSkeleton } from "@/components/shop/GridSkeleton";
import { ShopClient } from "@/components/shop/ShopClient";
import { RevealText } from "@/components/ui/RevealText";
import { collections, getCollection } from "@/data/collections";
import { getProductsByCollection } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  return c ? { title: `${c.name} sarees`, description: c.story } : {};
}

type Params = PageProps<"/collections/[slug]">["params"];

// The page frame shows instantly; the collection waits on the slug behind a skeleton.
export default function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionContent params={params} />
    </Suspense>
  );
}

function CollectionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-44 md:px-8">
      <div className="h-3 w-40 animate-pulse bg-wine-900" />
      <div className="mt-10 h-24 w-2/3 animate-pulse bg-wine-900" />
      <div className="mt-6 h-16 w-1/2 animate-pulse bg-wine-900" />
      <div className="mt-20">
        <GridSkeleton count={6} />
      </div>
    </div>
  );
}

async function CollectionContent({ params }: { params: Params }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const items = getProductsByCollection(slug);
  const from = Math.min(...items.map((p) => p.price));
  const others = collections.filter((c) => c.slug !== slug);

  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden pb-16 pt-36 md:pt-44">
        <div className="absolute inset-0 opacity-35">
          <CollectionImage collection={collection} uid={`banner-${slug}`} sizes="100vw" focus="50% 45%" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-[1fr_auto] md:items-end md:px-8">
          <div>
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/shop" }, { label: collection.name }]}
            />
            <p className="eyebrow mt-10">{collection.region}</p>
            <RevealText
              as="h1"
              text={collection.name}
              className="mt-4 font-display text-7xl font-light leading-none text-ivory-50 md:text-9xl"
            />
            <p className="mt-4 font-display text-2xl italic text-gold-200 md:text-3xl">{collection.tagline}</p>
            <p className="mt-6 max-w-xl leading-relaxed text-ivory-100/60">{collection.story}</p>
          </div>
          <dl className="grid grid-cols-3 gap-8 border-t border-gold-500/20 pt-6 md:min-w-[340px]">
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/45">Sarees</dt>
              <dd className="mt-1 font-display text-3xl text-ivory-50">{items.length}</dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/45">From</dt>
              <dd className="mt-1 font-display text-3xl text-ivory-50">{formatPrice(from)}</dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/45">Handloom</dt>
              <dd className="mt-1 font-display text-3xl text-ivory-50">{items.filter((p) => p.handloom).length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <Suspense fallback={<GridSkeleton />}>
          <ShopClient collection={slug} />
        </Suspense>

        {/* Other collections */}
        <section className="mt-32 border-t border-ivory-100/10 pt-16">
          <p className="eyebrow">Explore more weaves</p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            {others.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden" data-cursor="Explore">
                <div className="absolute inset-0 transition-transform duration-[1.2s] ease-silk group-hover:scale-110">
                  <CollectionImage collection={c} uid={`more-${c.slug}`} sizes="(min-width: 768px) 20vw, 50vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                  <p className="font-display text-2xl text-ivory-50">{c.name}</p>
                  <ArrowUpRight size={16} className="text-gold-300 transition-transform duration-500 group-hover:rotate-45" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
