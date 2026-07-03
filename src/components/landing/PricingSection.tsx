"use client";

import { useState } from "react";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCards } from "@/components/pricing/PricingCards";
import type { BillingPeriod } from "@/lib/pricing-plans";

/** Pricing section — heading, billing toggle, Free + Pro + Premium cards. */
export function PricingSection() {
  const [billing, setBilling] = useState<BillingPeriod>("annual");

  return (
    <section id="pricing" className="border-t border-border/60 px-4 pt-12 pb-20 md:px-8 md:pt-14 md:pb-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-serif text-4xl text-charcoal md:text-6xl">Pricing</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-charcoal-muted md:text-base">
          Start free, go Pro for full autopilot, or Premium when you&apos;re juggling
          multiple clients.
        </p>

        <div className="mt-8 flex justify-center">
          <BillingToggle value={billing} onChange={setBilling} />
        </div>

        <div className="mt-12">
          <PricingCards billing={billing} />
        </div>
      </div>
    </section>
  );
}
