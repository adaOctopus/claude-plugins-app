"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, X } from "lucide-react";
import { StripeCheckoutButton } from "@/components/pricing/StripeCheckoutButton";
import { StartFreeTrialButton } from "@/components/pricing/StartFreeTrialButton";
import { PriceDisplay } from "@/components/pricing/PriceDisplay";
import { EnterpriseContactDialog } from "@/components/pricing/EnterpriseContactDialog";
import {
  enterprisePlan,
  getPaidPlanKey,
  proPlan,
  proValueLine,
  tierPricing,
  trialPlan,
  type BillingPeriod,
  type PaidTier,
  type PricingFeature,
} from "@/lib/pricing-plans";
import { startTierCheckout } from "@/lib/start-checkout";
import { isWipSite, comingSoonHref } from "@/lib/site-mode";
import { cn } from "@/lib/utils";
import { useOptionalPromoCode } from "@/components/pricing/PromoCodeProvider";

type PricingCardsProps = {
  billing: BillingPeriod;
  onCheckout?: (tier: PaidTier, billing: BillingPeriod) => void | Promise<void>;
  loadingPlan?: string | null;
};

type PlanBadgeVariant = "muted" | "recommended" | "outline";

function PlanBadge({ label, variant }: { label: string; variant: PlanBadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit max-w-full items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "recommended" && "bg-charcoal text-cream",
        variant === "outline" && "border border-border bg-white text-charcoal-muted",
        variant === "muted" && "bg-accent-sand text-charcoal-muted"
      )}
    >
      {variant === "recommended" && (
        <Sparkles className="mr-1 h-3 w-3 shrink-0 -translate-y-px" aria-hidden />
      )}
      {label}
    </span>
  );
}

function FeatureList({
  header,
  features,
}: {
  header: string;
  features: readonly (string | PricingFeature)[];
}) {
  return (
    <div>
      <p className="text-sm text-charcoal-muted">{header}</p>
      <ul className="mt-3 space-y-2.5">
        {features.map((feature) => {
          const item = typeof feature === "string" ? { label: feature } : feature;
          const key = item.label;

          if (item.excluded) {
            return (
              <li key={key} className="flex items-start gap-2 text-sm leading-snug">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-charcoal-muted/50" aria-hidden />
                <span className="text-charcoal-muted/60 line-through">{item.label}</span>
              </li>
            );
          }

          return (
            <li key={key} className="flex items-start gap-2 text-sm leading-snug">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type PricingPlanCardProps = {
  badge?: { label: string; variant: PlanBadgeVariant };
  title: string;
  priceSlot: ReactNode;
  tagline?: ReactNode;
  featureHeader: string;
  features: readonly (string | PricingFeature)[];
  footer: ReactNode;
  highlighted?: boolean;
};

/** Brilliance-style pricing card — left-aligned header, progressive feature list, CTA pinned bottom. */
function PricingPlanCard({
  badge,
  title,
  priceSlot,
  tagline,
  featureHeader,
  features,
  footer,
  highlighted = false,
}: PricingPlanCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col text-left",
        highlighted
          ? "border-2 border-charcoal bg-cream shadow-[0_12px_40px_rgba(45,41,38,0.12)]"
          : "border-border bg-white"
      )}
    >
      <CardHeader className="space-y-3 pb-0 text-left">
        <div className="flex min-h-[1.75rem] items-center justify-start">
          {badge ? <PlanBadge {...badge} /> : null}
        </div>

        <CardTitle className="font-serif text-2xl">{title}</CardTitle>

        <div>{priceSlot}</div>

        {tagline ? (
          <div className="text-sm leading-relaxed text-charcoal-muted">{tagline}</div>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-5">
        <FeatureList header={featureHeader} features={features} />
      </CardContent>

      <CardFooter className="mt-auto pt-6">{footer}</CardFooter>
    </Card>
  );
}

/** Trial, Pro, and Enterprise pricing cards. */
export function PricingCards({ billing, onCheckout, loadingPlan }: PricingCardsProps) {
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const proPrice = tierPricing.pro[billing];
  const promo = useOptionalPromoCode();

  async function handleCheckout(tier: PaidTier) {
    if (isWipSite()) {
      window.location.href = comingSoonHref;
      return;
    }

    if (onCheckout) {
      await onCheckout(tier, billing);
      return;
    }
    await startTierCheckout(tier, billing, undefined, {
      promoCode: promo?.promoCode ?? null,
    });
  }

  function isLoading(tier: PaidTier) {
    return loadingPlan === getPaidPlanKey(tier, billing);
  }

  return (
    <>
      <div className="mx-auto grid max-w-5xl items-stretch gap-6 text-left md:grid-cols-3">
        <PricingPlanCard
          badge={trialPlan.badge ? { label: trialPlan.badge, variant: "muted" } : undefined}
          title={trialPlan.name}
          priceSlot={
            <>
              <span className="font-serif text-4xl leading-none">{trialPlan.price}</span>
              <span className="text-charcoal-muted">{trialPlan.period}</span>
            </>
          }
          tagline={
            <>
              {trialPlan.highlightLabel ? (
                <p className="text-xs font-medium text-emerald-700">{trialPlan.highlightLabel}</p>
              ) : null}
              <p className={cn(trialPlan.highlightLabel && "mt-1")}>{trialPlan.tagline}</p>
              {trialPlan.durationNote ? (
                <p className="mt-1 text-xs font-medium text-[#0D9488]">{trialPlan.durationNote}</p>
              ) : null}
            </>
          }
          featureHeader={trialPlan.featureHeader}
          features={trialPlan.features}
          footer={<StartFreeTrialButton>{trialPlan.cta}</StartFreeTrialButton>}
        />

        <PricingPlanCard
          highlighted
          badge={proPlan.badge ? { label: proPlan.badge, variant: "recommended" } : undefined}
          title={proPlan.name}
          priceSlot={
            <>
              <PriceDisplay amount={proPrice.amount} />
              <span className="text-charcoal-muted">{proPrice.period}</span>
            </>
          }
          tagline={
            <>
              {"savings" in proPrice && proPrice.savings ? (
                <p className="text-xs font-medium text-emerald-700">{proPrice.savings}</p>
              ) : null}
              <p className={cn("savings" in proPrice && proPrice.savings && "mt-1")}>
                {proPlan.tagline}
              </p>
              <p className="mt-2 text-xs font-medium text-[#0D9488]">{proValueLine}</p>
            </>
          }
          featureHeader={proPlan.featureHeader}
          features={proPlan.features}
          footer={
            onCheckout ? (
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
            )
          }
        />

        <PricingPlanCard
          badge={
            enterprisePlan.badge ? { label: enterprisePlan.badge, variant: "outline" } : undefined
          }
          title={enterprisePlan.name}
          priceSlot={<p className="font-serif text-4xl leading-none">Custom</p>}
          tagline={<p>{enterprisePlan.tagline}</p>}
          featureHeader={enterprisePlan.featureHeader}
          features={enterprisePlan.features}
          footer={
            <Button className="w-full" variant="outline" onClick={() => setEnterpriseOpen(true)}>
              {enterprisePlan.cta}
            </Button>
          }
        />
      </div>

      <EnterpriseContactDialog open={enterpriseOpen} onOpenChange={setEnterpriseOpen} />
    </>
  );
}
