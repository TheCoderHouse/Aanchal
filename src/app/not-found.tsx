import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Navbar } from "@/components/layout/Navbar";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <NotFoundContent />
      </main>
      <Footer />
      <CartDrawer />
      <MobileMenu />
    </>
  );
}
