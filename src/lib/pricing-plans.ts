export type BillingPeriod = "monthly" | "annual";
export type PaidTier = "pro" | "premium";
export type PaidPlan = `${PaidTier}_${BillingPeriod}`;

/** Single source of truth for displayed & checkout amounts (USD). */
export const PRICING_AMOUNTS = {
  pro: { monthly: 17, annual: 147 },
  premium: { monthly: 47, annual: 387 },
} as const;

export const billingOptions = {
  monthly: {
    toggleLabel: "",
  },
  annual: {
    toggleLabel: "Save up to 35%",
  },
} as const;

export const tierPricing = {
  pro: {
    monthly: { amount: PRICING_AMOUNTS.pro.monthly, period: "/month" },
    annual: {
      amount: PRICING_AMOUNTS.pro.annual,
      period: "/year",
      savings: "Save ~35%",
    },
  },
  premium: {
    monthly: { amount: PRICING_AMOUNTS.premium.monthly, period: "/month" },
    annual: {
      amount: PRICING_AMOUNTS.premium.annual,
      period: "/year",
      savings: "Save ~34%",
    },
  },
} as const;

export const freePlan = {
  id: "free" as const,
  name: "Free",
  price: "$0",
  amount: 0,
  period: "",
  badge: "",
  tagline: "Context Prompt Builder — fetch context, get engineered prompts back.",
  features: [
    "Jira + Slack + Notion context linking",
    "Full CRISPE prompt engineering",
    "Engineered prompts returned to you",
    "GitHub CI checks & PR automations",
    "In-Claude dashboard & Slack handling",
    "Code execution environment",
  ],
  cta: "START FOR FREE",
};

export const proPlan = {
  id: "pro" as const,
  name: "Pro",
  badge: "Recommended",
  description:
    "Context Engineer Autopilot for engineers — full stack context, merge-ready code, in-Claude dashboard.",
  features: [
    "Up to 3 premium plugins",
    "Scans Jira + Slack + GitHub + Notion",
    "Automated advanced Prompt Engineering",
    "6 AI Agents working in parallel",
    "In-Claude dashboard via MCP",
    "Slack messages handled hourly",
  ],
  cta: "GET PRO",
};

export const premiumPlan = {
  id: "premium" as const,
  name: "Premium",
  badge: "For contractors",
  description:
    "Multiple clients, workspaces, and premium plugins — built for contractors with multiple clients.",
  features: [
    "Everything in Pro",
    "Up to 10 premium plugins per month",
    "Multiple client workspaces",
    "Multiple Slack + Jira connections",
    "Separate context profiles per client",
    "Priority sync across all accounts",
  ],
  cta: "GET PREMIUM",
};

export function getPaidPlanKey(tier: PaidTier, billing: BillingPeriod): PaidPlan {
  return `${tier}_${billing}`;
}

export function formatTierPrice(tier: PaidTier, billing: BillingPeriod): string {
  return `$${tierPricing[tier][billing].amount}`;
}
