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
    badge: "Very Easy",
    steps: [
      "Settings → Connectors → Add → Custom connector",
      'Name it "coolplugz"',
      "Paste your URL from above → Add",
    ],
  },
  claudeCodeCli: {
    emoji: "⌨️",
    title: "Claude Code CLI",
    badge: "Easier · Most used",
    steps: [
      "Open a terminal in any project folder",
      "Paste and run the command below (includes your unique key)",
      "Launch Claude Code — CoolPlugz MCP is connected",
    ],
  },
  desktopConnectors: {
    emoji: "🖥️",
    title: "From Claude Desktop (Connectors)",
    badge: "Very Easy",
    steps: [
      "Open Claude Desktop → Settings → Connectors → Add → Custom connector",
      'Name it "coolplugz"',
      "Paste your URL from above → Add",
    ],
  },
  desktopLegacy: {
    emoji: "🖥️",
    title: "Claude Desktop - config file (OLD)",
    steps: [
      "Settings → Developer → Edit Config",
      "Choose claude_desktop_config.json — create the file if it doesn't exist",
      "Paste the JSON you see below the image with your URL → Save",
      "Quit Claude Desktop fully, then reopen",
    ],
    macPath: "~/Library/Application Support/Claude/claude_desktop_config.json",
    windowsPath: "%APPDATA%\\Claude\\claude_desktop_config.json",
  },
  /** @deprecated Use desktopLegacy — kept for any stale imports. */
  desktop: {
    emoji: "🖥️",
    title: "Claude Desktop - config file (OLD)",
    steps: [
      "Settings → Developer → Edit Config",
      "Choose claude_desktop_config.json — create the file if it doesn't exist",
      "Paste the JSON you see below the image with your URL → Save",
      "Quit Claude Desktop fully, then reopen",
    ],
    macPath: "~/Library/Application Support/Claude/claude_desktop_config.json",
    windowsPath: "%APPDATA%\\Claude\\claude_desktop_config.json",
  },
  quickClaudeCodeCli: {
    emoji: "⌨️",
    title: "Claude Code CLI",
    badge: "Easiest · Most used🔥",
    hint: "Run one command in your terminal - CoolPlugz connects with your unique key.",
  },
  quickWeb: {
    emoji: "🌐",
    title: "Claude.ai (browser)",
    badge: "Very easy",
    hint: "Settings → Connectors → Add → Custom connector → name it coolplugz → paste URL → Add",
  },
  quickDesktopConnectors: {
    emoji: "🖥️",
    title: "Claude Desktop",
    badge: "Very easy",
    hint: "Settings → Connectors → Add → Custom connector → name it coolplugz → paste URL → Add ",
  },
  quickDesktopLegacy: {
    emoji: "🖥️",
    title: "Claude Desktop (OLD guide - config file)",
    hint: "Settings → Developer → Edit Config → paste JSON below → Save → quit & reopen Claude",
  },
  quickDesktopConfigFile: {
    title: "Where is claude_desktop_config.json?",
    missingFile:
      "Can't find it? Click Edit Config in Claude Desktop - it opens the file or creates it for you. You can also create an empty file named claude_desktop_config.json with just {} and paste the JSON you see below.",
  },
  detailedGuideTitle: "Detailed setup guide",
  detailedGuideSubline:
    "Screenshots and step-by-step help if you're not sure how to add MCP connectors.",
  connectTitle: "Connect your tools 🔑",
  connectIntro:
    "On first use, CoolPlugz will walk you through connecting Jira, GitHub, Notion, and Slack inside Claude Code when needed.",
  usageTitle: "Ready to get started⚡",
  usageIntro: "Once setup is done, you connect to Jira, Github etc. and you can start using the following message actions:",
  commands: [
    {
      command: "Hi Coolplugz, complete my tasks for the day",
      description:
        "Syncs your tools and guides Claude Code through your open work - no IDs, no config.",
    },
    {
      command:  "⚡ Run all" ,
      description:
        "Executes every open task in sequence - CoolPlugz handles orchestration, verification, and PR creation for each one.",
    },
    {
      command:  "🎯Run PROJ-123",
      description:
        " Picks a specific ticket and assembles a full implementation plan from Jira, GitHub, Notion, and Slack - Claude Code follows it step by step.",
    },
    {
      command: "🧠Add instruction: your_custom_instruction",
      description:
        " Saves a custom rule to CoolPlugz's orchestration layer, straight from chat. You can also add instructions via the web form linked in every response.",
    },
    {
      command:  "🔍 Check conflicts on PROJ-123" ,
      description:
        "Detects merge conflicts with the base branch and gives exact rebase commands to resolve them.",
    },
    {
      command:  "💬 Check comments on PROJ-123" ,
      description:
        " Pulls every unresolved PR review comment, shows who said what and where - then Claude Code fixes them all and pushes automatically.",
    },
  ] satisfies CoolplugzCommand[],
  usageFooter: "Enjoy your new workflow!😎",
};

export function buildClaudeCodeCliMcpCommand(mcpUrl: string) {
  return `claude mcp add coolplugz --transport http ${mcpUrl}`;
}

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
