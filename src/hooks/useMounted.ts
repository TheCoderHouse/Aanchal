"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only on the client, after hydration. Use it to avoid hydration mismatches from browser storage. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
