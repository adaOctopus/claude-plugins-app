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

/** Logged-in hub — MCP setup for your plugins; cancel only if subscribed. */
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
        Your plugins
      </h1>
      <p className="mt-2 text-charcoal-muted">{session.email}</p>

      <div className="mt-8 space-y-4">
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

      {subscription && (
        <Card className="mt-8">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-charcoal-muted font-medium">
              {subscription.tier} · {subscription.plan} · until{" "}
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
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-charcoal">Free 1-day trial active</p>
            <p className="mt-1 text-sm text-charcoal-muted">
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
        <p className="mt-8 text-sm text-charcoal-muted">
          No paid plan yet.{" "}
          <Link href="/pricing" className="font-medium text-charcoal underline">
            View pricing
          </Link>{" "}
          — or start a card-free 1-day trial from the pricing page.
        </p>
      )}

      <div className="mt-8">
        <LogoutButton />
      </div>
    </div>
  );
}
