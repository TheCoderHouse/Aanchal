import Image from "next/image";
import type { Colorway, Product } from "@/data/types";
import { cn } from "@/lib/utils";
import { SareeArt } from "./SareeArt";

type Props = {
  product: Product;
  colorway?: Colorway;
  view?: "drape" | "pallu";
  uid: string;
  /** Tells the browser how wide the image shows, so it downloads the right size. */
  sizes?: string;
  preload?: boolean;
  /** Show "Photo shows …" when the chosen colour has no photo of its own (use on larger images). */
  colourNote?: boolean;
  className?: string;
};

/**
 * A saree's picture.
 * 1. The photo for the chosen colour, if there is one.
 * 2. Otherwise the saree's photo in another colour (with an optional note).
 * 3. Otherwise the drawn placeholder.
 * Without a pallu photo, the pallu view zooms into the drape photo.
 */
export function ProductImage({
  product,
  colorway = product.colorways[0],
  view = "drape",
  uid,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  preload = false,
  colourNote = false,
  className,
}: Props) {
  const own = product.photos?.[colorway.name];
  const fallbackName = own ? undefined : Object.keys(product.photos ?? {})[0];
  const photos = own ?? (fallbackName ? product.photos![fallbackName] : undefined);
  const src = view === "pallu" ? (photos?.pallu ?? photos?.drape) : photos?.drape;

  if (!src) {
    return <SareeArt colorway={colorway} motif={product.motif} view={view} uid={uid} className={className} />;
  }

  const shownColour = fallbackName ?? colorway.name;
  const zoomIntoPallu = view === "pallu" && !photos?.pallu;
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-wine-950", className)}>
      <Image
        src={src}
        alt={`${product.name} in ${shownColour}${view === "pallu" ? ", pallu detail" : ""}`}
        fill
        sizes={sizes}
        quality={90}
        preload={preload}
        className={cn(
          "object-cover",
          zoomIntoPallu ? "origin-[88%_62%] scale-[2.3] object-[88%_62%]" : view === "pallu" ? "object-center" : "object-[50%_25%]",
        )}
      />
      {colourNote && fallbackName && (
        <span className="glass absolute bottom-3 left-3 border border-ivory-100/15 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-ivory-100/80">
          Photo shows {fallbackName}
        </span>
      )}
    </div>
  );
}
