/** CoolPlugz MCP setup — web (Connectors) vs Desktop (JSON config). */

export type CoolplugzCommand = {
  command: string;
  description: string;
};

export const CLAUDE_WEB_CONNECTOR_IMAGE = "/guides/claude-web-connector.png";
export const CLAUDE_DESKTOP_EDIT_CONFIG_IMAGE = "/guides/claude-desktop-edit-config.png";

export const COOLPLUGZ_GETTING_STARTED = {
  title: "CoolPlugz — Getting Started",
  setupHeadline: "One step process - from either Claude web or Desktop ✨",
  setupSubline: "",
  web: {
    emoji: "🌐",
    title: "claude.ai (browser)",
    badge: "Easiest",
    steps: [
      "Settings → Connectors → Add → Custom connector",
      'Name it "coolplugz"',
      "Paste your URL from above → Add",
    ],
  },
  desktop: {
    emoji: "🖥️",
    title: "Claude Desktop",
    steps: [
      "Settings → Developer → Edit Config",
      "Choose claude_desktop_config.json — create the file if it doesn't exist",
      "Paste the JSON you see below the image with your URL → Save",
      "Quit Claude Desktop fully, then reopen",
    ],
    macPath: "~/Library/Application Support/Claude/claude_desktop_config.json",
    windowsPath: "%APPDATA%\\Claude\\claude_desktop_config.json",
  },
  connectTitle: "Connect your tools 🔑",
  connectIntro:
    'Type "Show my dashboard" in Claude. CoolPlugz shows four Connect buttons — Jira, GitHub, Notion, Slack. Click each one, authorize, close the tab. Done.',
  usageTitle: "What to type inside Claude ❤️",
  usageIntro: "Plain English - no IDs, no config, just chat:",
  commands: [
    {
      command: "Show my dashboard",
      description:
        "Connects to Jira, GitHub, Notion, Slack once, then tasks, PRs, and Slack drafts",
    },
    {
      command: "Run",
      description:
        "syncs all tools and works your incomplete Jira tickets — PRs, CI fixes, Slack drafts",
    },
    {
      command: "What's blocking my tasks?",
      description: "re-analyzes stuck or failing tasks — what's wrong and what to do",
    },
    {
      command: "Show task PROJ-42",
      description: "deep dive on one ticket — status, PR, CI, context, history",
    },
    {
      command: "Reject PROJ-42 and redo it",
      description: "give feedback and re-execute with your corrections",
    },
    {
      command: "Refresh Slack",
      description: "pulls latest mentions and generates draft replies",
    },
    {
      command: "Refetch and rerun",
      description: "pulls latest context and reruns",
    },
  ] satisfies CoolplugzCommand[],
  usageFooter: "Works on web and desktop. Connect once, stays connected.",
};

export function buildDesktopMcpConfig(mcpUrl: string) {
  return JSON.stringify(
    {
      mcpServers: {
        coolplugz: {
          url: mcpUrl,
          transport: "http",
        },
      },
    },
    null,
    2
  );
}
