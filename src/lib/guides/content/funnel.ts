import type { Guide } from "@/lib/guides/types";
import type { ComparePage } from "@/lib/guides/types";

const ctaParagraph =
  "coolplugz is a Claude plugin (MCP) that gathers context from Jira, Slack, GitHub, and Notion, runs CRISPE-engineered prompts automatically, ships merge-ready code with CI checked, and drafts Slack replies — you only Approve & submit or Reject & redo.";

export const funnelGuides: Guide[] = [
  {
    slug: "best-claude-plugins-for-developers",
    title: "Best Claude Plugins, Skills & Connectors for Developers (2026)",
    metaTitle: "Best Claude Plugins, Skills & Connectors",
    metaDescription:
      "Google search guide — best Claude plugins, skills, MCP connectors, and models for developers who want production automation, not another tutorial.",
    keywords: [
      "best claude plugins",
      "best claude skills",
      "best claude connectors",
      "best claude MCP",
      "claude plugin for developers",
      "claude MCP server",
    ],
    category: "guide",
    directAnswer:
      "When you Google 'best Claude plugins' or 'best Claude skills,' you are shopping — not learning. YouTube is full of Claude tutorials and hacks; Google results skew toward skills, plugins, connectors, and models. For client work, pick stack-connected MCP tools that pull real Jira/Slack/GitHub context — not generic chat that hallucinates without it.",
    relatedSlugs: [
      "claude-plugin-mcp-explained",
      "claude-code-after-tutorial",
      "claude-plugin-for-contractors",
      "make-money-with-claude-as-a-developer",
      "developer-freedom-with-claude",
      "multiple-clients-parallel-claude",
    ],
    sections: [
      {
        id: "youtube-vs-google",
        title: "YouTube Claude vs Google Claude searches",
        blocks: [
          {
            type: "p",
            text: "Search 'Claude' or 'Claude Code' on YouTube and autocomplete fills in: best practices, tutorial, code tutorial, code agents, beginners, hacks. That is learning intent — watch for an hour, try prompts in a demo repo, maybe install Claude Code once.",
          },
          {
            type: "p",
            text: "On Google, the same journey shifts. 'Best Claude' autocompletes to skills, plugins, connectors, models. 'Claude code' skews toward agents, MCP, and production setup. 'How to make money with' autocompletes to Claude. That is shopping intent — you already decided Claude might be the lever and you want the right stack.",
          },
          {
            type: "p",
            text: "This page is for Google intent: what to actually install or connect once you are done watching videos.",
          },
        ],
      },
      {
        id: "skills-plugins-connectors",
        title: "Skills vs plugins vs MCP connectors — plain English",
        blocks: [
          {
            type: "ul",
            items: [
              "Skills — packaged prompt + tool patterns inside Claude; good for repeatable tasks",
              "Plugins / connectors — OAuth links to external apps (GitHub, Slack, Jira)",
              "MCP servers — the open standard behind many connectors; HTTP URL you paste into Claude",
              "Models — Sonnet vs Opus; matters less than whether context is real",
            ],
          },
          {
            type: "p",
            text: "For client delivery, connectors and MCP beat skills alone — because skills without live ticket/PR/Slack data are generic and prone to confident wrong answers.",
          },
        ],
      },
      {
        id: "criteria",
        title: "How to evaluate (avoid generic hallucination)",
        blocks: [
          {
            type: "ul",
            items: [
              "Stack fit — Jira, GitHub, Slack, Notion connected via OAuth, not copy-paste",
              "Grounded context — pulls live ticket, PR, CI, thread data before generating",
              "Approve/reject — you verify output; tool does not silently ship garbage",
              "CI verification — code checked against real pipeline, not imagined green checks",
              "Multi-client — separate workspaces if you bill more than one client",
            ],
          },
        ],
      },
      {
        id: "list",
        title: "Plugins worth knowing",
        blocks: [
          {
            type: "h3",
            text: "coolplugz Context Engineer",
          },
          {
            type: "p",
            text: "Purpose-built for developers who want to work less on client glue: Jira + Slack + GitHub + Notion context fed into CRISPE prompts, merge-ready code with CI checked, Slack and standup drafts. Approve/reject inside Claude — grounded in your stack, not generic chat.",
          },
          {
            type: "h3",
            text: "Official / community MCP servers",
          },
          {
            type: "p",
            text: "GitHub, filesystem, and database MCP servers are useful building blocks. They connect data but typically require you to prompt and iterate manually — good for power users, heavier on AI fatigue at scale.",
          },
          {
            type: "h3",
            text: "IDE-native AI (Cursor, Copilot)",
          },
          {
            type: "p",
            text: "Strong inside the editor, weaker on Slack/Jira orchestration and cross-tool standups. Complementary to Claude plugins — not a replacement for communication-layer automation.",
          },
        ],
      },
      {
        id: "pick",
        title: "Which should you pick?",
        blocks: [
          {
            type: "p",
            text: "If you want to learn Claude, use YouTube. If you want to work less on client delivery with quality output, pick stack-connected MCP — coolplugz for Slack/tickets/CI orchestration, Cursor or Copilot for in-editor speed. They complement each other.",
          },
        ],
      },
    ],
    productPitch: {
      title: "Try coolplugz",
      paragraphs: [
        ctaParagraph,
        "Start with a free 1-day trial — full Pro access, no credit card.",
      ],
    },
  },
  {
    slug: "claude-code-after-tutorial",
    title: "Claude Code Best Practices — After the YouTube Tutorial",
    metaTitle: "Claude Code Best Practices & Agents (Post-Tutorial)",
    metaDescription:
      "YouTube shows Claude tutorials, code tutorials, and code agents. This guide is for the next step — production best practices, MCP setup, and stack-connected automation after you finish watching.",
    keywords: [
      "claude best practices",
      "claude code best practices",
      "claude code tutorial",
      "claude code agents",
      "claude tutorial for developers",
      "claude code production",
      "claude MCP setup",
    ],
    category: "guide",
    directAnswer:
      "YouTube Claude searches skew toward tutorials and 'code agents' demos — learning intent. Production best practices mean connecting Claude to real Jira, Slack, GitHub, and Notion via MCP, scoping agents to grounded context, and approving output before it ships — not running open-ended agent loops on client repos.",
    relatedSlugs: [
      "best-claude-plugins-for-developers",
      "claude-plugin-mcp-explained",
      "make-money-with-claude-as-a-developer",
      "ci-failure-debugging-ai",
      "developer-freedom-with-claude",
    ],
    sections: [
      {
        id: "youtube-autocomplete",
        title: "What YouTube autocomplete tells you",
        blocks: [
          {
            type: "p",
            text: "Type 'Claude' or 'Claude Code' on YouTube and suggestions cluster around: best practices, tutorial, code tutorial, code agents, beginners, tips. That is the learning funnel — long videos, walkthrough repos, agent demos that look magical in isolation.",
          },
          {
            type: "p",
            text: "Those searches rarely convert directly to a paid tool. They create graduates: developers who know Claude exists, tried Claude Code once, and now need a production setup that does not hallucinate ticket numbers or ship CI-breaking patches.",
          },
          {
            type: "p",
            text: "coolplugz targets the search after the tutorial — Google queries like best Claude plugins, Claude MCP, Claude automation, and make money with Claude.",
          },
        ],
      },
      {
        id: "best-practices",
        title: "Claude Code best practices (client work)",
        blocks: [
          {
            type: "ul",
            items: [
              "Ground before generate — pull live Jira ticket, PR diff, CI log, Slack thread; never prompt from memory",
              "One MCP URL per client or workspace — isolate tokens and context profiles on Premium",
              "Approve/reject gates — treat agent output as a draft until you verify diffs and CI",
              "Named commands — '@ Run', 'Show my dashboard' beat vague 'fix everything' agent spirals",
              "OAuth over pasted secrets — scoped GitHub/Slack/Jira access beats API keys in chat",
              "Time-box agents — batch standup drafts and CI triage; do not leave autonomous loops on production repos",
            ],
          },
        ],
      },
      {
        id: "agents-vs-mcp",
        title: "Claude Code agents vs MCP plugins",
        blocks: [
          {
            type: "p",
            text: "YouTube 'Claude Code agents' videos usually show an agent editing files and running terminal commands inside a sandbox repo. That is powerful for personal projects and spikes.",
          },
          {
            type: "p",
            text: "Client retainers add Slack, Jira, multiple repos, and CI pipelines agents cannot see unless you connect them. MCP plugins (HTTP URL in Claude Connectors) expose those systems as tools — tickets, PRs, threads, dashboards — so Claude acts on real state, not guesses.",
          },
          {
            type: "p",
            text: "Best setup for many contractors: Claude Code or Cursor for in-editor edits, plus an MCP plugin like coolplugz for cross-tool orchestration — standups, CI fixes, Slack drafts — with stack context already gathered.",
          },
        ],
      },
      {
        id: "after-tutorial",
        title: "After the tutorial — a 15-minute checklist",
        blocks: [
          {
            type: "ul",
            items: [
              "Finish one YouTube Claude Code tutorial with a throwaway repo — learn the UI, not your client stack",
              "Pick one painful workflow: daily standup, CI failure triage, or Slack catch-up",
              "Connect MCP to that workflow's tools (GitHub + Slack minimum)",
              "Run one real task with approve/reject — compare output quality to a raw agent session",
              "If it saves 30+ minutes, read best Claude plugins and trial stack-connected automation",
            ],
          },
        ],
      },
    ],
    productPitch: {
      title: "Skip the agent spiral on client work",
      paragraphs: [
        "coolplugz is the post-tutorial MCP setup: Jira, Slack, GitHub, and Notion context inside Claude, CRISPE prompts, merge-ready code with CI checked, Slack drafts — you Approve & submit or Reject & redo.",
        ctaParagraph,
      ],
    },
  },
  {
    slug: "claude-plugin-for-contractors",
    title: "Claude Plugin for Contractors - Multiple Clients, One Workflow",
    metaTitle: "Claude Plugin for Contractors & Freelancers",
    metaDescription:
      "How freelance developers use coolplugz Premium to manage multiple client Slack, Jira, and GitHub contexts without constant switching.",
    keywords: [
      "freelance developer multiple clients tool",
      "contractor developer workflow",
      "claude plugin contractors",
    ],
    category: "persona",
    directAnswer:
      "Contractors juggling multiple clients face multiplied context switching — separate Slack workspaces, Jira boards, and repos. A Claude plugin with per-client context profiles and separate integrations reduces the mental tax of being five engineers at once.",
    relatedSlugs: [
      "context-switching-remote-engineering",
      "slack-anxiety-remote-developers",
      "work-less-client-retainers-developer",
      "developer-freedom-with-claude",
    ],
    pillarSlug: "context-switching-remote-engineering",
    sections: [
      {
        id: "pain",
        title: "The contractor context problem",
        blocks: [
          {
            type: "p",
            text: "Each client adds a full stack: channels, tickets, PR conventions, standup time, tone. Wrong context in a message or commit is expensive. You spend billable hours on coordination, not delivery.",
          },
          {
            type: "ul",
            items: [
              "Morning: figure out which client is on fire",
              "Midday: standup for client A while client B's CI fails",
              "Afternoon: reconstruct deliverables for three git histories",
              "Evening: Slack guilt from the workspace you neglected",
            ],
          },
        ],
      },
      {
        id: "diy",
        title: "What contractors do manually today",
        blocks: [
          {
            type: "ul",
            items: [
              "Separate browser profiles per client",
              "Client-specific note docs with branch + ticket conventions",
              "Calendar blocks labeled by client code name",
              "Strict Slack schedule per workspace",
            ],
          },
        ],
      },
      {
        id: "premium",
        title: "What Premium adds",
        blocks: [
          {
            type: "p",
            text: "coolplugz Premium is built for contractors: multiple client workspaces, separate Slack + Jira connections, isolated context profiles per client, and priority sync so runs do not bleed context across accounts.",
          },
        ],
      },
    ],
    productPitch: {
      title: "coolplugz Premium for contractors",
      paragraphs: [
        ctaParagraph,
        "Premium includes everything in Pro plus multiple workspaces — designed for engineers who bill across clients, not one employer.",
      ],
    },
  },
];

