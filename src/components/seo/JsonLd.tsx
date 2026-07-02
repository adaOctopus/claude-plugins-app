import { faqItems } from "@/components/landing/FAQSection";
import { OG_TAGLINE, SEO_DEFAULTS } from "@/lib/seo";

export function JsonLd() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://plugsville.dev";

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
    name: "plugsville",
    url: appUrl,
    description: SEO_DEFAULTS.description,
    slogan: OG_TAGLINE,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "plugsville",
    url: appUrl,
    description: SEO_DEFAULTS.description,
    inLanguage: "en-US",
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "plugsville Context Engineer",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: SEO_DEFAULTS.description,
    offers: [
      {
        "@type": "Offer",
        price: "19",
        priceCurrency: "EUR",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        price: "149",
        priceCurrency: "EUR",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
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
