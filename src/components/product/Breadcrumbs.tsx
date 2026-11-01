import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.65rem] uppercase tracking-[0.2em] text-ivory-100/40">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-gold-300">
                {item.label}
              </Link>
            ) : (
              <span className="text-ivory-100/70" aria-current="page">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <span className="text-gold-600">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
