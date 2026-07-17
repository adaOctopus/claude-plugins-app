import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideDocument } from "@/components/guides/GuideDocument";
import { CompareArticleJsonLd } from "@/components/seo/CompareArticleJsonLd";
import { allGuides, allComparePages, dedupeRelatedLinks, getCompareBySlug, getCompareSlugs } from "@/lib/guides/registry";
import { CANONICAL_SITE_URL, createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCompareSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getCompareBySlug(slug);
  if (!page) return {};

  return createPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/compare/${page.slug}`,
    siteUrl: CANONICAL_SITE_URL,
  });
}

/** Comparison page — bottom-funnel SEO for high-intent alternative searches. */
export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getCompareBySlug(slug);
  if (!page) notFound();

  const relatedLinks = dedupeRelatedLinks(
    page.relatedSlugs
      .map((relatedSlug) => {
        const guide = allGuides.find((g) => g.slug === relatedSlug);
        if (guide) {
          return { href: `/guides/${guide.slug}`, label: guide.metaTitle };
        }
        const compare = allComparePages.find((p) => p.slug === relatedSlug);
        if (compare) {
          return { href: `/compare/${compare.slug}`, label: compare.metaTitle };
        }
        return null;
      })
      .filter((link): link is { href: string; label: string } => link !== null)
  ).slice(0, 4);

  return (
    <>
      <CompareArticleJsonLd page={page} />
      <GuideDocument
        title={page.title}
        category="compare"
        directAnswer={page.directAnswer}
        sections={page.sections}
        productPitch={page.productPitch}
        relatedLinks={relatedLinks}
      />
    </>
  );
}
