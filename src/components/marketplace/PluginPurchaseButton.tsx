"use client";

import { StripeCheckoutButton } from "@/components/pricing/StripeCheckoutButton";

export function PluginPurchaseButton({ pluginId }: { pluginId: string }) {
  return (
    <StripeCheckoutButton plan="addon" pluginId={pluginId} size="lg">
      Add plugin subscription
    </StripeCheckoutButton>
  );
}
