import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { formatPluginPrice } from "@/lib/marketplace-plugins";
import { getMarketplacePlugins } from "@/lib/marketplace-plugins.server";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

import { createPageMetadata, resolveSiteUrlFromRequest } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  return createPageMetadata({
    title: "Claude Plugins Marketplace",
    description:
      "Browse Claude plugins for engineers, PMs, and remote workers. Context engineering plugins for Jira, Slack, and GitHub.",
    path: "/plugins",
    siteUrl: resolveSiteUrlFromRequest(headersList),
  });
}

/** Plugins browse page — marketplace listing. */
export default async function PluginsPage() {
  const plugins = await getMarketplacePlugins();

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
            <Card key={plugin.slug} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plugin.title}</CardTitle>
                  {plugin.isFlagship && <Badge>Flagship</Badge>}
                </div>
                <p className="text-sm text-charcoal-muted">{plugin.description}</p>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="text-sm font-medium">{formatPluginPrice(plugin)}</p>
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
