import type { Guide } from "@/lib/guides/types";
import { CANONICAL_SITE_URL } from "@/lib/seo";

type GuideArticleJsonLdProps = {
  guide: Guide;
};

/** Article structured data for guide pages. */
export function GuideArticleJsonLd({ guide }: GuideArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    keywords: guide.keywords.join(", "),
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
      "@id": `${CANONICAL_SITE_URL}/guides/${guide.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
