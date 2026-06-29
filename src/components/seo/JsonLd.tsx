import { faqItems } from "@/components/landing/FAQSection";

export function JsonLd() {
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
    name: "Project X",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://projectx.dev",
    description:
      "Claude plugins that gather context from Jira, Slack, and GitHub for accurate AI-assisted engineering.",
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Project X Context Engineer",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
