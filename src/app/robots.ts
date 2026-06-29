import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://projectx.dev";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/app/"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
