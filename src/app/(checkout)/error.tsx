"use client";

import { ErrorContent } from "@/components/layout/ErrorContent";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorContent error={error} retry={retry} />;
}
