export type MarketplacePlugin = {
  slug: string;
  title: string;
  description: string;
  category: string;
  priceMonthly: number;
  isFlagship: boolean;
  createdAt: string;
};

/** Default catalog — shown when DB is empty; also used for detail-page fallback. */
export const MARKETPLACE_CATALOG: MarketplacePlugin[] = [
  {
    slug: "context-engineer",
    title: "Context Engineering Autopilot",
    description:
      "Gathers full context from Jira, Slack, GitHub, Notion — ships code with CI green, and handles Slack communications.",
    category: "engineering",
    priceMonthly: 0,
    isFlagship: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    slug: "slack-fetch",
    title: "Slack Fetch",
    description:
      "Pull threads, mentions, and standup context from Slack into Claude — drafts replies based on your unique tone.",
    category: "integrations",
    priceMonthly: 0,
    isFlagship: false,
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    slug: "notion-fetch",
    title: "Notion Fetch",
    description:
      "Sync specs, sprint notes, and docs from Notion so every prompt references the right documentation.",
    category: "integrations",
    priceMonthly: 0,
    isFlagship: false,
    createdAt: "2026-01-20T00:00:00.000Z",
  },
  {
    slug: "jira-fetch",
    title: "Jira Fetch",
    description:
      "Tickets, epics, and acceptance criteria from Jira — attached automatically before any coding task runs.",
    category: "integrations",
    priceMonthly: 0,
    isFlagship: false,
    createdAt: "2026-01-25T00:00:00.000Z",
  },
];

export const MARKETPLACE_FILTERS = [
  { id: "all", label: "All" },
  { id: "engineering", label: "Engineering" },
  { id: "integrations", label: "Integrations" },
  { id: "free", label: "Free" },
] as const;

export type MarketplaceFilterId = (typeof MARKETPLACE_FILTERS)[number]["id"];

export function formatPluginPrice(plugin: MarketplacePlugin): string {
  if (plugin.isFlagship) return "Included in Pro plan";
  if (plugin.priceMonthly === 0) return "Free";
  return `€${plugin.priceMonthly.toFixed(2)}/mo`;
}
