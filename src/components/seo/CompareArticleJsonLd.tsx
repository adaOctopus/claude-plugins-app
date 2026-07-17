import type { ComparePage } from "@/lib/guides/types";
import { CANONICAL_SITE_URL } from "@/lib/seo";

type CompareArticleJsonLdProps = {
  page: ComparePage;
};

/** Article structured data for comparison pages. */
export function CompareArticleJsonLd({ page }: CompareArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    author: {
      "@type": "Organization",
      name: "CoolPlugz Inc.",
    },
    publisher: {
      "@type": "Organization",
      name: "coolplugz",
      url: CANONICAL_SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${CANONICAL_SITE_URL}/compare/${page.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
