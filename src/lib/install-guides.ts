/** CoolPlugz MCP setup — paste URL in Claude, connect tools, start using commands. */

export type CoolplugzCommand = {
  command: string;
  description: string;
};

export const COOLPLUGZ_GETTING_STARTED = {
  title: "CoolPlugz - Getting Started",
  setupTitle: "Setup",
  setupSteps: [
    "Open Claude (desktop, mobile, or claude.ai)",
    "Go to Settings → MCP Servers → Add",
    "Paste your CoolPlugz URL and save",
  ],
  connectTitle: "Start with a keyword🔑",
  connectIntro:
    'Type "dashboard" in Claude. CoolPlugz shows four Connect buttons, one for each service (Jira, GitHub, Notion, Slack). Click each one to authorize in your browser, and you are good to go.',
  usageTitle: "Start using it❤️",
  usageIntro: "Just type:",
  commands: [
    {
      command: "run",
      description:
        "picks up your Jira tasks, writes code, opens PRs, watches CI",
    },
    {
      command: "dashboard",
      description: "your task board, standup draft, and Slack mentions",
    },
    {
      command: "wtf",
      description: "investigates and fixes a failing CI check",
    },
    {
      command: "reject",
      description: "re-runs with your feedback",
    },
  ] satisfies CoolplugzCommand[],
  usageFooter: "Works on desktop and mobile. Connect once, stays connected.",
};
