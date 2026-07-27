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

/** Core access features — shared by One Run and Pro. */
export const baseAccessFeatures = [
  "Syncs Jira + Slack + GitHub + Notion",
  "One full task completion",
  "Interact with Coolplugz via Claude",
] as const;

/** @deprecated Use baseAccessFeatures */
export const trialFeatures = baseAccessFeatures;

/** Added on Pro — shown after “Everything in One Run, plus:”. */
export const proAdditiveFeatures = [
  "Advanced Prompt Engineering",
  "Execution Orchestration",
  "10 Task Credits per month",
  "Top up extra Task Credits anytime",
] as const;

/** One-line Pro value vs One Run on pricing card. */
export const proValueLine =
  "30 One Runs = $150/mo — Pro is $47 for 10 runs.";

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

/** Full Pro feature set (One Run + paid). */
export const proPlanFeatures = [...baseAccessFeatures, ...proAdditiveFeatures] as const;

export const dailyPassPlan = {
  id: "daily" as const,
  name: "One Run",
  price: "$5",
  amount: 5,
  period: "/run",
  badge: "Try it first",
  tagline: "Try CoolPlugz — 1 full task run",
  durationNote: "One run MCP access",
  featureHeader: "Includes:",
  features: [
    ...baseAccessFeatures,
  ] as const,
  cta: "BUY ONE RUN",
};

/** @deprecated Use dailyPassPlan */
export const freePlan = dailyPassPlan;

export const proPlan = {
  id: "pro" as const,
  name: "Pro",
  badge: "Recommended",
  tagline: "For engineers shipping every day",
  featureHeader: "Everything in One Run, plus:",
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
