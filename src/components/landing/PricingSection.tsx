"use client";

import { useState } from "react";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCards } from "@/components/pricing/PricingCards";
import type { BillingPeriod } from "@/lib/pricing-plans";

/** Pricing section — heading, billing toggle, Free + Pro cards. */
export function PricingSection() {
  const [billing, setBilling] = useState<BillingPeriod>("annual");

  return (
    <section id="pricing" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-serif text-4xl text-charcoal md:text-6xl">Pricing</h2>

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
