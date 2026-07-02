import { connectDB } from "@/lib/db";
import { Plugin } from "@/models/Plugin";
import {
  MARKETPLACE_CATALOG,
  type MarketplacePlugin,
} from "@/lib/marketplace-plugins";

function serializePlugin(doc: {
  slug: string;
  title: string;
  description: string;
  category: string;
  priceMonthly: number;
  isFlagship: boolean;
  createdAt?: Date;
}): MarketplacePlugin {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    priceMonthly: doc.priceMonthly,
    isFlagship: doc.isFlagship,
    createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

/** Published plugins from DB, or catalog fallback. */
export async function getMarketplacePlugins(): Promise<MarketplacePlugin[]> {
  try {
    await connectDB();
    const docs = await Plugin.find({ status: "published" })
      .sort({ isFlagship: -1, createdAt: -1 })
      .lean();

    if (docs.length > 0) {
      return docs.map((doc) => serializePlugin(doc));
    }
  } catch {
    /* use catalog */
  }

  return MARKETPLACE_CATALOG;
}

/** Lookup by slug — DB first, then catalog. */
export async function getMarketplacePluginBySlug(
  slug: string
): Promise<MarketplacePlugin | null> {
  try {
    await connectDB();
    const doc = await Plugin.findOne({ slug, status: "published" }).lean();
    if (doc) return serializePlugin(doc);
  } catch {
    /* fall through */
  }

  return MARKETPLACE_CATALOG.find((p) => p.slug === slug) ?? null;
}
