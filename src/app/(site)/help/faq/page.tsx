import type { Metadata } from "next";
import { FaqClient } from "@/components/help/FaqClient";

export const metadata: Metadata = { title: "Frequently asked questions" };

export default function FaqPage() {
  return (
    <>
      <h1 className="font-display text-5xl font-light text-ivory-50 md:text-7xl">Questions, answered</h1>
      <p className="mb-12 mt-4 max-w-xl text-ivory-100/55">Everything about orders, delivery, payments, returns and caring for your saree.</p>
      <FaqClient />
    </>
  );
}
