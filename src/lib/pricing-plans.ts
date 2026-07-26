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

/** Base trial scope — shortest list (Free card). */
export const trialFeatures = [
  "Scans Jira + Slack + GitHub + Notion",
  "6 AI Agents working in parallel",
  "In-Claude dashboard via MCP",
] as const;

/** Added on Pro — shown after “Everything in Free trial, plus:”. */
export const proAdditiveFeatures = [
  "Automated Prompt Engineering",
  "Slack messages handled hourly",
  "10 full task runs per month included",
  "Up to $2 server budget per run",
  "Top up extra runs anytime from your account",
] as const;

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

/** Full Pro feature set (trial + paid). */
export const proPlanFeatures = [...trialFeatures, ...proAdditiveFeatures] as const;

export const freePlan = {
  id: "free" as const,
  name: "Free 7-Day Trial",
  price: "$0",
  amount: 0,
  period: "",
  badge: "No card required",
  tagline: "Full Pro for 7 days — 3 runs included",
  durationNote: "After 7 days upgrade to Pro for 10 runs/month",
  featureHeader: "Includes:",
  features: trialFeatures,
  cta: "START FREE TRIAL",
  trialDays: 7,
};

export const proPlan = {
  id: "pro" as const,
  name: "Pro",
  badge: "Recommended",
  tagline: "For engineers shipping every day",
  featureHeader: "Everything in Free trial, plus:",
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
