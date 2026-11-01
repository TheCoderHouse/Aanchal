/** Placeholder grid shown while the shop reads filters from the URL. */
export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] animate-pulse bg-wine-900" />
          <div className="mt-4 h-3 w-1/3 animate-pulse bg-wine-900" />
          <div className="mt-2 h-5 w-2/3 animate-pulse bg-wine-900" />
        </div>
      ))}
    </div>
  );
}
