import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StripeCheckoutButton } from "@/components/pricing/StripeCheckoutButton";
import { DailyPassCheckoutButton } from "@/components/pricing/DailyPassCheckoutButton";
import type { MarketplacePlugin } from "@/lib/marketplace-plugins";
import { dailyPassPlan, formatTierPrice } from "@/lib/pricing-plans";
import { LoginLink } from "@/components/auth/LoginLink";

type InstallPaywallProps = {
  plugin: MarketplacePlugin;
  email: string;
  passExpired?: boolean;
  errorMessage?: string;
};

/** Shown when email is verified but no active Pro subscription or One Run. */
export function InstallPaywall({
  plugin,
  email,
  passExpired = false,
  errorMessage,
}: InstallPaywallProps) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">
          {passExpired ? "One Run expired" : "Get access"}
        </CardTitle>
        <p className="text-sm text-charcoal-muted">
          Signed in as <span className="font-medium text-charcoal">{email}</span>.
          {passExpired ? (
            <>
              {" "}
              Your 24-hour access window has ended. Buy another One Run or upgrade to Pro.
            </>
          ) : (
            <>
              {" "}
              {plugin.title} is included with coolplugz Pro — or buy a{" "}
              <span className="font-medium text-charcoal">One Run ({dailyPassPlan.price})</span> to
              try it once (1 task, 24h access).
            </>
          )}
        </p>
        {errorMessage && (
          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {errorMessage}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <DailyPassCheckoutButton variant="default">
          {passExpired ? "Buy another One Run" : `Buy One Run — ${dailyPassPlan.price}`}
        </DailyPassCheckoutButton>
        <StripeCheckoutButton tier="pro" billing="monthly" className="w-full" variant="outline">
          Subscribe to Pro — {formatTierPrice("pro", "monthly")}/mo
        </StripeCheckoutButton>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/pricing">View all plans</Link>
        </Button>
        <p className="pt-2 text-center text-xs text-charcoal-muted">
          Already subscribed? <LoginLink className="text-charcoal underline" redirect="/app" />
        </p>
        <p className="text-center text-sm text-charcoal-muted">
          <Link href="/install" className="hover:text-charcoal">
            ← All setup pages
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
