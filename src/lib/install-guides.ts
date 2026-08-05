/** CoolPlugz MCP setup — web (Connectors) vs Desktop (JSON config). */

export type CoolplugzCommand = {
  command: string;
  description: string;
};

export const CLAUDE_WEB_CONNECTOR_IMAGE = "/guides/claude-web-connector.png";
export const CLAUDE_DESKTOP_EDIT_CONFIG_IMAGE = "/guides/claude-desktop-edit-config.png";

export const COOLPLUGZ_GETTING_STARTED = {
  title: "CoolPlugz — Getting Started",
  setupHeadline: "",
  setupSubline: "",
  companyAccountNote: {
    title: "Quick tip ✨",
    body:
      "If you use Claude with your company email, it might restrict adding custom MCPs. Do not worry, if that happens we have you covered😌 Sign in to Claude with your personal email and connect Coolplugz ✨ Then connect Jira, GitHub, and Slack with your work email instead. That's it.",
  },
  web: {
    emoji: "🌐",
    title: "From claude.ai (browser)",
    badge: "Easiest",
    steps: [
      "Settings → Connectors → Add → Custom connector",
      'Name it "coolplugz"',
      "Paste your URL from above → Add",
    ],
  },
  desktop: {
    emoji: "🖥️",
    title: "From Claude Desktop",
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
    "On first use, CoolPlugz will walk you through connecting Jira, GitHub, Notion, and Slack inside Claude Code when needed.",
  usageTitle: "What to do inside Claude after setup⚡",
  usageIntro: "Plain English - one phrase to get started:",
  commands: [
    {
      command: "Hi Coolplugz, complete my tasks for the day",
      description:
        "Syncs your tools and guides Claude Code through your open work - no IDs, no config.",
    },
  ] satisfies CoolplugzCommand[],
  usageFooter: "Connect once when prompted; CoolPlugz orchestrates from there.",
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
