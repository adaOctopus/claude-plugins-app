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
  "context-prompts": [
    {
      title: "Download Context Prompt Builder",
      description:
        "Free plugin — links Jira, Slack & Notion and returns fully engineered CRISPE prompts.",
    },
    ...baseSteps.slice(1, 4),
    {
      title: "Connect Jira, Slack & Notion",
      description:
        "Add your integration tokens to the plugin .env. No GitHub or code execution is configured.",
    },
    {
      title: "Restart Claude Desktop",
      description: "Restart Claude to load the plugin.",
    },
    {
      title: "Run a prompt build",
      description:
        'Use "/build-prompt" on a ticket or thread — coolplugz returns the engineered prompt for you to copy.',
    },
  ],
};

export function getInstallSteps(slug: string): InstallStep[] {
  return slugSteps[slug] ?? baseSteps;
}
