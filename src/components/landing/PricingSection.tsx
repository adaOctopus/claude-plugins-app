"use client";

import { Suspense, useState } from "react";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCards } from "@/components/pricing/PricingCards";
import { PromoCodeInput } from "@/components/pricing/PromoCodeInput";
import { PromoCodeProvider } from "@/components/pricing/PromoCodeProvider";
import type { BillingPeriod } from "@/lib/pricing-plans";

function PricingSectionContent() {
  const [billing, setBilling] = useState<BillingPeriod>("annual");

  return (
    <>
      <div className="mt-8 flex justify-center">
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      <div className="mt-12">
        <PricingCards billing={billing} />
      </div>

      <PromoCodeInput />
    </>
  );
}

/** Pricing section — heading, billing toggle, Free + Pro + Enterprise cards. */
export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-28 border-t border-border/60 px-4 pt-12 pb-20 md:px-8 md:pt-14 md:pb-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-serif text-4xl text-charcoal md:text-6xl">Pricing</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-charcoal-muted md:text-base">
          Try Pro free for 7 days — <span className="font-medium text-charcoal">no credit card</span>,
          unique MCP URL from our server. Upgrade to Pro or contact us for Enterprise.
        </p>

        <Suspense fallback={null}>
          <PromoCodeProvider>
            <PricingSectionContent />
          </PromoCodeProvider>
        </Suspense>
      </div>
    </section>
  );
}
