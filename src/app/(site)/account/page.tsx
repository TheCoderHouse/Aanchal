import type { Metadata } from "next";
import { AccountClient } from "@/components/account/AccountClient";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default function AccountPage() {
  return (
    <PageShell>
      <AccountClient />
    </PageShell>
  );
}
