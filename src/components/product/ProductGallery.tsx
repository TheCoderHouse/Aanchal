"use client";

import { AnimatePresence, motion } from "motion/react";
import { Box, Hand } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { Colorway, Product } from "@/data/types";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductImage";

const ProductViewer3D = dynamic(() => import("@/components/three/ProductViewer3D"), {
  ssr: false,
  loading: () => <ViewerLoading />,
});

type View = "3d" | "drape" | "pallu" | "detail";

const views: { id: View; label: string }[] = [
  { id: "3d", label: "3D" },
  { id: "drape", label: "Drape" },
  { id: "pallu", label: "Pallu" },
  { id: "detail", label: "Detail" },
];

/** Main product media: a rotatable 3D saree plus image views with a hover magnifier. */
export function ProductGallery({ product, colorway }: { product: Product; colorway: Colorway }) {
  // Open on the real photo when there is one, otherwise on the 3D view
  const [view, setView] = useState<View>(product.photos ? "drape" : "3d");
  const uid = `${product.id}-${colorway.name}`;

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-3 md:flex-col" role="tablist" aria-label="Product views">
        {views.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={cn(
              "relative h-24 w-[4.5rem] shrink-0 overflow-hidden ring-1 transition md:h-28 md:w-20",
              view === v.id ? "ring-gold-400" : "opacity-60 ring-ivory-100/10 hover:opacity-100",
            )}
          >
            {v.id === "3d" ? (
              <span className="grid h-full w-full place-items-center bg-wine-900 text-gold-300">
                <span className="flex flex-col items-center gap-1.5">
                  <Box size={20} strokeWidth={1.3} />
                  <span className="text-[0.55rem] uppercase tracking-[0.2em]">3D</span>
                </span>
              </span>
            ) : (
              <span className={cn("block h-full w-full", v.id === "detail" && "scale-[2.2]")}>
                <ProductImage
                  product={product} colorway={colorway}
                  view={v.id === "drape" ? "drape" : "pallu"}
                  uid={`th-${v.id}-${uid}`}
                  sizes="120px"
                />
              </span>
            )}
            <span className="sr-only">{v.label}</span>
          </button>
        ))}
      </div>

      {/* Stage */}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,var(--color-wine-800),var(--color-wine-950)_70%)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {view === "3d" ? (
              <>
                <ProductViewer3D colorway={colorway} motif={product.motif} />
                <p className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/50">
                  <Hand size={12} /> Drag to turn
                </p>
              </>
            ) : (
              <Magnifier zoom={view === "detail" ? 3 : 2}>
                <div className={cn("h-full w-full", view === "detail" && "scale-[1.8]")}>
                  <ProductImage
                    product={product} colorway={colorway}
                    view={view === "drape" ? "drape" : "pallu"}
                    uid={`main-${view}-${uid}`}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    preload
                    colourNote
                  />
                </div>
              </Magnifier>
            )}
          </motion.div>
        </AnimatePresence>
        <span className="pointer-events-none absolute left-4 top-4 text-[0.6rem] uppercase tracking-[0.25em] text-ivory-100/50">
          {colorway.name}
        </span>
      </div>
    </div>
  );
}

/** Zooms into the image where the pointer is. */
function Magnifier({ children, zoom }: { children: React.ReactNode; zoom: number }) {
  const [origin, setOrigin] = useState("50% 50%");
  const [active, setActive] = useState(false);
  return (
    <div
      className="h-full w-full overflow-hidden"
      data-cursor="Zoom"
      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(true)}
      onPointerLeave={() => setActive(false)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
    >
      <div
        className="h-full w-full transition-transform duration-500 ease-silk"
        style={{ transform: active ? `scale(${zoom})` : "scale(1)", transformOrigin: origin }}
      >
        {children}
      </div>
    </div>
  );
}

function ViewerLoading() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-px w-32 overflow-hidden bg-ivory-100/10">
          <div className="h-full w-1/2 animate-[marquee_1.2s_linear_infinite] bg-gold-400" />
        </div>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-ivory-100/40">Weaving 3D view</p>
      </div>
    </div>
  );
}
