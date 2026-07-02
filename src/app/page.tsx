import type { Metadata } from "next";
import { HowItWorksStrip } from "@/components/landing/HowItWorksStrip";
import { HeroSection } from "@/components/landing/HeroSection";
import { DashboardSection } from "@/components/landing/DashboardSection";
import { PluginMarketplaceSection } from "@/components/landing/PluginMarketplaceSection";
import { MarketplaceSection } from "@/components/landing/MarketplaceSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { SEO_DEFAULTS } from "@/lib/seo";

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
  },
};

/** Landing page — one-pager with all product sections. */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksStrip />
      <DashboardSection />
      <MarketplaceSection />
      <PluginMarketplaceSection />
      
      <PricingSection />
      <FAQSection />
    </>
  );
}
