import { faqItems } from "@/components/landing/FAQSection";
import {
  engineerProblemsSectionSchema,
  engineerProblemsSeoItems,
  ENGINEER_PROBLEMS_SECTION_ID,
} from "@/lib/engineer-problems-seo-copy";
import { makeMoneyFaqItems, makeMoneyHowToSchema } from "@/lib/referral-seo-copy";
import { CANONICAL_SITE_URL, getAbsoluteOgImageUrl, OG_TAGLINE, SEO_DEFAULTS } from "@/lib/seo";
import { PRICING_AMOUNTS } from "@/lib/pricing-plans";

export function JsonLd() {
  const appUrl = CANONICAL_SITE_URL;
  const ogImageUrl = getAbsoluteOgImageUrl(appUrl);

  const allFaqItems = [...faqItems, ...makeMoneyFaqItems];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: makeMoneyHowToSchema.name,
    description: makeMoneyHowToSchema.description,
    step: makeMoneyHowToSchema.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  const engineerProblemsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: engineerProblemsSectionSchema.name,
    description: engineerProblemsSectionSchema.description,
    url: `${appUrl}/#${ENGINEER_PROBLEMS_SECTION_ID}`,
    itemListElement: engineerProblemsSeoItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      description: item.description,
      url: `${appUrl}/#${item.id}`,
    })),
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "coolplugz",
    url: appUrl,
    description: SEO_DEFAULTS.description,
    slogan: OG_TAGLINE,
    image: ogImageUrl,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "coolplugz",
    url: appUrl,
    description: SEO_DEFAULTS.description,
    inLanguage: "en-US",
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "coolplugz Context Engineer",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: SEO_DEFAULTS.description,
    offers: [
      {
        "@type": "Offer",
        price: String(PRICING_AMOUNTS.pro.monthly),
        priceCurrency: "USD",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        name: "Pro monthly",
      },
      {
        "@type": "Offer",
        price: String(PRICING_AMOUNTS.pro.annual),
        priceCurrency: "USD",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        name: "Pro annual",
      },
      {
        "@type": "Offer",
        price: String(PRICING_AMOUNTS.premium.monthly),
        priceCurrency: "USD",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        name: "Premium monthly",
      },
      {
        "@type": "Offer",
        price: String(PRICING_AMOUNTS.premium.annual),
        priceCurrency: "USD",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        name: "Premium annual",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(engineerProblemsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
