import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { Cursor } from "@/components/ui/Cursor";
import { Toaster } from "@/components/ui/Toaster";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aanchal · Handwoven Luxury Sarees",
    template: "%s · Aanchal",
  },
  description:
    "Banarasi, Kanjeevaram, Paithani and Chanderi sarees, handwoven by master artisans across India.",
  // Preview shown when a link is shared on WhatsApp, Instagram, etc.
  openGraph: {
    type: "website",
    siteName: "Aanchal",
    locale: "en_IN",
    images: [{ url: "/images/hero/weaver.png", width: 1672, height: 941, alt: "A master weaver at a handloom in Varanasi" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0d0608",
};

// Shared by every page. The shop chrome lives in (site)/layout, the checkout header in (checkout)/layout.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} antialiased`}>
      <body className="grain min-h-dvh">
        <SmoothScrollProvider>
          {children}
          <Toaster />
          <Cursor />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
