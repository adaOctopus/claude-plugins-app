import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { pricingPlans, type PaidPlan } from "@/lib/pricing-plans";
import { cn } from "@/lib/utils";

type PricingCardsProps = {
  /** Highlight plan by id (e.g. from ?plan= query) */
  activePlan?: string;
  /** When set, paid plans call this instead of linking to /pricing */
  onCheckout?: (plan: PaidPlan) => void;
  loadingPlan?: string | null;
};

/** Three-tier pricing cards — free day, monthly, annual at equal height. */
export function PricingCards({ activePlan, onCheckout, loadingPlan }: PricingCardsProps) {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-3">
      {pricingPlans.map((plan) => {
        const isActive = activePlan === plan.id;
        const isFree = plan.isFree;

        return (
          <Card
            key={plan.id}
            className={cn(
              "flex h-full flex-col",
              plan.highlighted && "border-charcoal shadow-lg",
              isFree && "border-2 border-dashed border-emerald-300 bg-emerald-50/30"
            )}
          >
            <CardHeader className="space-y-3">
              <div className="flex min-h-[1.75rem] flex-wrap items-center gap-2">
                {isFree && (
                  <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                    Free · 1 day
                  </span>
                )}
                {plan.badge && (
                  <span className="rounded-full bg-charcoal px-2.5 py-0.5 text-xs font-medium text-cream">
                    {plan.badge}
                  </span>
                )}
              </div>
              <CardTitle className="font-serif text-2xl">{plan.name}</CardTitle>
              <div>
                <span className="font-serif text-4xl">{plan.price}</span>
                {plan.period && (
                  <span className="text-charcoal-muted">{plan.period}</span>
                )}
                {isFree && (
                  <p className="mt-1 text-sm font-medium text-emerald-800">
                    One day only — then pick a paid plan
                  </p>
                )}
              </div>
              <p className="text-sm text-charcoal-muted">{plan.description}</p>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => {
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
              {isFree ? (
                <Button
                  className="w-full border-emerald-400 bg-white hover:bg-emerald-50"
                  variant="outline"
                  asChild
                >
                  <Link href="/login?redirect=/install?plan=free">
                    {plan.cta}
                  </Link>
                </Button>
              ) : onCheckout ? (
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => onCheckout(plan.id as PaidPlan)}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? "Redirecting..." : plan.cta}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.highlighted || isActive ? "default" : "outline"}
                  asChild
                >
                  <Link href={`/pricing?plan=${plan.id}`}>{plan.cta}</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
