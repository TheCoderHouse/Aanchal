/** Checkout pages: no shop navigation, just the focused flow. Each page renders its own header. */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <footer className="border-t border-ivory-100/10 py-8 text-center text-[0.65rem] uppercase tracking-[0.2em] text-ivory-100/35">
        © 2026 Aanchal Handlooms · Demo storefront · Help: care@aanchal.example
      </footer>
    </>
  );
}
