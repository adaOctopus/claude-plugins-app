import type { Guide } from "@/lib/guides/types";
import { ORCHESTRATION_CTA } from "@/lib/product-positioning";

const ctaParagraph = ORCHESTRATION_CTA;

export const pillarGuides: Guide[] = [
  {
    slug: "ai-fatigue-for-developers",
    title: "AI Fatigue for Developers: Causes, Symptoms, and Fixes",
    metaTitle: "AI Fatigue for Developers — Causes and Fixes",
    metaDescription:
      "A complete guide to AI fatigue for remote engineers — Slack overload, CI loops, LLM spirals, prompt overhead, and systemic fixes.",
    keywords: ["AI fatigue", "AI fatigue remote engineers", "AI fatigue developers"],
    category: "pillar",
    directAnswer:
      "AI fatigue for developers is burnout from steering AI across disconnected tools — not from coding itself. It shows up as prompt exhaustion, CI copy-paste loops, Slack dread, and standup reconstruction. Fixing it requires reducing both context switching and LLM iteration tax.",
    relatedSlugs: [
      "ai-fatigue-developers",
      "llm-spirals-coding",
      "slack-anxiety-remote-developers",
      "ci-failure-debugging-ai",
      "automate-daily-standup-slack",
      "context-engineering-vs-gathering-context",
    ],
    sections: [
      {
        id: "define",
        title: "What AI fatigue actually is",
        blocks: [
          {
            type: "p",
            text: "AI fatigue is not 'using too much ChatGPT.' It is the accumulated cost of being the human router between Jira, Slack, GitHub, CI, docs, and an LLM — prompting, pasting, correcting, re-prompting, and switching tabs until the task ships or you give up.",
          },
          {
            type: "p",
            text: "Remote engineers hit it faster because async tools replace natural boundaries. There is no 'I will check Slack after standup' when Slack is how you exist on the team.",
          },
        ],
      },
      {
        id: "components",
        title: "The five components of engineering AI fatigue",
        blocks: [
          {
            type: "h3",
            text: "1. Slack thread overload",
          },
          {
            type: "p",
            text: "Reading long threads to find where you are needed, then drafting replies that match tone and history. See our guide on Slack anxiety for remote developers.",
          },
          {
            type: "h3",
            text: "2. CI ↔ LLM back-and-forth",
          },
          {
            type: "p",
            text: "Copy failure logs into chat, apply fix, push, wait for CI, paste again. This is the classic LLM spiral. See CI failure debugging with AI.",
          },
          {
            type: "h3",
            text: "3. Prompt assembly from tickets and docs",
          },
          {
            type: "p",
            text: "Every task starts with gathering context and writing a decent prompt. Context engineering vs gathering context explains why dumping text is not enough.",
          },
          {
            type: "h3",
            text: "4. Standup and status reconstruction",
          },
          {
            type: "p",
            text: "Remembering yesterday across git, Jira, and Slack for a five-minute call. Automate daily standup in Slack covers practical fixes.",
          },
          {
            type: "h3",
            text: "5. Tool switching as default state",
          },
          {
            type: "p",
            text: "Even with AI, you still integrate systems manually unless context is unified first. Context switching cost for developers quantifies the tax.",
          },
        ],
      },
      {
        id: "symptoms",
        title: "Symptoms you might recognize",
        blocks: [
          {
            type: "ul",
            items: [
              "Opening a new chat tab feels like a chore",
              "CI failures you 'will fix after standup' pile up",
              "Slack red badges create anxiety even when you are in flow",
              "You ship fewer PRs but feel more tired",
              "You abandon AI mid-task because iteration cost is too high",
            ],
          },
        ],
      },
      {
        id: "fixes",
        title: "Fixes that actually help",
        blocks: [
          {
            type: "ul",
            items: [
              "Batch communication and protect focus blocks",
              "Use structured context packets per task — ticket, branch, CI, decisions",
              "Cap LLM iterations; escalate to manual root-cause after two CI fails",
              "Automate standup drafts from git + tickets",
              "Prefer systems that gather context before you prompt, not after you are tired",
            ],
          },
        ],
      },
      {
        id: "systemic",
        title: "The systemic fix",
        blocks: [
          {
            type: "p",
            text: "Point fixes help one afternoon. AI fatigue is structural: tools were not built as one workflow. The fix is an integration layer that gathers context, engineers prompts, executes, and puts finished output in front of you — so you approve or reject instead of iterate.",
          },
        ],
      },
    ],
    productPitch: {
      title: "How coolplugz addresses AI fatigue",
      paragraphs: [
        ctaParagraph,
        "It targets all five components: Slack drafts, CI-aware code delivery, automatic context engineering, standup generation, and a single Claude session instead of six tabs.",
      ],
    },
  },
  {
    slug: "context-switching-remote-engineering",
    title: "Context Switching in Remote Engineering Teams",
    metaTitle: "Context Switching Remote Work — Engineering",
    metaDescription:
      "What context switching costs remote engineering teams — by tool (Slack, Jira, GitHub, CI) and how to fix it without willpower alone.",
    keywords: [
      "context switching remote work",
      "context switching cost developers",
      "context switching remote engineers",
    ],
    category: "pillar",
    directAnswer:
      "Context switching in remote engineering is the constant reload of mental state between Slack, Jira, GitHub, CI, and docs — made worse because async work has no hallway buffer. The cost is lost focus, more errors, and coordination exhaustion.",
    relatedSlugs: [
      "context-switching-developers",
      "slack-anxiety-remote-developers",
      "ci-failure-debugging-ai",
      "claude-plugin-mcp-explained",
      "automate-daily-standup-slack",
    ],
    sections: [
      {
        id: "cost",
        title: "What context switching costs you",
        blocks: [
          {
            type: "p",
            text: "Studies on knowledge work consistently show task switches add recovery time and error rates. For engineers, a 'quick Slack check' is not quick — it loads social context, technical decisions, and action items that compete with the function you were writing.",
          },
          {
            type: "p",
            text: "Remote work removes the physical cues that used to separate modes. Your desk is Slack, IDE, and Jira at once.",
          },
        ],
      },
      {
        id: "by-tool",
        title: "Context switching by tool",
        blocks: [
          {
            type: "h3",
            text: "Slack",
          },
          {
            type: "p",
            text: "Threads, DMs, mentions — each a different social and technical context. Guide: reduce Slack anxiety.",
          },
          {
            type: "h3",
            text: "Jira / Notion",
          },
          {
            type: "p",
            text: "Requirements, acceptance criteria, comments from PMs — must be held in working memory while coding. Tied to prompt assembly and context engineering.",
          },
          {
            type: "h3",
            text: "GitHub / CI",
          },
          {
            type: "p",
            text: "PR reviews, failing checks, deployment status — high stakes switches because mistakes are public. Guide: CI failure debugging with AI.",
          },
          {
            type: "h3",
            text: "Standup / status",
          },
          {
            type: "p",
            text: "Reconstructing yesterday is switching into historian mode. Guide: automate daily standup.",
          },
        ],
      },
      {
        id: "remote",
        title: "Why remote amplifies the problem",
        blocks: [
          {
            type: "ul",
            items: [
              "Visibility pressure — slow Slack response reads as disengaged",
              "Multiple time zones — threads evolve while you sleep",
              "Contractors juggle multiple clients with separate stacks",
              "No whiteboard — decisions live in scattered messages",
            ],
          },
        ],
      },
      {
        id: "fixes",
        title: "Fixes beyond 'try harder'",
        blocks: [
          {
            type: "ul",
            items: [
              "Time-box communication tools",
              "One active task document per focus block",
              "OAuth-connected tooling inside one primary interface (e.g. Claude + MCP)",
              "Approve/reject workflows instead of manual glue work",
              "Automate status and replies where tone can be learned from context",
            ],
          },
        ],
      },
    ],
    productPitch: {
      title: "How coolplugz reduces context switching",
      paragraphs: [
        ctaParagraph,
        "You stay in Claude. coolplugz pulls Jira, Slack, GitHub, and Notion into one run — tasks, PRs, CI, and Slack drafts delivered together.",
      ],
    },
  },
];
