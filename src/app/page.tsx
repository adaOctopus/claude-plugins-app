import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { DashboardSection } from "@/components/landing/DashboardSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { ReleasesSection } from "@/components/landing/ReleasesSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { MarketplaceSection } from "@/components/landing/MarketplaceSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";

/** Landing page — one-pager with all product sections. */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ReleasesSection />
      {/* <WorkflowSection /> */}
      {/* <ProblemSection /> */}
      <SolutionSection />
      <DashboardSection />
      {/* <IntegrationsSection /> */}
      <MarketplaceSection />
      <PricingSection />
      <FAQSection />
    </>
  );
}
