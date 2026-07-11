"use client";

import { MarketplaceNotifyProvider } from "@/components/waitlist/MarketplaceNotifyDialog";

/** Client providers for waitlist marketplace popup. */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <MarketplaceNotifyProvider>{children}</MarketplaceNotifyProvider>;
}
