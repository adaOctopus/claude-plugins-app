import { Badge } from "@/components/ui/badge";
import { PricingCards } from "@/components/pricing/PricingCards";

/** Pricing section — free day, monthly, and annual plans side by side. */
export function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          Pricing
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          Pay for automation. Not prompt engineering.
        </h2>
        <p className="mt-4 max-w-3xl text-charcoal-muted">
          Start with a <strong className="font-medium text-charcoal">free 1-day trial</strong>{" "}
          — Jira or Slack only, dashboard inside Claude, no GitHub and no coding.
          Upgrade when you want the full Context Engineer pipeline.
        </p>

        <div className="mt-12">
          <PricingCards />
        </div>

        <p className="mt-8 text-center text-sm text-charcoal-muted">
          Free tier is intentionally limited: one integration, one day, preview only.
          Marketplace add-ons from €2.50/month each — coming soon.
        </p>
      </div>
    </section>
  );
}
