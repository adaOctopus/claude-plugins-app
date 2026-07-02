import type { MetadataRoute } from "next";
import { MARKETPLACE_CATALOG } from "@/lib/marketplace-plugins";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://plugsville.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/pricing",
    "/plugins",
    "/install",
    "/login",
    "/app",
    "/app/upload",
    "/app/create",
  ];

  const pluginRoutes = MARKETPLACE_CATALOG.map((plugin) => `/plugins/${plugin.slug}`);

  return [...routes, ...pluginRoutes].map((route) => ({
    url: `${APP_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
