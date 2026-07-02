export type BillingPeriod = "monthly" | "annual";
export type PaidPlan = BillingPeriod;

export const billingOptions = {
  monthly: {
    price: "€19",
    period: "/month",
    toggleLabel: "",
    badge: "Save >10 hrs/week",
  },
  annual: {
    price: "€149",
    period: "/year",
    toggleLabel: "Save ~35%",
    badge: "Recommended",
  },
} as const;

export const freePlan = {
  id: "free" as const,
  name: "Free",
  price: "€0",
  period: "",
  badge: "1 day only",
  description: "",
  features: [
    "Jira OR Slack — choose one integration",
    "Dashboard inside Claude ✓",
    "Full 24-hour access, then upgrade",
    "No GitHub — not included on free",
    "No coding tasks — context preview only",
  ],
  cta: "START FOR FREE",
};

export const proPlan = {
  id: "pro" as const,
  name: "Pro",
  description: "Context Engineer Autopilot plugin for engineers with in-Claude dashboard.",
  features: [
    "Up to 3 Premium plugins",
    "Scans Jira + Slack + GitHub + Notion",
    "Automated advanced Prompt Engineering",
    "Claude Code or Cursor CLI executing tasks",
    "In-Claude dashboard via MCP",
    "Slack messages handled hourly",
  ],
  cta: "GET PRO",
};
