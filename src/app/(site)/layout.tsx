import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Navbar } from "@/components/layout/Navbar";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { SearchOverlay } from "@/components/search/SearchOverlay";

/** Shop pages: full navigation, footer, bag drawer and Quick view. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-dvh">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileMenu />
      <QuickViewModal />
      <SearchOverlay />
    </>
  );
}
