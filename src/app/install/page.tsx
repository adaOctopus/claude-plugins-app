import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketplacePlugin } from "@/lib/marketplace-plugins";
import { getMarketplacePlugins } from "@/lib/marketplace-plugins.server";
import { requiresProSubscription } from "@/lib/marketplace-plugins";
import { UNIQUE_MCP_URL_PATH } from "@/lib/mcp-setup-paths";
import { CANONICAL_SITE_URL, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Getting Started — CoolPlugz MCP Setup",
  description:
    "Add your CoolPlugz MCP URL to Claude. Paste the URL, connect your tools, and start using CoolPlugz on desktop or mobile.",
  path: "/install",
  siteUrl: CANONICAL_SITE_URL,
});

function AccessBadge({ plugin }: { plugin: MarketplacePlugin }) {
  if (requiresProSubscription(plugin)) {
    return (
      <Badge variant="secondary" className="gap-1 bg-charcoal text-cream">
        <Sparkles className="h-3 w-3" />
        Pro
      </Badge>
    );
  }
  return <Badge variant="outline">Free</Badge>;
}

/** Setup hub — lists plugins and links to MCP URL setup after access is verified. */
export default async function InstallPage() {
  const plugins = await getMarketplacePlugins();

  return (
    <div className="mx-auto max-w-3xl px-4 py-32 md:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold text-charcoal md:text-4xl">
          Getting started
        </h1>
        <p className="mt-3 text-charcoal-muted">
          CoolPlugz is an MCP server — just paste your URL into Claude and you&apos;re in. Pick a
          plugin below to verify access and get your MCP URL.
        </p>
      </div>

      <div className="space-y-4">
        {plugins.map((plugin) => {
          const href = requiresProSubscription(plugin)
            ? UNIQUE_MCP_URL_PATH
            : `/install/${plugin.slug}`;

          return (
          <Link key={plugin.slug} href={href} className="block">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <CardTitle className="text-lg">{plugin.title}</CardTitle>
                  <AccessBadge plugin={plugin} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-charcoal-muted">{plugin.description}</p>
                <p className="mt-3 flex items-center gap-1 text-sm font-medium text-charcoal">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </p>
              </CardContent>
            </Card>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
