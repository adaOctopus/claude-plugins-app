import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getDailyPassStatus } from "@/lib/daily-pass";
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
import { TROUBLESHOOTING_GUIDE_SLUG } from "@/lib/guides/registry";
import { filterListedPlugins, requiresProSubscription } from "@/lib/marketplace-plugins";

/** Logged-in account hub — subscription, MCP setup, plugins, sign out. */
export default async function AppDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/app");

  let subscription = null;
  let dailyStatus = null;
  let trialStatus = null;
  let plugins = filterListedPlugins(await getMarketplacePlugins());

  try {
    await connectDB();
    subscription = await getUserSubscription(session.id);
    dailyStatus = await getDailyPassStatus(session.id);
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

  const hasMcpAccess =
    !!subscription || dailyStatus?.active || trialStatus?.active;

  return (
    <div className="mx-auto max-w-3xl px-4 py-32 md:px-8">
      <h1 className="font-serif text-3xl font-semibold text-charcoal md:text-4xl">
        Manage account
      </h1>
      <p className="mt-2 text-charcoal-muted">{session.email}</p>

      {!subscription && trialStatus?.active && (
        <Card className="mt-8 border-[#7DD3C0]/40 bg-[#E8FAF6]/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Free trial</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-charcoal-muted">
              Your trial ends{" "}
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

      {!subscription && trialStatus?.used && !trialStatus?.active && (
        <Card className="mt-8 border-amber-200/60 bg-amber-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trial ended</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-charcoal-muted">
              Your 7-day free trial has ended.{" "}
              <Link href="/pricing" className="font-medium text-charcoal underline">
                Upgrade to Pro
              </Link>{" "}
              to keep orchestrating Claude Code.
            </p>
          </CardContent>
        </Card>
      )}

      {!subscription && !trialStatus?.used && !trialStatus?.active && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <p className="text-sm text-charcoal-muted">
              No plan yet.{" "}
              <Link href="/pricing" className="font-medium text-charcoal underline">
                Start your free trial or get Pro
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-charcoal">Your tools</h2>
        <div className="mt-4 space-y-4">
          {plugins.map((plugin) => (
            <Card key={plugin.slug}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Best Claude Code Orchestrator for Developers</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-charcoal-muted">{plugin.description}</p>
                <Button variant="outline" size="sm" asChild className="shrink-0">
                  <Link
                    href={
                      requiresProSubscription(plugin)
                        ? hasMcpAccess
                          ? UNIQUE_MCP_URL_PATH
                          : "/pricing"
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

      <p className="mt-10 rounded-xl border border-border/80 bg-accent-sage/50 px-4 py-3 text-sm leading-relaxed text-charcoal-muted">
        Hitting any blockers with Coolplugz?{" "}
        <Link
          href={`/guides/${TROUBLESHOOTING_GUIDE_SLUG}`}
          className="font-medium text-charcoal underline underline-offset-2"
        >
          Check our troubleshooting guide
        </Link>
        , browse{" "}
        <Link href="/guides" className="font-medium text-charcoal underline underline-offset-2">
          all developer guides
        </Link>
        , or{" "}
        <a
          href="mailto:cto@coolplugz.com"
          className="font-medium text-charcoal underline underline-offset-2"
        >
          reach out
        </a>
        .
      </p>

      <div className="mt-10 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <LogoutButton />
        {subscription ? (
          <CancelSubscriptionButton
            currentPeriodEnd={subscription.currentPeriodEnd.toISOString()}
          />
        ) : null}
      </div>
    </div>
  );
}
