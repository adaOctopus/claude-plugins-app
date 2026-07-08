import { faqItems } from "@/components/landing/FAQSection";
import { getAbsoluteOgImageUrl, getSiteUrl, OG_TAGLINE, SEO_DEFAULTS } from "@/lib/seo";
import { PRICING_AMOUNTS } from "@/lib/pricing-plans";

export function JsonLd() {
  const appUrl = getSiteUrl();
  const ogImageUrl = getAbsoluteOgImageUrl();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
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
        priceCurrency: "EUR",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        name: "Pro monthly",
      },
      {
        "@type": "Offer",
        price: String(PRICING_AMOUNTS.pro.annual),
        priceCurrency: "EUR",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        name: "Pro annual",
      },
      {
        "@type": "Offer",
        price: String(PRICING_AMOUNTS.premium.monthly),
        priceCurrency: "EUR",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        name: "Premium monthly",
      },
      {
        "@type": "Offer",
        price: String(PRICING_AMOUNTS.premium.annual),
        priceCurrency: "EUR",
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
