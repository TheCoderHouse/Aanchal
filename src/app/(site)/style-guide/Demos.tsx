"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { ColorSwatch } from "@/components/product/ColorSwatch";
import { ProductImage } from "@/components/product/ProductImage";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { products } from "@/data/products";
import { useUI } from "@/store/ui";

export function InteractiveButtons() {
  const toast = useUI((s) => s.toast);
  const [open, setOpen] = useState(false);
  const product = products[12];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Magnetic>
        <Button size="lg" onClick={() => toast("Added to bag", "Noor Kadhwa Banarasi · Royal Wine")}>
          <Sparkles size={14} /> Magnetic + toast
        </Button>
      </Magnetic>
      <Button variant="outline" size="lg" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} label="Example modal">
        <div className="grid md:grid-cols-2">
          <div className="aspect-[3/4]">
            <ProductImage product={product} colorway={product.colorways[0]} uid="modal-demo" />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="eyebrow">Modal</p>
            <h3 className="mt-3 font-display text-4xl text-ivory-50">{product.name}</h3>
            <p className="mt-4 text-sm leading-relaxed text-ivory-100/60">{product.description}</p>
            <p className="mt-6 text-xs text-ivory-100/40">This modal will become Quick View in Round 3.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function SwatchDemo() {
  const product = products[0];
  const [value, setValue] = useState(product.colorways[0].name);
  const cw = product.colorways.find((c) => c.name === value)!;
  return (
    <div className="flex items-center gap-6">
      <div className="h-36 w-28 overflow-hidden">
        <ProductImage product={product} colorway={cw} uid="swatch-demo" />
      </div>
      <div>
        <p className="mb-3 text-sm text-ivory-100/70">
          Colour: <span className="text-ivory-50">{value}</span>
        </p>
        <ColorSwatch colorways={product.colorways} value={value} onChange={setValue} />
      </div>
    </div>
  );
}

export function DisclosureDemo() {
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <Accordion
        defaultOpen="care"
        items={[
          { id: "care", title: "Care", content: "Dry clean only. Store folded in muslin, and refold every few months so the zari doesn't crease." },
          { id: "ship", title: "Shipping", content: "Ships in 2–4 days in a hand-made keepsake box. Free across India above ₹5,000." },
          { id: "auth", title: "Authenticity", content: "Every silk saree comes with a Silk Mark tag and the weaver's signature card." },
        ]}
      />
      <Tabs
        tabs={[
          { id: "story", label: "Story", content: "Woven on a pit loom in Varanasi by a third-generation master weaver, over five weeks." },
          { id: "details", label: "Details", content: "5.5 m saree with 0.8 m blouse piece. Pure katan silk, real zari." },
          { id: "reviews", label: "Reviews", content: "4.9 ★ from 128 reviews. “Even richer in person.”" },
        ]}
      />
    </div>
  );
}
