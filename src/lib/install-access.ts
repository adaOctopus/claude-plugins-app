import { connectDB } from "@/lib/db";
import {
  getMarketplacePluginBySlug,
} from "@/lib/marketplace-plugins.server";
import type { MarketplacePlugin } from "@/lib/marketplace-plugins";
import { hasActiveSubscription, canDownloadPlugin } from "@/lib/entitlements";
import { Plugin } from "@/models/Plugin";

/** Free Context Prompt Builder — magic link only. Flagship & paid add-ons need Pro. */
export function isFreeInstallPlugin(plugin: MarketplacePlugin) {
  return !plugin.isFlagship && plugin.priceMonthly === 0;
}

export function requiresProSubscription(plugin: MarketplacePlugin) {
  return plugin.isFlagship || plugin.priceMonthly > 0;
}

export async function canAccessInstallGuide(
  userId: string,
  slug: string
): Promise<boolean> {
  const plugin = await getMarketplacePluginBySlug(slug);
  if (!plugin) return false;

  if (isFreeInstallPlugin(plugin)) return true;

  if (plugin.isFlagship) {
    return hasActiveSubscription(userId);
  }

  if (plugin.priceMonthly > 0) {
    await connectDB();
    const doc = await Plugin.findOne({ slug, status: "published" });
    if (!doc) return false;
    return canDownloadPlugin(userId, doc._id.toString());
  }

  return false;
}

export type InstallAccessState =
  | { status: "not_found" }
  | { status: "gate"; plugin: MarketplacePlugin; kind: "free" | "pro" }
  | { status: "paywall"; plugin: MarketplacePlugin; email: string }
  | { status: "granted"; plugin: MarketplacePlugin; email: string };

export async function getInstallAccessState(
  userId: string | null,
  email: string | null,
  slug: string
): Promise<InstallAccessState> {
  const plugin = await getMarketplacePluginBySlug(slug);
  if (!plugin) return { status: "not_found" };

  if (!userId || !email) {
    return {
      status: "gate",
      plugin,
      kind: isFreeInstallPlugin(plugin) ? "free" : "pro",
    };
  }

  const allowed = await canAccessInstallGuide(userId, slug);
  if (allowed) {
    return { status: "granted", plugin, email };
  }

  return { status: "paywall", plugin, email };
}
