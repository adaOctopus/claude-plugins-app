export type BillingPeriod = "monthly" | "annual";
export type PaidTier = "pro" | "premium";
export type PaidPlan = `${PaidTier}_${BillingPeriod}`;

/** Single source of truth for displayed & checkout amounts (USD). */
export const PRICING_AMOUNTS = {
  pro: { monthly: 47, annual: 397 },
  premium: { monthly: 47, annual: 387 },
} as const;

export const billingOptions = {
  monthly: {
    toggleLabel: "",
  },
  annual: {
    toggleLabel: "Save ~30%",
  },
} as const;

export const tierPricing = {
  pro: {
    monthly: { amount: PRICING_AMOUNTS.pro.monthly, period: "/month" },
    annual: {
      amount: PRICING_AMOUNTS.pro.annual,
      period: "/year",
      savings: "Save ~30%",
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

/** Core access features — shared by Daily Pass and Pro. */
export const baseAccessFeatures = [
  "Scans Jira + Slack + GitHub + Notion",
  "6 AI Agents working in parallel",
  "In-Claude dashboard via MCP",
] as const;

/** @deprecated Use baseAccessFeatures */
export const trialFeatures = baseAccessFeatures;

/** Added on Pro — shown after “Everything in Daily Pass, plus:”. */
export const proAdditiveFeatures = [
  "Automated Prompt Engineering",
  "Slack web or API integration",
  "10 full task runs per month included",
  "Up to $4 server budget per run",
  "Top up extra runs anytime from your account",
] as const;

/** One-line Pro value vs Daily Pass on pricing card. */
export const proValueLine =
  "Sufficent for one month's work";

/** Added on Premium — shown after “Everything in Pro, plus:”. */
export const premiumAdditiveFeatures = [
  "Multiple client workspaces",
  "Multiple Slack + Jira connections",
  "Separate context profiles per client",
  "Priority sync across all accounts",
] as const;

/** Added on Enterprise — shown after “Everything in Premium, plus:”. */
export const enterpriseAdditiveFeatures = [
  "Multi-seat licensing for dev teams",
  "CI/CD & automated QA checks",
  "Org-wide rollout & onboarding",
  "Dedicated success & custom SLAs",
  "SSO & advanced security options",
] as const;

/** Full Pro feature set (daily pass + paid). */
export const proPlanFeatures = [...baseAccessFeatures, ...proAdditiveFeatures] as const;

export const dailyPassPlan = {
  id: "daily" as const,
  name: "Daily Pass",
  price: "$5",
  amount: 5,
  period: "/day",
  badge: "Try it today",
  tagline: "Try CoolPlugz for a day - 1 full task run",
  durationNote: "24-hour MCP access",
  featureHeader: "Includes:",
  features: [
    ...baseAccessFeatures,
  ] as const,
  cta: "GET DAILY PASS",
};

/** @deprecated Use dailyPassPlan */
export const freePlan = dailyPassPlan;

export const proPlan = {
  id: "pro" as const,
  name: "Pro",
  badge: "Recommended",
  tagline: "For engineers shipping every day",
  featureHeader: "Everything in Daily Pass, plus:",
  features: proAdditiveFeatures,
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
