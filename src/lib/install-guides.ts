export type InstallStep = {
  title: string;
  description: string;
};

const baseSteps: InstallStep[] = [
  {
    title: "Download the plugin bundle",
    description: "Use the download button below to get the .zip for this plugin.",
  },
  {
    title: "Open Claude Desktop settings",
    description:
      "Go to Settings → Developer → Edit Config to open claude_desktop_config.json.",
  },
  {
    title: "Add the plugin to your config",
    description:
      'Add the extracted plugin folder path to the "plugins" array in your config.',
  },
  {
    title: "Configure integrations",
    description:
      "Set Jira, Slack, GitHub, or Notion tokens in the plugin .env file as needed.",
  },
  {
    title: "Restart Claude Desktop",
    description: "Restart Claude to load the plugin and open the coolplugz dashboard.",
  },
];

const slugSteps: Record<string, InstallStep[]> = {
  "context-engineer": [
    {
      title: "Download Context Engineer",
      description: "Get the flagship bundle — full pipeline with in-Claude dashboard.",
    },
    ...baseSteps.slice(1),
    {
      title: "Run your first context gather",
      description:
        'Try "/context-gather" on an open Jira ticket to see full stack context assembled.',
    },
  ],
  "context-engineering": [
    {
      title: "Download Context Engineer",
      description: "Get the flagship bundle — full pipeline with in-Claude dashboard.",
    },
    ...baseSteps.slice(1),
    {
      title: "Run your first context gather",
      description:
        'Try "/context-gather" on an open Jira ticket to see full stack context assembled.',
    },
  ],
  "slack-fetch": [
    {
      title: "Download Slack Fetch",
      description: "Free add-on — pulls threads and drafts replies in your tone.",
    },
    ...baseSteps.slice(1, 4),
    {
      title: "Connect Slack",
      description: "Add your Slack bot token to the plugin .env and restart Claude.",
    },
  ],
  "notion-fetch": [
    {
      title: "Download Notion Fetch",
      description: "Free add-on — syncs specs and sprint docs into context.",
    },
    ...baseSteps.slice(1, 4),
    {
      title: "Connect Notion",
      description: "Add your Notion integration token to the plugin .env.",
    },
  ],
  "jira-fetch": [
    {
      title: "Download Jira Fetch",
      description: "Free add-on — attaches tickets and acceptance criteria automatically.",
    },
    ...baseSteps.slice(1, 4),
    {
      title: "Connect Jira",
      description: "Add your Jira API token and site URL to the plugin .env.",
    },
  ],
};

export function getInstallSteps(slug: string): InstallStep[] {
  return slugSteps[slug] ?? baseSteps;
}
