import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StripeCheckoutButton } from "@/components/pricing/StripeCheckoutButton";
import type { MarketplacePlugin } from "@/lib/marketplace-plugins";
import { formatTierPrice } from "@/lib/pricing-plans";
import { freeTrialSetupPath } from "@/lib/mcp-setup-paths";
import { LoginLink } from "@/components/auth/LoginLink";
import { resolveProductHref } from "@/lib/site-mode";

type InstallPaywallProps = {
  plugin: MarketplacePlugin;
  email: string;
  trialExpired?: boolean;
  errorMessage?: string;
};

/** Shown when email is verified but no active Pro subscription or free trial. */
export function InstallPaywall({
  plugin,
  email,
  trialExpired = false,
  errorMessage,
}: InstallPaywallProps) {
  const freeTrialHref = resolveProductHref(freeTrialSetupPath());

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">
          {trialExpired ? "Free trial ended" : "Get access"}
        </CardTitle>
        <p className="text-sm text-charcoal-muted">
          Signed in as <span className="font-medium text-charcoal">{email}</span>.
          {trialExpired ? (
            <>
              {" "}
              Your 1-day MCP URL has expired on our server. Upgrade to Pro for ongoing access.
            </>
          ) : (
            <>
              {" "}
              {plugin.title} is included with coolplugz Pro — or start a{" "}
              <span className="font-medium text-charcoal">card-free 1-day trial</span> (unique MCP
              URL, no Stripe).
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
        {!trialExpired && (
          <Button className="w-full" variant="default" asChild>
            <Link href={freeTrialHref}>Start free 1-day trial — no card</Link>
          </Button>
        )}
        <StripeCheckoutButton tier="pro" billing="monthly" className="w-full" variant={trialExpired ? "default" : "outline"}>
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
