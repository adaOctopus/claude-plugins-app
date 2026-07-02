import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getMarketplacePlugins } from "@/lib/marketplace-plugins.server";
import { MarketplaceBrowse } from "@/components/landing/MarketplaceBrowse";
import { ArrowRight } from "lucide-react";

/** Minimal marketplace preview — search, filter, latest published plugins. */
export async function PluginMarketplaceSection() {
  const plugins = await getMarketplacePlugins();

  return (
    <section id="browse-plugins" className="border-t border-border/60 px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              Plugin marketplace
            </Badge>
            <h2 className="max-w-xl font-serif text-3xl text-charcoal md:text-4xl">
              Check out the available plugins
            </h2>
            <p className="mt-2 max-w-lg text-sm text-charcoal-muted">
              Start with Context Engineer, add free fetchers for Slack, Notion, and Jira —
              or browse what creators publish.
            </p>
          </div>
          <Link
            href="/app/upload"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-charcoal-muted hover:text-charcoal"
          >
            Publish your own
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <MarketplaceBrowse plugins={plugins} />
      </div>
    </section>
  );
}
