import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getUserSubscription } from "@/lib/entitlements";
import { connectDB } from "@/lib/db";
import { Plugin } from "@/models/Plugin";
import { CreatorEarning } from "@/models/CreatorEarning";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CreditCard, Upload, Wand2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  DownloadButton,
  ManageBillingButton,
  LogoutButton,
} from "@/components/marketplace/DashboardActions";

/** User dashboard — subscriptions, downloads, creator earnings. */
export default async function AppDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  let subscription = null;
  let plugins: Awaited<ReturnType<typeof Plugin.find>> = [];
  let earnings: Awaited<ReturnType<typeof CreatorEarning.find>> = [];

  try {
    await connectDB();
    subscription = await getUserSubscription(session.id);
    plugins = await Plugin.find({ status: "published" });
    if (session.role === "creator") {
      earnings = await CreatorEarning.find({ creatorId: session.id }).populate(
        "pluginId",
        "title"
      );
    }
  } catch {
    // DB not connected in dev
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-32 md:px-8">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">Dashboard</h1>
      <p className="mt-2 text-charcoal-muted">Signed in as {session.email}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-2 text-sm">
                <p>
                  Plan: <strong className="capitalize">{subscription.plan}</strong>
                </p>
                <p>Status: {subscription.status}</p>
                <p>
                  Renews:{" "}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
                <ManageBillingButton />
              </div>
            ) : (
              <div>
                <p className="text-sm text-charcoal-muted">No active subscription</p>
                <Button className="mt-4" asChild>
                  <Link href="/pricing">Subscribe now</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" asChild>
              <Link href="/app/upload">
                <Upload className="h-4 w-4" /> Upload plugin
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/app/create">
                <Wand2 className="h-4 w-4" /> Create plugin
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/install">Install guide</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {subscription && plugins.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5" />
              Your plugins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plugins.map((plugin) => (
              <div
                key={plugin._id.toString()}
                className="flex items-center justify-between rounded-xl border border-border p-4"
              >
                <div>
                  <p className="font-medium">{plugin.title}</p>
                  <p className="text-xs text-charcoal-muted">{plugin.category}</p>
                </div>
                <DownloadButton pluginId={plugin._id.toString()} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {earnings.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Creator earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {earnings.map((earning) => (
                <div
                  key={earning._id.toString()}
                  className="flex justify-between rounded-xl border border-border p-4 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {(earning.pluginId as { title?: string })?.title || "Plugin"}
                    </p>
                    <p className="text-xs text-charcoal-muted">
                      Fee: {formatCurrency(earning.platformFee)} (1%) · Status:{" "}
                      {earning.status.replace("_", " ")}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(earning.netAmount)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <LogoutButton />
      </div>
    </div>
  );
}
