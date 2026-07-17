import { phase1Guides } from "@/lib/guides/content/phase1";
import { pillarGuides } from "@/lib/guides/content/pillars";
import { comparePages, funnelGuides } from "@/lib/guides/content/funnel";
import type { ComparePage, Guide } from "@/lib/guides/types";

export const allGuides: Guide[] = [...phase1Guides, ...pillarGuides, ...funnelGuides];

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
  { href: "/guides/ai-fatigue-for-developers", label: "AI fatigue guide" },
  { href: "/guides/context-switching-remote-engineering", label: "Context switching" },
  { href: "/guides/best-claude-plugins-for-developers", label: "Best Claude plugins" },
  { href: "/guides", label: "All guides" },
] as const;

export const northStarQueries = [
  "AI fatigue",
  "context switching remote work",
  "slack anxiety remote work",
  "LLM spirals",
  "claude plugin for developers",
] as const;
