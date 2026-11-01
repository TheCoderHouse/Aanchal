"use client";

import { AnimatePresence, motion } from "motion/react";
import { LayoutGrid, Rows3, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductRow } from "@/components/product/ProductRow";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { activeFilterCount, applyFilters, PRICE_MAX, PRICE_MIN, products } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { FilterChips } from "./FilterChips";
import { FilterSidebar } from "./FilterSidebar";
import { SortDropdown } from "./SortDropdown";
import { useShopFilters } from "./useShopFilters";

const PAGE = 9;

/**
 * Filterable product listing. On a collection page, pass `collection`
 * to limit results to it and hide the collection filter.
 */
export function ShopClient({ collection }: { collection?: string }) {
  const { filters, update, toggle, setFilters } = useShopFilters();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visible, setVisible] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);

  const effective = useMemo(
    () => (collection ? { ...filters, collection: [collection] } : filters),
    [filters, collection],
  );
  const results = useMemo(() => applyFilters(products, effective), [effective]);
  const shown = results.slice(0, visible);
  const count = activeFilterCount(filters) - (collection ? filters.collection.length : 0);

  const clear = () =>
    setFilters({
      q: "",
      fabric: [],
      occasion: [],
      collection: [],
      color: [],
      handloom: false,
      min: PRICE_MIN,
      max: PRICE_MAX,
      sort: filters.sort,
    });

  const sidebar = <FilterSidebar filters={filters} toggle={toggle} update={update} hideCollection={!!collection} />;

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
      {/* Desktop filters */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-10 pr-2" data-lenis-prevent>
          <p className="eyebrow mb-2">Refine</p>
          {sidebar}
        </div>
      </aside>

      <div>
        {filters.q && (
          <p className="mb-6 font-display text-3xl text-ivory-50">
            Results for <span className="text-gold-gradient italic">“{filters.q}”</span>
          </p>
        )}
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ivory-100/10 pb-5">
          <p className="text-sm text-ivory-100/55">
            <span className="font-display text-2xl text-ivory-50">{results.length}</span>{" "}
            {results.length === 1 ? "saree" : "sarees"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawer(true)}
              className="flex h-10 items-center gap-2 border border-ivory-100/15 px-4 text-xs text-ivory-100 lg:hidden"
            >
              <SlidersHorizontal size={14} /> Filters
              {count > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[0.55rem] font-bold text-ink">
                  {count}
                </span>
              )}
            </button>
            <SortDropdown value={filters.sort} onChange={(sort) => update({ sort })} />
            <div className="flex border border-ivory-100/15 max-sm:hidden">
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  aria-label={`${v} view`}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    "grid h-10 w-10 place-items-center transition",
                    view === v ? "bg-gold-400 text-ink" : "text-ivory-100/60 hover:text-ivory-50",
                  )}
                >
                  {v === "grid" ? <LayoutGrid size={15} /> : <Rows3 size={15} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 min-h-0">
          <FilterChips filters={filters} update={update} toggle={toggle} onClear={clear} hideCollection={!!collection} />
        </div>

        {/* Results */}
        <div className="mt-8">
          {results.length === 0 ? (
            <EmptyState onClear={clear} />
          ) : view === "grid" ? (
            <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-5 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductCard product={p} priority={i < 3} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {shown.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </div>
          )}

          {visible < results.length && (
            <div className="mt-16 flex flex-col items-center gap-4">
              <p className="text-xs text-ivory-100/45">
                Showing {shown.length} of {results.length}
              </p>
              <div className="h-px w-48 bg-ivory-100/10">
                <div className="h-full bg-gold-400" style={{ width: `${(shown.length / results.length) * 100}%` }} />
              </div>
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE)}>
                Load more
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters */}
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        side="left"
        title="Filters"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={clear}>
              Clear
            </Button>
            <Button className="flex-1" onClick={() => setDrawer(false)}>
              Show {results.length}
            </Button>
          </div>
        }
      >
        {sidebar}
      </Drawer>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="grid place-items-center border border-dashed border-ivory-100/15 px-6 py-24 text-center">
      <p className="font-display text-4xl text-ivory-50">No sarees match</p>
      <p className="mt-3 max-w-sm text-sm text-ivory-100/50">
        Try removing a filter or widening the price range. New weaves arrive every week.
      </p>
      <Button variant="outline" className="mt-8" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  );
}
