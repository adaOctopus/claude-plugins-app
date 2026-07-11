import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StripeCheckoutButton } from "@/components/pricing/StripeCheckoutButton";
import type { MarketplacePlugin } from "@/lib/marketplace-plugins";
import { formatTierPrice } from "@/lib/pricing-plans";
import { LoginLink } from "@/components/auth/LoginLink";

type InstallPaywallProps = {
  plugin: MarketplacePlugin;
  email: string;
};

/** Shown when email is verified but Stripe subscription is missing for a Pro plugin. */
export function InstallPaywall({ plugin, email }: InstallPaywallProps) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Subscription required</CardTitle>
        <p className="text-sm text-charcoal-muted">
          Signed in as <span className="font-medium text-charcoal">{email}</span>.{" "}
          {plugin.title} is included with coolplugz Pro — we couldn&apos;t find an active
          subscription for this email.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <StripeCheckoutButton tier="pro" billing="monthly" className="w-full">
          Subscribe to Pro — {formatTierPrice("pro", "monthly")}/mo
        </StripeCheckoutButton>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/pricing">View all plans</Link>
        </Button>
        <p className="pt-2 text-center text-xs text-charcoal-muted">
          Already subscribed? <LoginLink className="text-charcoal underline" redirect="/app" />
        </p>
        <p className="pt-2 text-center text-xs text-charcoal-muted">
          Use the same email at checkout, then return here after payment.
        </p>
        <p className="text-center text-sm text-charcoal-muted">
          <Link href="/install" className="hover:text-charcoal">
            ← All install guides
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
