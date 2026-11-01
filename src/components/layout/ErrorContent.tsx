"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";

/** Friendly error screen shared by the shop and checkout error boundaries. */
export function ErrorContent({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto grid min-h-[80dvh] max-w-7xl place-items-center px-4 pt-28 text-center md:px-8">
      <div>
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-4 font-display text-6xl font-light text-ivory-50 md:text-8xl">A tangle in the weave</h1>
        <p className="mx-auto mt-5 max-w-md text-ivory-100/55">
          This page hit a snag. Your bag and wishlist are safe. Try again, or head back to the shop.
        </p>
        <Ornament className="mx-auto my-10 max-w-xs" />
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => retry()}>Try again</Button>
          <Button href="/shop" variant="outline">
            Back to the shop
          </Button>
        </div>
      </div>
    </div>
  );
}
