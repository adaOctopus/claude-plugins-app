import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getUserSubscription } from "@/lib/entitlements";
import { connectDB } from "@/lib/db";
import { Plugin } from "@/models/Plugin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/marketplace/DashboardActions";
import { CancelSubscriptionButton } from "@/components/subscription/CancelSubscriptionButton";
import { getMarketplacePlugins } from "@/lib/marketplace-plugins.server";
import { requiresProSubscription } from "@/lib/marketplace-plugins";

/** Logged-in hub — install guides for your plugins; cancel only if subscribed. */
export default async function AppDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/app");

  let subscription = null;
  let plugins = await getMarketplacePlugins();

  try {
    await connectDB();
    subscription = await getUserSubscription(session.id);
    const dbPlugins = await Plugin.find({ status: "published" });
    if (dbPlugins.length > 0) {
      plugins = plugins.filter((p) => dbPlugins.some((d) => d.slug === p.slug));
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
                <Link href={`/install/${plugin.slug}`}>
                  {requiresProSubscription(plugin) ? "Open guide" : "Install"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {subscription && (
        <Card className="mt-8">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-charcoal-muted">
              {subscription.tier} · {subscription.plan} · until{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
            <CancelSubscriptionButton
              currentPeriodEnd={subscription.currentPeriodEnd.toISOString()}
            />
          </CardContent>
        </Card>
      )}

      {!subscription && (
        <p className="mt-8 text-sm text-charcoal-muted">
          No paid plan yet.{" "}
          <Link href="/pricing" className="font-medium text-charcoal underline">
            View pricing
          </Link>
        </p>
      )}

      <div className="mt-8">
        <LogoutButton />
      </div>
    </div>
  );
}
