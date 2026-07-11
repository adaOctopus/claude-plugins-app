import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Plugin } from "@/models/Plugin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getMarketplacePluginBySlug } from "@/lib/marketplace-plugins.server";
import { FREE_PLUGIN_SLUG } from "@/lib/marketplace-plugins";
import { PluginPurchaseButton } from "@/components/marketplace/PluginPurchaseButton";
import { FlagshipSubscribeButton } from "@/components/marketplace/FlagshipSubscribeButton";
import { formatTierPrice } from "@/lib/pricing-plans";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plugin = await getMarketplacePluginBySlug(slug);
  if (!plugin) return { title: "Plugin not found" };
  return {
    title: `${plugin.title} — Claude Plugin`,
    description: plugin.description,
  };
}

/** Plugin detail page — browse without login; purchase on this page. */
export default async function PluginDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plugin = await getMarketplacePluginBySlug(slug);
  if (!plugin) notFound();

  let pluginId: string | null = null;
  try {
    await connectDB();
    const doc = await Plugin.findOne({ slug, status: "published" });
    pluginId = doc?._id.toString() ?? null;
  } catch {
    /* catalog-only fallback */
  }

  const isFree = plugin.priceMonthly === 0 && !plugin.isFlagship;
  const isFreePromptBuilder = plugin.slug === FREE_PLUGIN_SLUG;

  return (
    <div className="mx-auto max-w-3xl px-4 py-32 md:px-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {plugin.isFlagship && (
          <Badge className="bg-[#0D9488] text-white hover:bg-[#0D9488]">Flagship</Badge>
        )}
        {isFree && (
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-800">
            Free
          </Badge>
        )}
        <Badge variant="secondary">{plugin.category}</Badge>
      </div>

      <h1 className="font-serif text-4xl font-semibold text-charcoal">{plugin.title}</h1>
      <p className="mt-4 text-lg text-charcoal-muted">{plugin.description}</p>

      <div className="mt-8 rounded-2xl border border-border bg-accent-sand/30 p-6">
        <p className="text-2xl font-semibold">
          {plugin.isFlagship
            ? `Included with base subscription (${formatTierPrice("pro", "monthly")}/mo or ${formatTierPrice("pro", "annual")}/yr)`
            : isFreePromptBuilder
              ? "Free - $0 forever"
              : isFree
                ? "Free add-on"
                : `${formatCurrency(plugin.priceMonthly)}/month add-on`}
        </p>
        <p className="mt-2 text-sm text-charcoal-muted">
          {plugin.isFlagship
            ? "Subscribe to get instant access and install guide."
            : isFreePromptBuilder
              ? "Links Jira, Slack & Notion, engineers CRISPE prompts, and returns them to you — no GitHub, no code execution, no dashboard."
              : isFree
                ? "Requires base subscription. Add this fetcher to your stack at no extra cost."
                : "Requires active base subscription. Creator earns 99% of sales."}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        {plugin.isFlagship ? (
          <FlagshipSubscribeButton />
        ) : isFreePromptBuilder ? (
          <Button size="lg" asChild>
            <Link href={`/install/${FREE_PLUGIN_SLUG}`}>Go to installation guide</Link>
          </Button>
        ) : isFree ? (
          <Button size="lg" asChild>
            <Link href="/pricing">Get with Pro</Link>
          </Button>
        ) : pluginId ? (
          <PluginPurchaseButton pluginId={pluginId} />
        ) : (
          <Button size="lg" asChild>
            <Link href="/pricing">Subscribe to add plugin</Link>
          </Button>
        )}
        <Button size="lg" variant="outline" asChild>
          <Link href="/#browse-plugins">Browse plugins</Link>
        </Button>
      </div>
    </div>
  );
}
