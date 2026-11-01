"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { filtersToQuery, parseFilters, type Filters } from "@/lib/catalog";

/** Filters live in the URL so they can be shared and survive refresh. */
export function useShopFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);

  const setFilters = useCallback(
    (next: Filters) => {
      const q = filtersToQuery(next);
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const update = useCallback(
    (patch: Partial<Filters>) => setFilters({ ...filters, ...patch }),
    [filters, setFilters],
  );

  const toggle = useCallback(
    (key: "fabric" | "occasion" | "collection" | "color", value: string) => {
      const current = filters[key];
      update({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });
    },
    [filters, update],
  );

  return { filters, update, toggle, setFilters };
}
