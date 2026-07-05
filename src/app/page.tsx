import type { Metadata } from "next";
import { HowItWorksStrip } from "@/components/landing/HowItWorksStrip";
import { HeroSection } from "@/components/landing/HeroSection";
import { DashboardSection } from "@/components/landing/DashboardSection";
import { PluginMarketplaceSection } from "@/components/landing/PluginMarketplaceSection";
import { MarketplaceSection } from "@/components/landing/MarketplaceSection";
import { ChatTagsSection } from "@/components/landing/ChatTagsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { SEO_DEFAULTS, OG_IMAGE } from "@/lib/seo";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://plugsville.dev";

export const metadata: Metadata = {
  title: "Ship Quality Code Fast — Claude Plugin for Engineers",
  description: SEO_DEFAULTS.description,
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    url: APP_URL,
    images: [
      {
        url: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    images: [OG_IMAGE.url],
  },
};

/** Landing page — one-pager with all product sections. */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksStrip />
      <DashboardSection />
      <ChatTagsSection />
      <MarketplaceSection />
      <PluginMarketplaceSection />
      <PricingSection />
      <FAQSection />
    </>
  );
}
