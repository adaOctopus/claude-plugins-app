import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideDocument } from "@/components/guides/GuideDocument";
import { GuideArticleJsonLd } from "@/components/seo/GuideArticleJsonLd";
import { buildGuideRelatedLinks, getGuideBySlug, getGuideSlugs } from "@/lib/guides/registry";
import { CANONICAL_SITE_URL, createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return createPageMetadata({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: `/guides/${guide.slug}`,
    siteUrl: CANONICAL_SITE_URL,
  });
}

/** Individual SEO guide page — problem-aware content for organic search. */
export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedLinks = buildGuideRelatedLinks(guide);

  return (
    <>
      <GuideArticleJsonLd guide={guide} />
      <GuideDocument
        title={guide.title}
        category={guide.category}
        directAnswer={guide.directAnswer}
        sections={guide.sections}
        productPitch={guide.productPitch}
        relatedLinks={relatedLinks}
      />
    </>
  );
}
