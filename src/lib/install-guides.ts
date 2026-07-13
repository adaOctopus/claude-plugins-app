/** CoolPlugz MCP setup — web (Connectors) vs Desktop (JSON config). */

export type CoolplugzCommand = {
  command: string;
  description: string;
};

export const CLAUDE_WEB_CONNECTOR_IMAGE = "/guides/claude-web-connector.png";
export const CLAUDE_DESKTOP_EDIT_CONFIG_IMAGE = "/guides/claude-desktop-edit-config.png";

export const COOLPLUGZ_GETTING_STARTED = {
  title: "CoolPlugz — Getting Started",
  setupHeadline: "One step process - pick your Claude app ✨",
  setupSubline: "",
  web: {
    emoji: "🌐",
    title: "claude.ai (browser)",
    badge: "Easiest",
    steps: [
      "Settings → Connectors → Add → Custom connector",
      'Name it "coolplugz"',
      "Paste your URL above → Add",
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
    'Type "dashboard" in Claude. CoolPlugz shows four Connect buttons — Jira, GitHub, Notion, Slack. Click each one, authorize, close the tab. Done.',
  usageTitle: "Start using it ❤️",
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
