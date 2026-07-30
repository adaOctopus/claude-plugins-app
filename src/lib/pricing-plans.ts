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
    toggleLabel: "Zero hassle",
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

/** Core access features — shared by Starter and Pro. */
export const baseAccessFeatures = [
  "Syncs Jira + Slack + GitHub + Notion",
  "One task completed end-to-end",
  "Stay in Claude - CoolPlugz does the work",
] as const;

/** @deprecated Use baseAccessFeatures */
export const trialFeatures = baseAccessFeatures;

/** Added on Pro — shown after “Everything in Starter, plus:”. */
export const proAdditiveFeatures = [
  "10 Task Completions per month",
  "Full-stack Context Fetching",
  "Advanced Prompt Engineering",
  "Customizable Task Execution",
  "Top up Task Credits anytime",
] as const;

/** One-line Pro value vs Starter on pricing card. */
export const proValueLine =
  "";

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

/** Full Pro feature set (Starter + paid). */
export const proPlanFeatures = [...baseAccessFeatures, ...proAdditiveFeatures] as const;

export const dailyPassPlan = {
  id: "daily" as const,
  name: "Starter",
  price: "$5",
  amount: 5,
  period: "/task",
  badge: "Try it now",
  tagline: "Completes one real work task in minutes",
  durationNote: "",
  featureHeader: "Includes:",
  features: [
    ...baseAccessFeatures,
  ] as const,
  cta: "TRY STARTER",
};

/** @deprecated Use dailyPassPlan */
export const freePlan = dailyPassPlan;

export const proPlan = {
  id: "pro" as const,
  name: "Pro",
  badge: "Recommended",
  tagline: "Stay on top of your work effortlessly",
  featureHeader: "Includes:",
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
