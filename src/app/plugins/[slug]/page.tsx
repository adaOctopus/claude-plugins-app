import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Plugin } from "@/models/Plugin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { PluginPurchaseButton } from "@/components/marketplace/PluginPurchaseButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const plugin = await Plugin.findOne({ slug, status: "published" });
  if (!plugin) return { title: "Plugin not found" };
  return {
    title: `${plugin.title} — Claude Plugin`,
    description: plugin.description,
  };
}

/** Plugin detail page — individual marketplace plugin. */
export default async function PluginDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    await connectDB();
  } catch {
    notFound();
  }

  const plugin = await Plugin.findOne({ slug, status: "published" });
  if (!plugin) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-32 md:px-8">
      <div className="mb-4 flex items-center gap-2">
        {plugin.isFlagship && <Badge>Flagship</Badge>}
        <Badge variant="secondary">{plugin.category}</Badge>
      </div>

      <h1 className="font-serif text-4xl font-semibold text-charcoal">{plugin.title}</h1>
      <p className="mt-4 text-lg text-charcoal-muted">{plugin.description}</p>

      <div className="mt-8 rounded-2xl border border-border bg-accent-sand/30 p-6">
        <p className="text-2xl font-semibold">
          {plugin.isFlagship
            ? "Included with base subscription (€19/mo or €149/yr)"
            : `${formatCurrency(plugin.priceMonthly)}/month add-on`}
        </p>
        <p className="mt-2 text-sm text-charcoal-muted">
          {plugin.isFlagship
            ? "Subscribe to get instant access and install guide."
            : "Requires active base subscription. Creator earns 99% of sales."}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        {plugin.isFlagship ? (
          <Button size="lg" asChild>
            <Link href="/pricing">Subscribe & get plugin</Link>
          </Button>
        ) : (
          <PluginPurchaseButton pluginId={plugin._id.toString()} />
        )}
        <Button size="lg" variant="outline" asChild>
          <Link href="/plugins">All plugins</Link>
        </Button>
      </div>
    </div>
  );
}
