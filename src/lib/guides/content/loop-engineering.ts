import type { Guide } from "@/lib/guides/types";
import { ORCHESTRATION_CTA } from "@/lib/product-positioning";

const ctaParagraph = ORCHESTRATION_CTA;

/** Loop engineering guide — Anthropic agent-loop playbook mapped for Claude Code developers. */
export const loopEngineeringGuides: Guide[] = [
  {
    slug: "loop-engineering-anthropic-playbook",
    title: "Loop Engineering: Anthropic's Agent Playbook for Claude Code",
    metaTitle: "Loop Engineering — Anthropic Agent Loop for Developers",
    metaDescription:
      "What loop engineering is, how Anthropic's gather → act → verify → repeat agent cycle works, and how to run it with Claude Code without prompt babysitting.",
    keywords: [
      "loop engineering",
      "loop engineering anthropic",
      "anthropic agent loop",
      "anthropic loop engineering playbook",
      "gather act verify repeat",
      "claude agent sdk loop",
      "loop engineering vs prompt engineering",
      "write verifiers not prompts",
      "claude code orchestration",
      "agent loop 2026",
      "effective harnesses long running agents",
      "context engineering agents",
      "claude code unattended",
      "claude code agent loop",
    ],
    category: "guide",
    faqQuestion: "What is loop engineering for Claude Code?",
    directAnswer:
      "Loop engineering means designing the repeating cycle an agent runs — gather context, take action, verify work, repeat — instead of hand-crafting one-off prompts. Anthropic's Claude Agent SDK describes this as the unit you engineer; CoolPlugz is the orchestration layer that runs that loop across Jira, GitHub, Slack, and CI for Claude Code.",
    relatedSlugs: [
      "claude-code-after-tutorial",
      "ai-fatigue-developers",
      "llm-spirals-coding",
      "best-claude-plugins-for-developers",
      "context-switching-developers",
    ],
    sections: [
      {
        id: "what-is-loop-engineering",
        title: "What is loop engineering?",
        blocks: [
          {
            type: "p",
            text: "Loop engineering is the discipline of designing agent cycles — not individual prompts. In mid-2026, engineers converged on the same idea under names like loop engineering and harness engineering: stop babysitting each model turn, start engineering what happens every turn.",
          },
          {
            type: "p",
            text: "Anthropic never published a post titled \"loop engineering,\" but their engineering essays describe the same shape from the inside. The Claude Agent SDK runs a three-step cycle on every task: gather context, take action, verify work — then repeat until the job is done or a stopping condition trips.",
          },
          {
            type: "h3",
            text: "Why developers search for this now",
          },
          {
            type: "ul",
            items: [
              "Prompt engineering optimizes one call; loop engineering optimizes the whole run",
              "Claude Code and agent SDKs made unattended coding sessions normal",
              "Teams hit a ceiling when generators cannot verify their own output",
              "Context windows are finite — loops that dump everything get slower and dumber",
            ],
          },
        ],
      },
      {
        id: "anthropic-agent-loop",
        title: "The loop Anthropic actually ships",
        blocks: [
          {
            type: "p",
            text: "In Anthropic's Claude Agent SDK framing, an agent is not a chatbot in a while loop. It is a harness that runs the same cycle until work is verified:",
          },
          {
            type: "ul",
            items: [
              "Gather context — pull only what the next step needs (grep a log, read a ticket slice, fetch PR diff)",
              "Take action — use tools to change the world; without tools the loop is just talk",
              "Verify work — check output against the goal (tests, browser checks, review comments)",
              "Repeat — queue the next ticket or iteration until a budget or stop rule fires",
            ],
          },
          {
            type: "p",
            text: "That cycle — not the prompt inside it — is what Anthropic built Claude Code around and what they extracted into the Agent SDK so teams stop maintaining homegrown loops.",
          },
        ],
      },
      {
        id: "five-principles",
        title: "Five principles from Anthropic's essays",
        blocks: [
          {
            type: "h3",
            text: "1. Do the simplest thing that works",
          },
          {
            type: "p",
            text: "Building Effective Agents draws a line between workflows (fixed code paths) and agents (models that direct their own process). Reach for a pipeline first; accept full agent autonomy only when the task earns it.",
          },
          {
            type: "h3",
            text: "2. Design the loop shape before the prompt",
          },
          {
            type: "p",
            text: "Decide what triggers a turn, what one turn may do, and what ends the run. Prompts live inside that structure — they do not replace it.",
          },
          {
            type: "h3",
            text: "3. The verifier is the load-bearing step",
          },
          {
            type: "p",
            text: "Anthropic's own web-app example improved dramatically once Claude could test features like a human. A generator that cannot check itself produces plausible slop faster. Build the verifier before you scale the generator.",
          },
          {
            type: "h3",
            text: "4. Context is a budget, not a bucket",
          },
          {
            type: "p",
            text: "Effective Context Engineering treats the window as finite. Each iteration should retrieve the smallest high-signal slice — ticket + PR + relevant thread — not re-read your entire history.",
          },
          {
            type: "h3",
            text: "5. For unattended runs, the harness carries the loop",
          },
          {
            type: "p",
            text: "Effective Harnesses for Long-Running Agents adds budgets, stopping conditions, recovery, and observability. An open loop with no stop rule is how a small mistake becomes an expensive one.",
          },
        ],
      },
      {
        id: "loop-vs-prompt",
        title: "Loop engineering vs prompt engineering",
        blocks: [
          {
            type: "p",
            text: "Prompt engineering asks: \"How do I phrase this one request?\" Loop engineering asks: \"What cycle should run until the outcome is verified?\"",
          },
          {
            type: "ul",
            items: [
              "Prompt engineering: one shot, one hope",
              "Loop engineering: gather → act → verify → repeat with explicit stop rules",
              "Prompt engineering: you paste context manually each session",
              "Loop engineering: context retrieval and verification are part of the design",
            ],
          },
        ],
      },
      {
        id: "coolplugz-in-the-loop",
        title: "Where CoolPlugz fits",
        blocks: [
          {
            type: "p",
            text: "CoolPlugz is the orchestration layer that runs the loop for Claude Code developers:",
          },
          {
            type: "ul",
            items: [
              "Gather — Jira ticket, GitHub PR, Slack thread, CI status in one curated slice",
              "Act — structured workflows guide Claude Code through plan → implement → push",
              "Verify — tests, review comments, merge conflicts checked inside the same run",
              "Repeat — run all open tickets or queue the next without re-briefing from scratch",
            ],
          },
          {
            type: "p",
            text: "You stay in Claude. The loop runs with persistent orchestration — not a fresh prompt spiral every morning.",
          },
        ],
      },
      {
        id: "sources",
        title: "Primary sources (Anthropic)",
        blocks: [
          {
            type: "p",
            text: "This guide synthesizes public Anthropic engineering essays — not an official Anthropic product name. Primary references:",
          },
          {
            type: "ul",
            items: [
              "Building Effective AI Agents — workflows vs agents, guardrails",
              "Building agents with the Claude Agent SDK — gather → act → verify → repeat",
              "Effective context engineering for AI agents — context as a finite resource",
              "Effective harnesses for long-running agents — budgets, stopping conditions, recovery",
            ],
          },
        ],
      },
    ],
    productPitch: {
      title: "Run the loop with CoolPlugz",
      paragraphs: [
        ctaParagraph,
        "If you are tired of re-prompting Claude Code for every ticket, CoolPlugz implements the agent loop Anthropic's SDK describes — context, action, verification, and repeat — as an MCP orchestration layer you connect once in Claude.",
      ],
    },
  },
];
