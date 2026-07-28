/** SEO copy for the homepage make-money referral section, JSON-LD, and guide. */

export const MAKE_MONEY_SECTION_ID = "make-money";

export const makeMoneyHeadline =
  "Make money with Claude and AI — generate passive income referring CoolPlugz";

export const makeMoneySubcopy =
  "Developers earn 15% revenue share when friends subscribe with your Claude referral link. Friends get 15% off. Share once — earn on renewals.";

export const makeMoneyDirectAnswer =
  "If you searched how to make money with Claude or generate passive income with AI, this is the realistic path: share CoolPlugz with developer friends, give them 15% off, and earn 15% of what they pay — including renewals. No courses. No guru templates. Just a referral link tied to your email.";

export const makeMoneyBodyParagraphs = [
  "Make money with AI as a developer by referring a tool your friends already need — Claude connected to Jira, Slack, GitHub, and Notion. Your unique promo code applies automatically at checkout.",
  "Generate passive income with Claude when your referrals stay subscribed. CoolPlugz tracks every initial payment and renewal, so your share compounds while you ship your own projects.",
  "This Claude referral program is built for engineers who know other engineers — share in Slack, Discord, or DMs. One email, one code, one link.",
];

export const makeMoneySteps = [
  {
    title: "Enter your email",
    text: "We generate a unique make-money-with-Claude promo code tied to your address for payouts.",
  },
  {
    title: "Share your link",
    text: "Send your AI referral link to developer friends — they get 15% off CoolPlugz Pro.",
  },
  {
    title: "Earn passive income",
    text: "Collect 15% revenue share on every payment and renewal while they stay subscribed.",
  },
];

export type MakeMoneyFaqItem = { question: string; answer: string };

export const makeMoneyFaqItems: MakeMoneyFaqItem[] = [
  {
    question: "Can developers make money with Claude by referring CoolPlugz?",
    answer:
      "Yes. Enter your email on this page to get a unique Claude referral link. When developer friends subscribe with your code, you earn 15% of what they pay — on the first checkout and on renewals.",
  },
  {
    question: "How do I generate passive income with AI as a developer?",
    answer:
      "Share CoolPlugz with engineers who use Claude for client work. Your link gives them 15% off and ties their subscription to your email. You earn recurring passive income with AI tooling instead of one-off affiliate clicks.",
  },
  {
    question: "What is the CoolPlugz Claude referral program?",
    answer:
      "It is a developer referral program for CoolPlugz — a Claude MCP plugin for context engineering, merge-ready code, and Slack automation. You get a promo code like COOLPLUGZTASOS4821 and a shareable URL.",
  },
  {
    question: "How much can I earn sharing my make-money-with-AI referral link?",
    answer:
      "You earn 15% of net subscription revenue from each referral — initial payment plus renewals while they stay subscribed. Payouts are processed manually to your email each month.",
  },
  {
    question: "Do friends get a discount when I share my Claude promo code?",
    answer:
      "Yes. Friends get 15% off CoolPlugz Pro when they checkout with your code. The discount applies automatically from your referral link.",
  },
  {
    question: "Is this passive income with Claude on renewals?",
    answer:
      "Yes. Renewals count. As long as your referral stays subscribed, you keep earning 15% on each invoice — true passive income with Claude tooling, not a single commission.",
  },
];

export const makeMoneyHowToSchema = {
  name: "How to generate passive income with Claude by referring CoolPlugz",
  description:
    "Make money with Claude and AI by sharing your CoolPlugz referral link with developer friends.",
  steps: makeMoneySteps.map((step) => ({
    name: step.title,
    text: step.text,
  })),
};

export const passiveIncomeGuideKeywords = [
  "make money with AI",
  "make money with Claude",
  "how to make money with Claude",
  "generate passive income with AI",
  "generate passive income with Claude",
  "passive income with AI",
  "passive income with Claude",
  "make money with AI as a developer",
  "Claude referral program",
  "AI referral program developers",
  "developer passive income AI",
  "CoolPlugz referral program",
];
