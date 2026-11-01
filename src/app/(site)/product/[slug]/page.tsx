import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductView } from "@/components/product/ProductView";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCollection } from "@/data/collections";
import { getProduct, products } from "@/data/products";
import { relatedProducts } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const photo = p.photos?.[p.colorways[0].name]?.drape;
  return {
    title: p.name,
    description: p.description,
    openGraph: photo ? { images: [{ url: photo, alt: `${p.name} in ${p.colorways[0].name}` }] } : undefined,
  };
}

type Params = PageProps<"/product/[slug]">["params"];

// The page frame shows instantly; the product waits on the slug behind a skeleton.
export default function ProductPage({ params }: PageProps<"/product/[slug]">) {
  return (
    <PageShell className="pb-32">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </PageShell>
  );
}

async function ProductContent({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const collection = getCollection(product.collection)!;
  const related = relatedProducts(product);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: collection.name, href: `/collections/${collection.slug}` },
          { label: product.name },
        ]}
      />
      <div className="mt-8">
        <ProductView product={product} />
      </div>

      {/* The weave story */}
      <section className="mt-28 grid overflow-hidden border border-gold-500/15 md:grid-cols-2">
        <div className="relative min-h-[320px]">
          <div className="absolute inset-0">
            <ProductImage product={product} colorway={product.colorways[0]} view="pallu" uid={`story-${product.id}`} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/60" />
        </div>
        <div className="bg-wine-950 p-8 md:p-14">
          <p className="eyebrow">The weave · {collection.region}</p>
          <h2 className="mt-4 font-display text-4xl font-light text-ivory-50 md:text-5xl">{collection.tagline}</h2>
          <p className="mt-5 leading-relaxed text-ivory-100/60">{collection.story}</p>
          <Button href={`/collections/${collection.slug}`} variant="outline" className="mt-8">
            More {collection.name}
          </Button>
        </div>
      </section>

      <ReviewsSection product={product} />

      <section className="border-t border-ivory-100/10 pt-20">
        <SectionHeading eyebrow="You may also love" title="Woven to go together" />
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-5 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <div className="aspect-[4/5] animate-pulse bg-wine-900" />
      <div className="space-y-5 pt-6">
        <div className="h-3 w-24 animate-pulse bg-wine-900" />
        <div className="h-14 w-3/4 animate-pulse bg-wine-900" />
        <div className="h-8 w-40 animate-pulse bg-wine-900" />
        <div className="h-24 w-full animate-pulse bg-wine-900" />
        <div className="h-14 w-full animate-pulse bg-wine-900" />
      </div>
    </div>
  );
}
