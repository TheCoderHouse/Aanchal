"use client";

import { useMounted } from "@/hooks/useMounted";
import { useAuth } from "@/store/auth";
import { AccountDashboard } from "./AccountDashboard";
import { AuthScreen } from "./AuthScreen";

export function AccountClient() {
  const mounted = useMounted();
  const user = useAuth((s) => s.user);
  if (!mounted) return <div className="min-h-[70vh] animate-pulse bg-wine-950/50" />;
  return user ? <AccountDashboard /> : <AuthScreen />;
}
