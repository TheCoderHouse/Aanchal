export const orderSteps = ["Placed", "Packed", "Shipped", "Delivered"] as const;

/** Demo status based on how long ago the order was placed. Only call on the client. */
export function orderStatusIndex(placedAt: string) {
  const days = (Date.now() - new Date(placedAt).getTime()) / 86_400_000;
  if (days < 0.5) return 0;
  if (days < 2) return 1;
  if (days < 4) return 2;
  return 3;
}

export function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
