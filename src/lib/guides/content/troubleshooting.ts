import type { Guide } from "@/lib/guides/types";

const ctaParagraph =
  "coolplugz is a Claude plugin (MCP) that gathers context from Jira, Slack, GitHub, and Notion, runs CRISPE-engineered prompts automatically, ships merge-ready code with CI checked, and drafts Slack replies — you only Approve & submit or Reject & redo.";

/** Enterprise & integration troubleshooting — CI loops, Slack API blocks, GitHub SSO/PAT. */
export const troubleshootingGuides: Guide[] = [
  {
    slug: "coolplugz-integration-troubleshooting",
    title: "CoolPlugz Integration Troubleshooting — CI Loops, Slack Blocks & GitHub SSO",
    metaTitle: "CoolPlugz Troubleshooting — CI, Slack API & GitHub PAT",
    metaDescription:
      "Fix CoolPlugz integration blocks at work: GitHub ↔ CI ↔ LLM mental drain, Slack API blocked by admins, GitHub SSO repos, and personal access tokens (PAT).",
    keywords: [
      "CI failure debugging AI",
      "github ci check loop",
      "slack api blocked enterprise",
      "github sso personal access token",
      "coolplugz troubleshooting",
      "claude cowork slack",
    ],
    category: "guide",
    faqQuestion:
      "Why does the GitHub ↔ CI ↔ LLM back-and-forth destroy mental energy for developers?",
    directAnswer:
      "Every CI check forces a context switch: leave the LLM, open GitHub Actions, read logs, copy errors back into chat, wait for a fix, push, refresh CI, repeat. Each hop reloads a different mental model — chat reasoning vs pipeline output vs diff review — and the loop steals the deep focus coding actually needs. That is why the back-and-forth feels more exhausting than the bug itself.",
    relatedSlugs: [
      "ci-failure-debugging-ai",
      "llm-spirals-coding",
      "slack-anxiety-remote-developers",
      "claude-plugin-mcp-explained",
      "ai-fatigue-developers",
    ],
    pillarSlug: "ai-fatigue-for-developers",
    sections: [
      {
        id: "ci-github-llm-loop",
        title: "Why the GitHub ↔ CI ↔ LLM loop destroys mental energy",
        blocks: [
          {
            type: "p",
            text: "Manual CI debugging with AI is not one task — it is five tasks wearing a trench coat. You prompt in Claude. You push to GitHub. You wait for Actions. You read a wall of logs. You copy the failure back into chat. The model proposes another patch. You context-switch again. Research on knowledge work calls this switch cost: every hop adds recovery time, and incomplete state from the previous tool leaks into the next.",
          },
          {
            type: "p",
            text: "The loop is especially brutal because CI feedback is slow and ambiguous. A truncated log line sends the model down the wrong path. You lose confidence, paste more, and spend more energy steering the LLM than fixing the code. That is AI fatigue in its purest form — and it compounds when Slack pings you for status while the PR is still red.",
          },
          {
            type: "h3",
            text: "What the loop actually costs you",
          },
          {
            type: "ul",
            items: [
              "Three tools, three mental models: chat reasoning, pipeline logs, and git diffs",
              "Waiting on CI between every iteration — attention fragments instead of staying in flow",
              "Copy-paste tax: errors, env details, and ticket context rarely transfer cleanly",
              "No single source of truth — you become the integration layer between GitHub and the LLM",
              "Afternoon gone on one lint failure while standup and Slack pile up",
            ],
          },
          {
            type: "p",
            text: "For a deeper breakdown of the spiral mechanics, read our guides on LLM spirals and CI failure debugging with AI — linked below. coolplugz breaks the loop by feeding repo context, PR history, ticket requirements, and CI output into engineered prompts, then running the cycle until output is ready for Approve & submit.",
          },
        ],
      },
      {
        id: "slack-api-blocked",
        title: "Slack API blocked by company admins — use Cowork + Claude in Chrome",
        blocks: [
          {
            type: "p",
            text: "Large companies often block third-party Slack apps or restrict the Slack API for security. That is common — not a CoolPlugz bug. When OAuth to Slack fails or your admin will not approve the integration, you still have a path: run Claude Cowork alongside CoolPlugz with the Claude in Chrome extension.",
          },
          {
            type: "h3",
            text: "Cowork + browser Slack workflow",
          },
          {
            type: "ul",
            items: [
              "Switch to Claude Cowork (Anthropic's agent mode for browser-based work)",
              "Install and enable the Claude in Chrome extension",
              "Keep CoolPlugz connected in parallel — same MCP URL, same dashboard commands",
              "Sign in to Slack in your browser tab when prompted so Claude can read the DOM",
              "CoolPlugz still orchestrates context; Cowork + Chrome supplies Slack thread data when the API is blocked",
              "Use Show my dashboard and Refresh Slack as usual — approve drafts before anything posts",
            ],
          },
          {
            type: "p",
            text: "This pattern respects enterprise Slack lockdown: you authenticate in the browser you control, and CoolPlugz works from visible thread content instead of a blocked API token. If Slack anxiety and reply drafting are your main pain, also see our Slack anxiety guide for the broader workflow.",
          },
        ],
      },
      {
        id: "github-sso-pat",
        title: "GitHub SSO, authorization gates & personal access tokens (PAT)",
        blocks: [
          {
            type: "p",
            text: "Some org repos sit behind GitHub SSO or extra authorization gates. Standard OAuth may connect your account but still leave private org repos unreadable until SSO is authorized — or until you supply a scoped personal access token (PAT).",
          },
          {
            type: "h3",
            text: "When you need a PAT",
          },
          {
            type: "ul",
            items: [
              "Org requires SSO authorization — complete SSO in GitHub Settings → Applications first",
              "Repo access fails after OAuth — create a fine-grained PAT with read access to the repos CoolPlugz needs",
              "Enterprise policy blocks OAuth apps — PAT with minimal scopes is often the approved path",
              "CI logs or PR diffs stay empty — usually missing repo scope on the token you connected",
            ],
          },
          {
            type: "h3",
            text: "How to connect your PAT in CoolPlugz",
          },
          {
            type: "ul",
            items: [
              'In Claude, type "Show my dashboard" to open the CoolPlugz dashboard',
              "Click Connect on GitHub — if SSO blocked you, authorize SSO in GitHub first",
              "When the connect flow asks for a token, paste your PAT in the field we provide",
              "Use fine-grained PATs scoped to only the repositories you need — not classic tokens with full account access",
              "Prefer read + status/check scopes for CI debugging; add write only if CoolPlugz must push commits for your workflow",
              "Rotate PATs on your company schedule; reconnect from the dashboard when tokens expire",
            ],
          },
          {
            type: "p",
            text: "Never paste PATs into public chats or screenshots. Connect only through the CoolPlugz dashboard link inside Claude — the same flow documented in our Claude plugin / MCP setup guide.",
          },
        ],
      },
      {
        id: "quick-links",
        title: "Related guides",
        blocks: [
          {
            type: "ul",
            items: [
              "CI failure debugging with AI — shorten the gather-paste-fix-push-wait cycle",
              "LLM spirals in coding — why copy-paste loops happen and how to break them",
              "AI fatigue for developers — the full picture when you are the glue between tools",
              "Claude plugin / MCP explained — how CoolPlugz connects Jira, Slack, GitHub, and Notion",
              "Slack anxiety for remote developers — when async comms drain you even after integrations work",
            ],
          },
        ],
      },
    ],
    productPitch: {
      title: "What coolplugz automates",
      paragraphs: [
        "coolplugz removes you as the router between GitHub CI, Slack, Jira, and the LLM. Context is gathered automatically, prompts are engineered and executed, and finished output lands in Claude for Approve & submit — including Cowork-friendly Slack workflows and GitHub connections that support PAT fallback.",
        ctaParagraph,
      ],
    },
  },
];

export const TROUBLESHOOTING_GUIDE_SLUG = "coolplugz-integration-troubleshooting";
