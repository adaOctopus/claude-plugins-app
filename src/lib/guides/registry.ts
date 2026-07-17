import { phase1Guides } from "@/lib/guides/content/phase1";
import { pillarGuides } from "@/lib/guides/content/pillars";
import { comparePages, funnelGuides } from "@/lib/guides/content/funnel";
import { freedomGuides } from "@/lib/guides/content/freedom";
import type { ComparePage, Guide } from "@/lib/guides/types";

export const allGuides: Guide[] = [
  ...phase1Guides,
  ...pillarGuides,
  ...funnelGuides,
  ...freedomGuides,
];

export const allComparePages: ComparePage[] = comparePages;

export function getGuideBySlug(slug: string): Guide | undefined {
  return allGuides.find((guide) => guide.slug === slug);
}

export function getCompareBySlug(slug: string): ComparePage | undefined {
  return allComparePages.find((page) => page.slug === slug);
}

export function getGuideSlugs(): string[] {
  return allGuides.map((guide) => guide.slug);
}

export function getCompareSlugs(): string[] {
  return allComparePages.map((page) => page.slug);
}

/** Map FAQ accordion questions to guide slugs for "Read full guide" links. */
export function getGuideSlugForFaqQuestion(question: string): string | undefined {
  const guide = allGuides.find((g) => g.faqQuestion === question);
  return guide?.slug;
}

type RelatedLink = { href: string; label: string };

/** Build deduplicated related links for a guide page (pillar may overlap relatedSlugs). */
export function buildGuideRelatedLinks(guide: Guide): RelatedLink[] {
  const links: RelatedLink[] = [];
  const seen = new Set<string>();

  const add = (href: string, label: string) => {
    if (seen.has(href)) return;
    seen.add(href);
    links.push({ href, label });
  };

  for (const relatedSlug of guide.relatedSlugs) {
    const related = allGuides.find((g) => g.slug === relatedSlug);
    if (related) {
      add(`/guides/${related.slug}`, related.metaTitle);
    }
  }

  if (guide.pillarSlug) {
    const pillar = allGuides.find((g) => g.slug === guide.pillarSlug);
    if (pillar) {
      add(`/guides/${pillar.slug}`, pillar.metaTitle);
    }
  }

  return links;
}

/** Deduplicate related links by href — safe for React list keys. */
export function dedupeRelatedLinks(links: RelatedLink[]): RelatedLink[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

export const footerGuideLinks = [
  { href: "/guides", label: "All resources" },
  { href: "/guides/developer-freedom-with-claude", label: "Freedom with Claude" },
  { href: "/guides/make-money-with-claude-as-a-developer", label: "Make money with Claude" },
  { href: "/guides/best-claude-plugins-for-developers", label: "Best Claude plugins" },
] as const;

export const northStarQueries = [
  "how to make money with claude",
  "make money with claude",
  "best claude plugins",
  "best claude skills",
  "best claude connectors",
  "claude automation",
  "work less freelance developer",
  "AI fatigue",
  "context switching remote work",
  "claude plugin for developers",
] as const;