export const comparePages: ComparePage[] = [
  {
    slug: "coolplugz-vs-cursor",
    title: "coolplugz vs Cursor — Honest Comparison for Developers",
    metaTitle: "coolplugz vs Cursor",
    metaDescription:
      "coolplugz vs Cursor — different layers. Cursor is IDE-native AI; coolplugz is context + Slack + CI orchestration inside Claude.",
    competitor: "Cursor",
    directAnswer:
      "Cursor is an AI-native IDE focused on code completion and in-editor agents. coolplugz is a Claude MCP plugin focused on gathering Jira/Slack/GitHub/Notion context, engineering prompts, shipping merge-ready PRs, and drafting Slack communications. They solve different parts of the workflow and can complement each other.",
    relatedSlugs: [
      "best-claude-plugins-for-developers",
      "claude-plugin-mcp-explained",
      "ci-failure-debugging-ai",
    ],
    sections: [
      {
        id: "cursor",
        title: "What Cursor is good at",
        blocks: [
          {
            type: "ul",
            items: [
              "Inline code completion and refactors in the editor",
              "Codebase-aware chat tied to your local project",
              "Fast iteration while you type",
              "Developers who live in the IDE all day",
            ],
          },
        ],
      },
      {
        id: "coolplugz",
        title: "What coolplugz is good at",
        blocks: [
          {
            type: "ul",
            items: [
              "Cross-tool context — Jira tickets, Slack threads, Notion docs, GitHub CI",
              "Automatic CRISPE prompt generation and background execution",
              "Slack reply and standup drafts with approve/reject",
              "Remote engineers drowning in async communication + CI loops",
              "Working from Claude web or mobile with @ keywords",
            ],
          },
        ],
      },
      {
        id: "overlap",
        title: "Where they overlap",
        blocks: [
          {
            type: "p",
            text: "Both can help ship code faster with AI. Cursor optimizes the typing surface. coolplugz optimizes everything before and after typing — context, communication, CI verification — inside Claude.",
          },
        ],
      },
      {
        id: "choose",
        title: "Which to choose",
        blocks: [
          {
            type: "ul",
            items: [
              "Choose Cursor if IDE speed is your main bottleneck",
              "Choose coolplugz if Slack, tickets, CI paste loops, and standup prep drain you",
              "Use both if you want in-editor speed plus cross-stack orchestration in Claude",
            ],
          },
        ],
      },
    ],
    productPitch: {
      title: "Try coolplugz alongside your IDE",
      paragraphs: [ctaParagraph],
    },
  },
  {
    slug: "coolplugz-vs-github-copilot",
    title: "coolplugz vs GitHub Copilot — What Each Actually Does",
    metaTitle: "coolplugz vs GitHub Copilot",
    metaDescription:
      "coolplugz vs GitHub Copilot — Copilot assists in the editor; coolplugz orchestrates Jira, Slack, CI, and prompts inside Claude.",
    competitor: "GitHub Copilot",
    directAnswer:
      "GitHub Copilot is an AI pair programmer inside your editor and GitHub.com. coolplugz is a Claude plugin that automates the full remote engineering loop — context from Jira and Slack, prompt engineering, merge-ready delivery, CI awareness, and communication drafts. Not the same category.",
    relatedSlugs: [
      "best-claude-plugins-for-developers",
      "ci-failure-debugging-ai",
      "slack-anxiety-remote-developers",
    ],
    sections: [
      {
        id: "copilot",
        title: "What GitHub Copilot is good at",
        blocks: [
          {
            type: "ul",
            items: [
              "Autocomplete and inline suggestions",
              "Copilot Chat in IDE and github.com",
              "PR summary assistance on GitHub",
              "Teams already standardized on GitHub + VS Code",
            ],
          },
        ],
      },
      {
        id: "coolplugz",
        title: "What coolplugz is good at",
        blocks: [
          {
            type: "ul",
            items: [
              "Unified context across Jira, Slack, Notion — not just the repo",
              "Background agent runs with approve/reject, not just suggestions",
              "Slack-specific workflows — replies, standups, thread triage",
              "Breaking LLM spirals by engineering prompts from live ticket + CI data",
            ],
          },
        ],
      },
      {
        id: "choose",
        title: "Which to choose",
        blocks: [
          {
            type: "p",
            text: "Copilot is a coding assistant. coolplugz is a workflow orchestration layer for remote engineers who lose hours to tool switching and communication overhead. Many teams will use Copilot in the IDE and coolplugz in Claude for everything around the commit.",
          },
        ],
      },
    ],
    productPitch: {
      title: "Add coolplugz to your stack",
      paragraphs: [ctaParagraph],
    },
  },
];
