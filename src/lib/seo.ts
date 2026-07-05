import type { Metadata } from "next";

export const OG_TAGLINE =
  "Ship merge-ready code without tool switching.";

export const OG_IMAGE = {
  path: "/og-plugsville.jpg",
  width: 2718,
  height: 1428,
  alt: "plugsville — Ship merge-ready code without tool switching",
  type: "image/jpeg" as const,
} as const;

export const SEO_DEFAULTS = {
  title: "plugsville — Ship merge-ready code without switching tools",
  description:
    "Claude plugin for engineers: gathers Jira, Slack, GitHub & Notion context, engineers CRISPE prompts, delivers merge-ready code inside Claude. End Slack fatigue — approve or reject, no LLM spirals.",
  keywords: [
    "Claude plugin for developers",
    "Claude plugin for engineers",
    "ship code faster AI",
    "Slack fatigue developers",
    "context switching remote work",
    "AI context engineering",
    "Jira Slack GitHub Notion integration",
    "CRISPE prompt engineering",
    "merge ready code AI",
    "Claude MCP dashboard",
    "automatic standup updates Slack",
    "CI failure debugging AI",
    "LLM spirals",
    "AI fatigue remote engineers",
    "context engineer plugin",
    "plugsville",
  ],
} as const;

/** Canonical site origin — used for absolute OG/Twitter image URLs. */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://plugsville.dev";
}

export function getAbsoluteOgImageUrl(): string {
  return `${getSiteUrl()}${OG_IMAGE.path}`;
}

/** Shared Open Graph + Twitter image config (Facebook, LinkedIn, iMessage, Slack, etc.). */
export function getSocialImageMetadata() {
  const url = getAbsoluteOgImageUrl();

  return {
    openGraphImages: [
      {
        url,
        secureUrl: url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
        type: OG_IMAGE.type,
      },
    ],
    twitterImages: [
      {
        url,
        alt: OG_IMAGE.alt,
      },
    ],
  };
}

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
};

/** Root layout metadata — site-wide defaults + social preview image. */
export function createRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const { openGraphImages, twitterImages } = getSocialImageMetadata();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SEO_DEFAULTS.title,
      template: "%s | plugsville",
    },
    description: SEO_DEFAULTS.description,
    keywords: [...SEO_DEFAULTS.keywords],
    alternates: {
      canonical: siteUrl,
    },
    icons: {
      icon: [
        { url: "/icon.png", type: "image/png", sizes: "1024x1024" },
        { url: "/plugsville-mark.png", type: "image/png", sizes: "1024x1024" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "1024x1024", type: "image/png" }],
      shortcut: "/plugsville-mark.png",
    },
    openGraph: {
      title: SEO_DEFAULTS.title,
      description: SEO_DEFAULTS.description,
      url: siteUrl,
      siteName: "plugsville",
      type: "website",
      locale: "en_US",
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: SEO_DEFAULTS.title,
      description: SEO_DEFAULTS.description,
      images: twitterImages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/** Per-page metadata — inherits social image on every shared URL. */
export function createPageMetadata({
  title,
  description = SEO_DEFAULTS.description,
  path = "/",
}: PageMetadataOptions = {}): Metadata {
  const siteUrl = getSiteUrl();
  const pageUrl = path === "/" ? siteUrl : `${siteUrl}${path}`;
  const pageTitle = title ?? SEO_DEFAULTS.title;
  const { openGraphImages, twitterImages } = getSocialImageMetadata();

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: pageUrl,
      siteName: "plugsville",
      type: "website",
      locale: "en_US",
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: twitterImages,
    },
  };
}
