import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Plugin } from "@/models/Plugin";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Claude Plugins Marketplace",
  description:
    "Browse Claude plugins for engineers, PMs, and remote workers. Context engineering plugins for Jira, Slack, and GitHub.",
};

/** Plugins browse page — marketplace listing. */
export default async function PluginsPage() {
  let plugins: Awaited<ReturnType<typeof Plugin.find>> = [];

  try {
    await connectDB();
    plugins = await Plugin.find({ status: "published" }).sort({
      isFlagship: -1,
      createdAt: -1,
    });
  } catch {
    plugins = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-32 md:px-8">
      <h1 className="font-serif text-4xl font-semibold text-charcoal md:text-5xl">
        Plugin marketplace
      </h1>
      <p className="mt-4 max-w-2xl text-charcoal-muted">
        Claude plugins built for the AI-first remote era. Start with Context
        Engineer, then add plugins for your workflow.
      </p>

      {plugins.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-border bg-accent-sand/30 p-12 text-center">
          <p className="text-charcoal-muted">
            Plugins coming soon. Subscribe to get the flagship Context Engineer
            plugin at launch.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plugins.map((plugin) => (
            <Card key={plugin._id.toString()} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plugin.title}</CardTitle>
                  {plugin.isFlagship && <Badge>Flagship</Badge>}
                </div>
                <p className="text-sm text-charcoal-muted">{plugin.description}</p>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="text-sm font-medium">
                  {plugin.isFlagship
                    ? "Included in base plan"
                    : `${formatCurrency(plugin.priceMonthly)}/mo add-on`}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/plugins/${plugin.slug}`}>View plugin</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
