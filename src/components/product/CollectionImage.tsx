import Image from "next/image";
import type { Collection } from "@/data/types";
import { cn } from "@/lib/utils";
import { SareeArt } from "./SareeArt";

type Props = {
  collection: Collection;
  uid: string;
  view?: "drape" | "pallu";
  sizes?: string;
  className?: string;
  /** object-position for the photo, e.g. "50% 60%" */
  focus?: string;
};

/** A collection's editorial photo, or its drawn pattern if there's no photo. */
export function CollectionImage({ collection, uid, view = "drape", sizes = "(min-width: 1024px) 30vw, 70vw", className, focus = "50% 55%" }: Props) {
  if (!collection.image) {
    return <SareeArt colorway={collection.palette} motif={collection.motif} view={view} uid={uid} className={className} />;
  }
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-wine-950", className)}>
      <Image
        src={collection.image}
        alt={`${collection.name} sarees, folded on a carved wooden table`}
        fill
        sizes={sizes}
        quality={90}
        className="object-cover"
        style={{ objectPosition: focus }}
      />
    </div>
  );
}
