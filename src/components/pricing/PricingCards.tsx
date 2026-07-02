"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import {
  billingOptions,
  freePlan,
  proPlan,
  type BillingPeriod,
  type PaidPlan,
} from "@/lib/pricing-plans";

type PricingCardsProps = {
  billing: BillingPeriod;
  onCheckout?: (plan: PaidPlan) => void;
  loadingPlan?: string | null;
};

/** Free + Pro pricing cards — Pro price follows the billing toggle. */
export function PricingCards({ billing, onCheckout, loadingPlan }: PricingCardsProps) {
  const proPricing = billingOptions[billing];
  const proBadge = proPricing.badge;

  return (
    <div className="mx-auto grid max-w-4xl items-stretch gap-6 md:grid-cols-2">
      <Card className="flex h-full flex-col">
        <CardHeader className="space-y-3">
          <div className="flex min-h-[1.75rem] flex-wrap items-center gap-2">
            {freePlan.badge && (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-charcoal-muted">
                {freePlan.badge}
              </span>
            )}
          </div>
          <CardTitle className="font-serif text-2xl">{freePlan.name}</CardTitle>
          <div>
            <span className="font-serif text-4xl">{freePlan.price}</span>
            <p className="mt-3 text-sm text-charcoal-muted">
              One day access — then pick Pro
            </p>
          </div>
          {freePlan.description && (
            <p className="text-sm text-charcoal-muted">{freePlan.description}</p>
          )}
        </CardHeader>

        <CardContent className="flex-1">
          <ul className="space-y-3">
            {freePlan.features.map((feature) => {
              const isLimitation =
                feature.startsWith("No ") || feature.includes("not included");
              return (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  {isLimitation ? (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-charcoal-muted" />
                  ) : (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  )}
                  <span className={isLimitation ? "text-charcoal-muted" : undefined}>
                    {feature}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>

        <CardFooter>
          <Button className="w-full" variant="outline" asChild>
            <Link href="/login?redirect=/install?plan=free">{freePlan.cta}</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex h-full flex-col border-charcoal shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex min-h-[1.75rem] flex-wrap items-center gap-2">
            {proBadge && (
              <span className="rounded-full bg-charcoal px-2.5 py-0.5 text-xs font-medium text-cream">
                {proBadge}
              </span>
            )}
          </div>
          <CardTitle className="font-serif text-2xl">{proPlan.name}</CardTitle>
          <div>
            <span className="font-serif text-4xl">{proPricing.price}</span>
            <span className="text-charcoal-muted">{proPricing.period}</span>
          </div>
          <p className="text-sm text-charcoal-muted">{proPlan.description}</p>
        </CardHeader>

        <CardContent className="flex-1">
          <ul className="space-y-3">
            {proPlan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          {onCheckout ? (
            <Button
              className="w-full"
              onClick={() => onCheckout(billing)}
              disabled={loadingPlan === billing}
            >
              {loadingPlan === billing ? "Redirecting..." : proPlan.cta}
            </Button>
          ) : (
            <Button className="w-full" asChild>
              <Link href={`/pricing?plan=${billing}`}>{proPlan.cta}</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
