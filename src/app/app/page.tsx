import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getFreeTrialStatus } from "@/lib/free-trial";
import { getUserSubscription } from "@/lib/entitlements";
import { connectDB } from "@/lib/db";
import { Plugin } from "@/models/Plugin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/marketplace/DashboardActions";
import { CancelSubscriptionButton } from "@/components/subscription/CancelSubscriptionButton";
import { getMarketplacePlugins } from "@/lib/marketplace-plugins.server";
import { UNIQUE_MCP_URL_PATH } from "@/lib/mcp-setup-paths";
import { filterListedPlugins, requiresProSubscription } from "@/lib/marketplace-plugins";

/** Logged-in account hub — subscription, plugins, sign out. */
export default async function AppDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/app");

  let subscription = null;
  let trialStatus = null;
  let plugins = filterListedPlugins(await getMarketplacePlugins());

  try {
    await connectDB();
    subscription = await getUserSubscription(session.id);
    trialStatus = await getFreeTrialStatus(session.id);
    const dbPlugins = await Plugin.find({ status: "published" });
    if (dbPlugins.length > 0) {
      plugins = filterListedPlugins(
        plugins.filter((p) => dbPlugins.some((d) => d.slug === p.slug))
      );
    }
  } catch {
    // catalog fallback
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-32 md:px-8">
      <h1 className="font-serif text-3xl font-semibold text-charcoal md:text-4xl">
        Manage account
      </h1>
      <p className="mt-2 text-charcoal-muted">{session.email}</p>

      {subscription && (
        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Subscription</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-charcoal-muted">
              {subscription.tier} · {subscription.plan} · active until{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
            <CancelSubscriptionButton
              currentPeriodEnd={subscription.currentPeriodEnd.toISOString()}
            />
          </CardContent>
        </Card>
      )}

      {!subscription && trialStatus?.active && (
        <Card className="mt-8 border-[#7DD3C0]/40 bg-[#E8FAF6]/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Free trial</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-charcoal-muted">
              Your MCP URL expires{" "}
              {trialStatus.endsAt
                ? new Date(trialStatus.endsAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "soon"}
              .{" "}
              <Link href={UNIQUE_MCP_URL_PATH} className="font-medium text-charcoal underline">
                Open MCP setup
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      {!subscription && !trialStatus?.active && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <p className="text-sm text-charcoal-muted">
              No paid plan yet.{" "}
              <Link href="/pricing" className="font-medium text-charcoal underline">
                View pricing
              </Link>{" "}
              — or start a card-free 7-day trial from the pricing page.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-charcoal">Your plugins</h2>
        <div className="mt-4 space-y-4">
          {plugins.map((plugin) => (
            <Card key={plugin.slug}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{plugin.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-charcoal-muted">{plugin.description}</p>
                <Button variant="outline" size="sm" asChild className="shrink-0">
                  <Link
                    href={
                      requiresProSubscription(plugin)
                        ? UNIQUE_MCP_URL_PATH
                        : `/install/${plugin.slug}`
                    }
                  >
                    Get started
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <LogoutButton />
      </div>
    </div>
  );
}
