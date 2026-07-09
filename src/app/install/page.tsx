import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InstallCheckoutFulfillShell } from "@/components/install/InstallCheckoutFulfillShell";
import type { MarketplacePlugin } from "@/lib/marketplace-plugins";
import { getMarketplacePlugins } from "@/lib/marketplace-plugins.server";
import {
  isFreeInstallPlugin,
  requiresProSubscription,
} from "@/lib/install-access";
import { CANONICAL_SITE_URL, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Install Guides — Claude Plugin Setup",
  description:
    "Install guides for coolplugz Claude plugins. The free Context Prompt Builder needs email verification; Pro plugins require an active subscription.",
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

/** Install hub — lists every plugin and links to its gated install guide. */
export default async function InstallPage() {
  const plugins = await getMarketplacePlugins();

  return (
    <div className="mx-auto max-w-3xl px-4 py-32 md:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold text-charcoal md:text-4xl">
          Install guides
        </h1>
        <p className="mt-3 text-charcoal-muted">
          Pick a plugin below. The free Context Prompt Builder only needs your email via magic link. Pro
          plugins require an active subscription tied to the same email.
        </p>
      </div>

      <InstallCheckoutFulfillShell />

      <div className="space-y-4">
        {plugins.map((plugin) => (
          <Link key={plugin.slug} href={`/install/${plugin.slug}`} className="block">
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
                  {isFreeInstallPlugin(plugin)
                    ? "Go to guide"
                    : "Go to guide"}
                  <ArrowRight className="h-4 w-4" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
