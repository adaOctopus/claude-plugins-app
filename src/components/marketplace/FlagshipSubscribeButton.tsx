"use client";

import { StripeCheckoutButton } from "@/components/pricing/StripeCheckoutButton";

/** Flagship plugin — straight to Stripe Checkout (annual Pro). */
export function FlagshipSubscribeButton() {
  return (
    <StripeCheckoutButton plan="annual" size="lg">
      Subscribe & get plugin
    </StripeCheckoutButton>
  );
}
