"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { StripeCheckoutButton } from "@/components/pricing/StripeCheckoutButton";
import { PriceDisplay } from "@/components/pricing/PriceDisplay";
import {
  freePlan,
  getPaidPlanKey,
  premiumPlan,
  proPlan,
  tierPricing,
  type BillingPeriod,
  type PaidTier,
} from "@/lib/pricing-plans";
import { freeTrialLoginRedirect } from "@/lib/mcp-setup-paths";
import { startTierCheckout } from "@/lib/start-checkout";
import { isWipSite, comingSoonHref, resolveProductHref } from "@/lib/site-mode";
import { cn } from "@/lib/utils";

type PricingCardsProps = {
  billing: BillingPeriod;
  onCheckout?: (tier: PaidTier, billing: BillingPeriod) => void | Promise<void>;
  loadingPlan?: string | null;
};

function PlanBadge({
  label,
  variant,
}: {
  label: string;
  variant: "muted" | "recommended" | "premium";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "recommended" && "bg-charcoal text-cream",
        variant === "premium" && "border border-border bg-white text-charcoal-muted",
        variant === "muted" && "bg-accent-sand text-charcoal-muted"
      )}
    >
      {variant === "recommended" && (
        <Sparkles className="mr-1 inline h-3 w-3 -translate-y-px" aria-hidden />
      )}
      {label}
    </span>
  );
}

/** Free, Pro (recommended), and Premium pricing cards. */
export function PricingCards({ billing, onCheckout, loadingPlan }: PricingCardsProps) {
  const proPrice = tierPricing.pro[billing];
  const premiumPrice = tierPricing.premium[billing];
  const freeTrialHref = resolveProductHref(freeTrialLoginRedirect());

  async function handleCheckout(tier: PaidTier) {
    if (isWipSite()) {
      window.location.href = comingSoonHref;
      return;
    }

    if (onCheckout) {
      await onCheckout(tier, billing);
      return;
    }
    await startTierCheckout(tier, billing);
  }

  function isLoading(tier: PaidTier) {
    return loadingPlan === getPaidPlanKey(tier, billing);
  }

  return (
    <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-3 lg:gap-5">
      {/* Free 1-day trial — card-free, server-managed MCP URL */}
      <Card className="flex h-full flex-col border-border/80 bg-white/60">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex min-h-[1.75rem] items-center">
            {freePlan.badge && <PlanBadge label={freePlan.badge} variant="muted" />}
          </div>
          <CardTitle className="font-serif text-2xl">{freePlan.name}</CardTitle>
          <div>
            <PriceDisplay amount={freePlan.amount} />
            <span className="text-charcoal-muted">{freePlan.period}</span>
            <p className="mt-2 text-sm text-charcoal-muted">{freePlan.tagline}</p>
            <p className="mt-1 text-xs font-medium text-[#0D9488]">{freePlan.durationNote}</p>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <ul className="space-y-3">
            {freePlan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button className="w-full" variant="outline" asChild>
            <Link href={freeTrialHref}>{freePlan.cta}</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Pro — recommended, center highlight */}
      <Card
        className={cn(
          "relative flex h-full flex-col overflow-hidden",
          "border-2 border-charcoal bg-cream",
          "shadow-[0_12px_40px_rgba(45,41,38,0.14)]",
          "lg:z-10 lg:-my-3 lg:scale-[1.04]"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-charcoal" aria-hidden />
        <CardHeader className="space-y-3 pb-4 pt-6">
          <div className="flex min-h-[1.75rem] items-center">
            {proPlan.badge && <PlanBadge label={proPlan.badge} variant="recommended" />}
          </div>
          <CardTitle className="font-serif text-2xl">{proPlan.name}</CardTitle>
          <div>
            <PriceDisplay amount={proPrice.amount} />
            <span className="text-charcoal-muted">{proPrice.period}</span>
            {"savings" in proPrice && proPrice.savings && (
              <p className="mt-1 text-xs font-medium text-emerald-700">{proPrice.savings}</p>
            )}
          </div>
          <p className="text-sm leading-relaxed text-charcoal-muted">{proPlan.description}</p>
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

        <CardFooter className="pb-6">
          {onCheckout ? (
            <Button
              className="w-full shadow-sm"
              onClick={() => handleCheckout("pro")}
              disabled={isLoading("pro")}
            >
              {isLoading("pro") ? "Redirecting..." : proPlan.cta}
            </Button>
          ) : (
            <StripeCheckoutButton tier="pro" billing={billing} className="w-full shadow-sm" size="default">
              {proPlan.cta}
            </StripeCheckoutButton>
          )}
        </CardFooter>
      </Card>

      {/* Premium */}
      <Card className="flex h-full flex-col border-border bg-white">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex min-h-[1.75rem] items-center">
            {premiumPlan.badge && <PlanBadge label={premiumPlan.badge} variant="premium" />}
          </div>
          <CardTitle className="font-serif text-2xl">{premiumPlan.name}</CardTitle>
          <div>
            <PriceDisplay amount={premiumPrice.amount} />
            <span className="text-charcoal-muted">{premiumPrice.period}</span>
            {"savings" in premiumPrice && premiumPrice.savings && (
              <p className="mt-1 text-xs font-medium text-emerald-700">{premiumPrice.savings}</p>
            )}
          </div>
          <p className="text-sm leading-relaxed text-charcoal-muted">{premiumPlan.description}</p>
          <Link
            href="/guides/claude-plugin-for-contractors"
            className="inline-block text-xs font-medium text-[#0D9488] underline underline-offset-2"
          >
            Why contractors choose Premium →
          </Link>
        </CardHeader>

        <CardContent className="flex-1">
          <ul className="space-y-3">
            {premiumPlan.features.map((feature) => (
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
              variant="outline"
              onClick={() => handleCheckout("premium")}
              disabled={isLoading("premium")}
            >
              {isLoading("premium") ? "Redirecting..." : premiumPlan.cta}
            </Button>
          ) : (
            <StripeCheckoutButton tier="premium" billing={billing} className="w-full" variant="outline">
              {premiumPlan.cta}
            </StripeCheckoutButton>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
