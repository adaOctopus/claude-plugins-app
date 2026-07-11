export type MarketplacePlugin = {
  slug: string;
  title: string;
  description: string;
  category: string;
  priceMonthly: number;
  isFlagship: boolean;
  createdAt: string;
};

/** Standalone free-tier plugin — prompt builder only (Jira, Slack, Notion). */
export const FREE_PLUGIN_SLUG = "context-prompts";

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
    slug: FREE_PLUGIN_SLUG,
    title: "Context Prompt Builder",
    description:
      "Connect Jira, Slack & Notion — fetches your context and returns fully engineered CRISPE prompts. No GitHub, no code execution, no dashboard.",
    category: "integrations",
    priceMonthly: 0,
    isFlagship: false,
    createdAt: "2026-01-15T00:00:00.000Z",
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

export function isFreeInstallPlugin(plugin: MarketplacePlugin) {
  return !plugin.isFlagship && plugin.priceMonthly === 0;
}

export function requiresProSubscription(plugin: MarketplacePlugin) {
  return plugin.isFlagship || plugin.priceMonthly > 0;
}
