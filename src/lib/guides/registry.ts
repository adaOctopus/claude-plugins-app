import { phase1Guides } from "@/lib/guides/content/phase1";
import { pillarGuides } from "@/lib/guides/content/pillars";
import { comparePages, funnelGuides } from "@/lib/guides/content/funnel";
import { freedomGuides } from "@/lib/guides/content/freedom";
import {
  troubleshootingGuides,
  TROUBLESHOOTING_GUIDE_SLUG,
} from "@/lib/guides/content/troubleshooting";
import { loopEngineeringGuides } from "@/lib/guides/content/loop-engineering";
import type { ComparePage, Guide } from "@/lib/guides/types";

export { TROUBLESHOOTING_GUIDE_SLUG };

export const allGuides: Guide[] = [
  ...loopEngineeringGuides,
  ...phase1Guides,
  ...pillarGuides,
  ...funnelGuides,
  ...freedomGuides,
  ...troubleshootingGuides,
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

const GUIDE_INDEX_LINK: RelatedLink = { href: "/guides", label: "All guides" };

const CATEGORY_HUBS: Partial<Record<Guide["category"], { slug: string; label: string }>> = {
  freedom: { slug: "developer-freedom-with-claude", label: "Developer freedom hub" },
  persona: { slug: "claude-plugin-for-contractors", label: "Contractors & freelancers" },
};

const PILLAR_HUBS: Record<string, string> = {
  "ai-fatigue-for-developers": "Prevent AI fatigue",
  "context-switching-remote-engineering": "Avoid Context switching",
};

/** Sitewide high-intent guides — surfaced when not already linked. */
const FUNNEL_BOOSTERS: RelatedLink[] = [
  { href: "/guides/loop-engineering-anthropic-playbook", label: "Loop engineering guide" },
  { href: "/guides/best-claude-plugins-for-developers", label: "Best Claude plugins" },
  { href: "/guides/claude-code-after-tutorial", label: "After Claude tutorials" },
  { href: "/guides/make-money-with-claude-as-a-developer", label: "Make money with Claude" },
  { href: "/#make-money", label: "Refer & earn with CoolPlugz" },
];

function addRelatedLink(links: RelatedLink[], seen: Set<string>, href: string, label: string) {
  if (seen.has(href)) return;
  seen.add(href);
  links.push({ href, label });
}

/** Build deduplicated related links for a guide page (pillar + category hubs + funnel boosters). */
export function buildGuideRelatedLinks(guide: Guide): RelatedLink[] {
  const links: RelatedLink[] = [];
  const seen = new Set<string>();

  const add = (href: string, label: string) => addRelatedLink(links, seen, href, label);

  for (const relatedSlug of guide.relatedSlugs) {
    const related = allGuides.find((g) => g.slug === relatedSlug);
    if (related) {
      add(`/guides/${related.slug}`, related.metaTitle);
    }
  }

  if (guide.pillarSlug) {
    const pillar = allGuides.find((g) => g.slug === guide.pillarSlug);
    if (pillar) {
      add(`/guides/${pillar.slug}`, PILLAR_HUBS[pillar.slug] ?? pillar.metaTitle);
    }
  }

  const categoryHub = CATEGORY_HUBS[guide.category];
  if (categoryHub && guide.slug !== categoryHub.slug) {
    add(`/guides/${categoryHub.slug}`, categoryHub.label);
  }

  if (guide.category === "pillar") {
    const otherPillar = allGuides.find(
      (g) => g.category === "pillar" && g.slug !== guide.slug
    );
    if (otherPillar) {
      add(`/guides/${otherPillar.slug}`, PILLAR_HUBS[otherPillar.slug] ?? otherPillar.metaTitle);
    }
  }

  for (const booster of FUNNEL_BOOSTERS) {
    if (booster.href === `/guides/${guide.slug}`) continue;
    if (seen.has(booster.href)) continue;
    if (links.length >= 6) break;
    add(booster.href, booster.label);
  }

  add(GUIDE_INDEX_LINK.href, GUIDE_INDEX_LINK.label);

  return links;
}

/** Related links for compare pages — cross-link guides, other comparisons, and hub. */
export function buildCompareRelatedLinks(page: ComparePage): RelatedLink[] {
  const links: RelatedLink[] = [];
  const seen = new Set<string>();
  const add = (href: string, label: string) => addRelatedLink(links, seen, href, label);

  for (const relatedSlug of page.relatedSlugs) {
    const guide = allGuides.find((g) => g.slug === relatedSlug);
    if (guide) {
      add(`/guides/${guide.slug}`, guide.metaTitle);
      continue;
    }
    const compare = allComparePages.find((p) => p.slug === relatedSlug);
    if (compare) {
      add(`/compare/${compare.slug}`, compare.metaTitle);
    }
  }

  add("/guides/best-claude-plugins-for-developers", "Best Claude plugins");
  add("/guides/claude-plugin-mcp-explained", "Claude MCP explained");
  add(GUIDE_INDEX_LINK.href, GUIDE_INDEX_LINK.label);

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
  { href: `/guides/${TROUBLESHOOTING_GUIDE_SLUG}`, label: "Integration troubleshooting" },
  { href: "/guides/developer-freedom-with-claude", label: "Freedom with Claude" },
  { href: "/guides/make-money-with-claude-as-a-developer", label: "Make money with Claude" },
  { href: "/#make-money", label: "Passive income with AI" },
  { href: "/guides/passive-income-refer-coolplugz", label: "Refer CoolPlugz" },
  { href: "/guides/best-claude-plugins-for-developers", label: "Best Claude plugins" },
  { href: "/guides/claude-code-after-tutorial", label: "Claude Code best practices" },
  { href: "/guides/loop-engineering-anthropic-playbook", label: "Loop engineering playbook" },
  { href: "/guides/ai-fatigue-for-developers", label: "Prevent AI fatigue" },
  { href: "/guides/context-switching-remote-engineering", label: "AvoidContext switching" },
] as const;

export const northStarQueries = [
  "how to make money with claude",
  "make money with claude",
  "make money with AI",
  "generate passive income with AI",
  "generate passive income with Claude",
  "passive income with Claude",
  "passive income with AI",
  "best claude plugins",
  "best claude skills",
  "best claude connectors",
  "claude automation",
  "claude best practices",
  "claude code best practices",
  "claude code agents",
  "claude code tutorial",
  "loop engineering",
  "loop engineering anthropic",
  "anthropic agent loop",
  "gather act verify repeat",
  "claude agent sdk loop",
  "loop engineering vs prompt engineering",
  "claude code orchestration",
  "work less freelance developer",
  "AI fatigue",
  "context switching remote work",
  "claude plugin for developers",
  "github ci llm loop",
  "slack api blocked enterprise",
  "github sso personal access token",
] as const;
