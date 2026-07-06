import { HowItWorksStrip } from "@/components/landing/HowItWorksStrip";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { DashboardSection } from "@/components/landing/DashboardSection";
import { PluginMarketplaceSection } from "@/components/landing/PluginMarketplaceSection";
import { MarketplaceSection } from "@/components/landing/MarketplaceSection";
import { ChatTagsSection } from "@/components/landing/ChatTagsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Ship merge-ready code without switching tools.",
  path: "/",
});

/** Landing page — one-pager with all product sections. */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksStrip />
      <BenefitsSection />
      <DashboardSection />
      <ChatTagsSection />
      <MarketplaceSection />
      <PluginMarketplaceSection />
      <PricingSection />
      <FAQSection />
    </>
  );
}
