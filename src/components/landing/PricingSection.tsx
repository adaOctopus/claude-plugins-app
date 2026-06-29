import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Monthly",
    price: "€19",
    period: "/month",
    description: "Full access to the flagship engineer plugin",
    features: [
      "Context Engineer plugin included",
      "Jira + Slack + GitHub integration",
      "In-Claude dashboard via MCP",
      "Install guide & updates",
    ],
    cta: "Start monthly",
    plan: "monthly" as const,
    highlighted: false,
  },
  {
    name: "Annual",
    price: "€149",
    period: "/year",
    description: "Save ~35% vs monthly billing",
    features: [
      "Everything in Monthly",
      "Priority support",
      "Early access to new plugins",
      "Best value for teams",
    ],
    cta: "Start annual",
    plan: "annual" as const,
    highlighted: true,
  },
];

/** Pricing section — subscription plans with addon note. */
export function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          Pricing
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          Simple pricing. Work less, stress less.
        </h2>
        <p className="mt-4 max-w-2xl text-charcoal-muted">
          Start with the flagship engineer plugin. Add extra plugins from the
          marketplace for €2–3/month each.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlighted ? "border-charcoal shadow-lg" : ""}
            >
              {plan.highlighted && (
                <div className="rounded-t-2xl bg-charcoal py-2 text-center text-xs font-medium text-cream">
                  Best value
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="font-serif text-4xl">{plan.price}</span>
                  <span className="text-charcoal-muted">{plan.period}</span>
                </div>
                <p className="text-sm text-charcoal-muted">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={`/pricing?plan=${plan.plan}`}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-charcoal-muted">
          Extra marketplace plugins: +€2.50/month each · Creators earn 99% of sales
        </p>
      </div>
    </section>
  );
}
