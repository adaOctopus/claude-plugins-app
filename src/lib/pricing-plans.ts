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

export const proPlanFeatures = [
  "Up to 3 premium plugins",
  "Scans Jira + Slack + GitHub + Notion",
  "Automated advanced Prompt Engineering",
  "6 AI Agents working in parallel",
  "In-Claude dashboard via MCP",
  "Slack messages handled hourly",
] as const;

export const freePlan = {
  id: "free" as const,
  name: "Free 1-Day Trial",
  price: "$0",
  amount: 0,
  period: "for 1 day",
  badge: "No card required",
  tagline: "Full Pro for 24 hours — credit card free. We mint a unique MCP URL on our server.",
  durationNote:
    "Your MCP URL expires after 1 day (managed on our server). Upgrade to Pro anytime to keep access.",
  features: proPlanFeatures,
  cta: "START FREE TRIAL",
  trialDays: 1,
};

export const proPlan = {
  id: "pro" as const,
  name: "Pro",
  badge: "Recommended",
  description:
    "Context Engineer Autopilot for engineers — full stack context, merge-ready code, in-Claude dashboard.",
  features: proPlanFeatures,
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
