import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";

export function NotFoundContent() {
  return (
    <PageShell className="grid min-h-[80dvh] place-items-center text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 font-display text-6xl font-light text-ivory-50 md:text-8xl">A loose thread</h1>
        <p className="mx-auto mt-5 max-w-md text-ivory-100/55">
          We couldn&apos;t find this page. It may have moved, or the weave is no longer in our collection.
        </p>
        <Ornament className="mx-auto my-10 max-w-xs" />
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/shop" variant="outline">
            Browse the shop
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
