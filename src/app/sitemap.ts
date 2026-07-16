import type { MetadataRoute } from "next";
import { MARKETPLACE_CATALOG } from "@/lib/marketplace-plugins";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const routes = [
    "",
    "/pricing",
    "/plugins",
    "/install",
    "/login",
    "/privacy",
    "/terms",
    "/app",
    "/app/upload",
    "/app/create",
  ];

  const pluginRoutes = MARKETPLACE_CATALOG.map((plugin) => `/plugins/${plugin.slug}`);

  return [...routes, ...pluginRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
