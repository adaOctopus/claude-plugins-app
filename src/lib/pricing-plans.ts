export type BillingPeriod = "monthly" | "annual";
export type PaidTier = "pro" | "premium";
export type PaidPlan = `${PaidTier}_${BillingPeriod}`;

/** Single source of truth for displayed & checkout amounts (USD). */
export const PRICING_AMOUNTS = {
  pro: { monthly: 17, annual: 147 },
  premium: { monthly: 47, annual: 387 },
} as const;

export type PricingFeature = {
  label: string;
  /** Trial card: show as crossed-out / not included on free tier */
  excluded?: boolean;
};

export const billingOptions = {
  monthly: {
    toggleLabel: "",
  },
  annual: {
    toggleLabel: "Save ~28%",
  },
} as const;

export const tierPricing = {
  pro: {
    monthly: { amount: PRICING_AMOUNTS.pro.monthly, period: "/month" },
    annual: {
      amount: PRICING_AMOUNTS.pro.annual,
      period: "/year",
      savings: "Save ~28%",
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

export const trialPlanFeatures: PricingFeature[] = [
  { label: "Jira + GitHub + Notion + Slack integration" },
  { label: "PR workflow: branches, CI checks & review comments" },
  { label: "Unlimited usage", excluded: true },
];

/** Full Pro card list — every trial feature plus paid-only items. */
export const proPlanFeatures: PricingFeature[] = [
  { label: "Jira + GitHub + Notion + Slack integration" },
  { label: "Smart branch detection" },
  { label: "Push verification via GitHub API" },
  { label: "PR creation & CI status checks" },
  { label: "PR review comment resolution" },
  { label: "Unlimited usage" },
  { label: "Tasks with multiple repos covered" },
  { label: "Developer insights" },
  // { label: "Persistent MCP access while subscribed" },
  // { label: "Priority Claude Code session orchestration" },
];

/** @deprecated Use proPlanFeatures on the pricing card */
export const proAdditiveFeatures = [
  "Unlimited usage",
  "Tasks with multiple repos covered",
  "Developer insights",
] as const;

/** @deprecated Legacy — use trialPlanFeatures */
export const baseAccessFeatures = trialPlanFeatures
  .filter((f) => !f.excluded)
  .map((f) => f.label);

/** @deprecated Use trialPlanFeatures */
export const trialFeatures = baseAccessFeatures;

/** One-line Pro value vs Trial on pricing card. */
export const proValueLine = "";

/** Added on Premium — legacy internal tier only. */
export const premiumAdditiveFeatures = [
  "Multiple client workspaces",
  "Multiple Slack + Jira connections",
  "Separate context profiles per client",
  "Priority sync across all accounts",
] as const;

/** Added on Enterprise — shown after “Everything in Pro, plus:”. */
export const enterpriseAdditiveFeatures = [
  "Multi-seat licensing for dev teams",
  "CI/CD & automated QA checks",
  "Org-wide rollout & onboarding",
  "Dedicated success & custom SLAs",
  "SSO & advanced security options",
] as const;

/** Full Pro feature set for SEO and docs. */
export const proPlanFeaturesFlat = proPlanFeatures.map((f) => f.label);

export const trialPlan = {
  id: "trial" as const,
  name: "Free Trial",
  price: "$0",
  amount: 0,
  period: "/7 days",
  badge: "No Card Required",
  highlightLabel: "",
  tagline: "No more babysitting Claude Code",
  durationNote: "",
  featureHeader: "Includes:",
  features: trialPlanFeatures,
  cta: "START FREE TRIAL",
};

/** @deprecated Use trialPlan */
export const dailyPassPlan = trialPlan;

/** @deprecated Use trialPlan */
export const freePlan = trialPlan;

export const proPlan = {
  id: "pro" as const,
  name: "Pro",
  badge: "Recommended",
  tagline: "Stay on top of your work effortlessly",
  featureHeader: "Includes:",
  features: proPlanFeatures,
  cta: "GET PRO",
};

export const premiumPlan = {
  id: "premium" as const,
  name: "Premium",
  badge: "For contractors",
  tagline: "Multiple clients, separate workspaces",
  featureHeader: "Everything in Pro, plus:",
  features: premiumAdditiveFeatures,
  cta: "GET PREMIUM",
};

export const enterprisePlan = {
  id: "enterprise" as const,
  name: "Enterprise",
  badge: "For engineering teams",
  tagline: "Volume seats, CI/CD & pipeline optimization",
  featureHeader: "Everything in Pro, plus:",
  features: enterpriseAdditiveFeatures,
  cta: "CONTACT SALES",
};

export function getPaidPlanKey(tier: PaidTier, billing: BillingPeriod): PaidPlan {
  return `${tier}_${billing}`;
}

export function formatTierPrice(tier: PaidTier, billing: BillingPeriod): string {
  return `$${tierPricing[tier][billing].amount}`;
}
