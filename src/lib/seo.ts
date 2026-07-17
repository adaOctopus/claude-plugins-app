import type { Metadata } from "next";

export const CANONICAL_SITE_URL = "https://www.coolplugz.com";

export const OG_TAGLINE =
  "Ship merge-ready code without tool switching.";

export const OG_IMAGE = {
  path: "/og-coolplugz.jpg",
  /** Bump when replacing the social preview asset so X/FB re-fetch. */
  version: "2",
  width: 1200,
  height: 630,
  alt: "coolplugz — Ship merge-ready code without tool switching",
  type: "image/jpeg" as const,
} as const;

/** X/Twitter card descriptions should stay under ~200 chars. */
export const TWITTER_CARD_DESCRIPTION =
  "Claude plugin for devs: Jira, Slack, GitHub & Notion context, advanced prompting, merge-ready code, and Slack handling inside Claude.";

export const SEO_DEFAULTS = {
  title: "coolplugz — Ship merge-ready code without switching tools",
  description:
    "Claude plugin for devs: gathers context from Jira, Slack, GitHub & Notion, writes great prompts, ships merge-ready code & handles your Slack.",
  keywords: [
    "Claude plugin for developers",
    "Claude plugin for engineers",
    "how to automate CI checks",
    "how to fix CI failures",
    "how to fix CI errors with AI",
    "ship code faster AI",
    "AI fatigue",
    "how to fix burnout",
    "Slack fatigue developers",
    "context switching remote work",
    "AI context engineering",
    "Jira Slack GitHub Notion integration",
    "CRISPE prompt engineering",
    "how to automate slack",
    "how to automate slack messages",
    "how to automate slack messages with AI",
    "how to automate slack messages with Claude",
    "merge ready code AI",
    "Claude MCP dashboard",
    "automatic standup updates Slack",
    "CI failure debugging AI",
    "LLM spirals",
    "AI fatigue remote engineers",
    "context engineer plugin",
    "coolplugz",
    "make money with claude",
    "how to make money with claude",
    "best claude plugins",
    "best claude skills",
    "best claude connectors",
    "work less freelance developer",
  ],
} as const;

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function isDeployPreviewHost(host: string): boolean {
  const normalized = host.toLowerCase();
  return (
    normalized === "localhost" ||
    normalized.startsWith("127.0.0.1") ||
    normalized.endsWith(".vercel.app") ||
    normalized.endsWith(".vercel.sh")
  );
}

function isPublicSiteUrl(url: string): boolean {
  try {
    return !isDeployPreviewHost(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Canonical site origin — used when no request host is available. */
export function getSiteUrl(): string {
  const candidates: string[] = [];

  if (process.env.NEXT_PUBLIC_APP_URL) {
    candidates.push(process.env.NEXT_PUBLIC_APP_URL);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    candidates.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }

  for (const raw of candidates) {
    const url = normalizeSiteUrl(raw);
    if (isPublicSiteUrl(url)) {
      return url;
    }
  }

  return CANONICAL_SITE_URL;
}

/** Prefer the incoming host so social crawlers get coolplugz.com, not a Vercel deploy URL. */
export function resolveSiteUrlFromRequest(requestHeaders: Headers): string {
  const host =
    requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    requestHeaders.get("host")?.trim();

  if (host && !isDeployPreviewHost(host)) {
    const protocol =
      requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
    const hostname = host.split(":")[0].toLowerCase();
    if (hostname === "coolplugz.com" || hostname === "www.coolplugz.com") {
      return CANONICAL_SITE_URL;
    }
    return normalizeSiteUrl(`${protocol}://${host}`);
  }

  return getSiteUrl();
}

export function getAbsoluteOgImageUrl(siteUrl = getSiteUrl()): string {
  return `${siteUrl}${OG_IMAGE.path}?v=${OG_IMAGE.version}`;
}

/** Shared Open Graph + Twitter image config (Facebook, LinkedIn, iMessage, Slack, etc.). */
export function getSocialImageMetadata(siteUrl = getSiteUrl()) {
  const url = getAbsoluteOgImageUrl(siteUrl);

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
  siteUrl?: string;
};

/** Root layout metadata — site-wide defaults + social preview image. */
export function createRootMetadata(options: { siteUrl?: string } = {}): Metadata {
  const siteUrl = options.siteUrl ?? getSiteUrl();
  const { openGraphImages } = getSocialImageMetadata(siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SEO_DEFAULTS.title,
      template: "%s | coolplugz",
    },
    description: SEO_DEFAULTS.description,
    keywords: [...SEO_DEFAULTS.keywords],
    alternates: {
      canonical: siteUrl,
    },
    icons: {
      icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
      apple: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
      shortcut: "/icon.png",
    },
    openGraph: {
      title: SEO_DEFAULTS.title,
      description: SEO_DEFAULTS.description,
      url: siteUrl,
      siteName: "coolplugz",
      type: "website",
      locale: "en_US",
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: SEO_DEFAULTS.title,
      description: TWITTER_CARD_DESCRIPTION,
      images: [openGraphImages[0]?.url ?? getAbsoluteOgImageUrl(siteUrl)],
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
  siteUrl: siteUrlOverride,
}: PageMetadataOptions = {}): Metadata {
  const siteUrl = siteUrlOverride ?? getSiteUrl();
  const pageUrl = path === "/" ? siteUrl : `${siteUrl}${path}`;
  const pageTitle = title ?? SEO_DEFAULTS.title;
  const { openGraphImages } = getSocialImageMetadata(siteUrl);

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
      siteName: "coolplugz",
      type: "website",
      locale: "en_US",
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: TWITTER_CARD_DESCRIPTION,
      images: [openGraphImages[0]?.url ?? getAbsoluteOgImageUrl(siteUrl)],
    },
  };
}
