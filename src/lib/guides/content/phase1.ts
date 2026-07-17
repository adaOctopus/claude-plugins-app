import type { Guide } from "@/lib/guides/types";

const ctaParagraph =
  "coolplugz is a Claude plugin (MCP) that gathers context from Jira, Slack, GitHub, and Notion, runs CRISPE-engineered prompts automatically, ships merge-ready code with CI checked, and drafts Slack replies — you only Approve & submit or Reject & redo.";

export const phase1Guides: Guide[] = [
  {
    slug: "context-switching-developers",
    title: "What Is Context Switching - and Why Does It Drain Engineers?",
    metaTitle: "Context Switching Cost for Developers",
    metaDescription:
      "Why context switching drains remote engineers - and practical ways to reduce the mental tax of jumping between Slack, Jira, GitHub, and docs.",
    keywords: [
      "context switching cost developers",
      "context switching remote engineers",
      "context switching remote work",
    ],
    category: "guide",
    faqQuestion: "What is context switching - and why does it drain engineers?",
    directAnswer:
      "Context switching is the mental cost of jumping between tools and modes — Slack, Jira, GitHub PRs, CI logs, docs — each forcing you to reload a different thread of thought. For remote engineers this is the default state of the day, not an occasional interruption.",
    relatedSlugs: [
      "ai-fatigue-developers",
      "context-switching-remote-engineering",
      "slack-anxiety-remote-developers",
    ],
    pillarSlug: "context-switching-remote-engineering",
    sections: [
      {
        id: "mechanism",
        title: "Why this happens",
        blocks: [
          {
            type: "p",
            text: "Knowledge work research consistently shows that every task switch adds recovery time and error risk. Your brain keeps partial state from the previous tool — an half-read Slack thread, an open PR comment, a failing CI log — while trying to focus on the next thing.",
          },
          {
            type: "p",
            text: "Remote engineers feel this harder because Slack and async tools replace hallway conversations. There is no natural boundary. Notifications stack. You become the integration layer between systems that were never designed to talk to each other.",
          },
          {
            type: "h3",
            text: "The hidden cost",
          },
          {
            type: "ul",
            items: [
              "15–30 minutes to regain deep focus after a switch (varies by person and task)",
              "More mistakes when context is incomplete — wrong ticket, wrong branch, wrong thread",
              "End-of-day exhaustion from coordination work, not from coding",
              "Standups and status updates that require reconstructing what you did across four tools",
            ],
          },
        ],
      },
      {
        id: "diy",
        title: "What you can do right now",
        blocks: [
          {
            type: "ul",
            items: [
              "Batch Slack: check messages at fixed times instead of reacting to every ping",
              "Keep one 'active task' note — ticket ID, branch name, last CI status — visible while you work",
              "Turn off non-critical notifications during focus blocks",
              "Use a single browser workspace per client or project so tabs do not bleed together",
              "Before switching tools, write one sentence: 'I was doing X, next step is Y'",
            ],
          },
        ],
      },
      {
        id: "ceiling",
        title: "Where manual fixes hit a ceiling",
        blocks: [
          {
            type: "p",
            text: "Discipline helps, but you still manually gather context for every task: read the Jira ticket, scroll Slack for decisions, check the PR diff, paste CI errors into a chat window. The switch is gone from your calendar but not from your workflow. You are still the router.",
          },
        ],
      },
    ],
    productPitch: {
      title: "What coolplugz automates",
      paragraphs: [
        ctaParagraph,
        "Instead of you hopping between tools, coolplugz pulls Jira, Slack, GitHub, and Notion into one context engine before AI acts. You stay in Claude until work is done.",
      ],
    },
  },
  {
    slug: "ai-fatigue-developers",
    title: "What Is AI Fatigue - and What Causes It?",
    metaTitle: "AI Fatigue for Developers",
    metaDescription:
      "AI fatigue in software engineering - what causes it, how LLM spirals fit in, and what actually reduces the cognitive load.",
    keywords: ["AI fatigue", "AI fatigue developers", "AI fatigue remote engineers"],
    category: "guide",
    faqQuestion: "What is AI fatigue - and what causes it?",
    directAnswer:
      "AI fatigue is the exhaustion that comes from endlessly prompting, correcting, re-prompting, and copy-pasting outputs between tools. You spend more energy steering the model than doing the work — especially when every Jira ticket or CI failure starts a new chat loop.",
    relatedSlugs: [
      "llm-spirals-coding",
      "context-switching-developers",
      "ai-fatigue-for-developers",
    ],
    pillarSlug: "ai-fatigue-for-developers",
    sections: [
      {
        id: "mechanism",
        title: "Why this happens",
        blocks: [
          {
            type: "p",
            text: "AI adoption is soaring, but the burden of crafting effective prompts and iterating for accuracy still falls on the user. For engineers, that means assembling context from tickets and threads, pasting logs, waiting, pasting again, checking GitHub, pasting again.",
          },
          {
            type: "p",
            text: "That loop feels productive because something is moving. In reality it drains mental energy the same way context switching does — except now you are also managing model behavior, tone, and hallucination risk on every turn.",
          },
          {
            type: "h3",
            text: "Common symptoms",
          },
          {
            type: "ul",
            items: [
              "Dread before opening another chat tab for a 'quick fix'",
              "Copy-paste fatigue between CI logs, Jira, and the LLM",
              "Abandoning AI mid-task because iteration cost exceeds doing it manually",
              "Feeling behind despite using 'productivity' tools all day",
            ],
          },
        ],
      },
      {
        id: "diy",
        title: "What you can do right now",
        blocks: [
          {
            type: "ul",
            items: [
              "Use prompt templates for recurring task types (bug fix, PR description, standup)",
              "Paste full context once — ticket, diff, CI log — in a structured block at the top",
              "Set a iteration cap: three model turns, then stop and reassess manually",
              "Keep a 'context packet' doc per task so you do not re-gather from scratch",
              "Separate 'explore' chats from 'ship' chats to avoid polluting context",
            ],
          },
        ],
      },
      {
        id: "ceiling",
        title: "Where manual fixes hit a ceiling",
        blocks: [
          {
            type: "p",
            text: "Templates help, but you still write the template, still fetch the ticket, still verify CI yourself. AI fatigue returns at scale — more clients, more channels, more failing pipelines. The problem is systemic: tools are disconnected and you are the glue.",
          },
        ],
      },
    ],
    productPitch: {
      title: "What coolplugz automates",
      paragraphs: [
        ctaParagraph,
        "coolplugz runs the gather → prompt → execute → deliver loop in the background. You are not in the chat until output is ready to approve.",
      ],
    },
  },
  {
    slug: "llm-spirals-coding",
    title: "LLM Spirals in Coding- What They Are and How to Stop Them",
    metaTitle: "LLM Spirals - Stop AI Coding Loops",
    metaDescription:
      "What LLM spirals are in software engineering, why copy-paste CI loops happen, and how to break the prompt-iterate-paste cycle.",
    keywords: ["LLM spirals", "AI coding loop stuck", "CI failure debugging AI"],
    category: "guide",
    faqQuestion: "How does coolplugz eliminate LLM spirals?",
    directAnswer:
      "An LLM spiral is when you prompt, get a partial fix, paste it into GitHub, CI fails again, copy the new error back into chat, and repeat — often for longer than fixing the issue manually. The spiral happens because context is incomplete and you are the integration layer.",
    relatedSlugs: [
      "ai-fatigue-developers",
      "ci-failure-debugging-ai",
      "context-engineering-vs-gathering-context",
    ],
    pillarSlug: "ai-fatigue-for-developers",
    sections: [
      {
        id: "mechanism",
        title: "Why spirals happen",
        blocks: [
          {
            type: "p",
            text: "The model only sees what you paste. Miss the Slack decision from Tuesday, the related PR that changed the API, or the full CI stack trace — and the fix targets symptoms. CI fails again. You paste more. The chat grows. Confidence drops.",
          },
          {
            type: "ul",
            items: [
              "Incomplete context → wrong fix → failed CI → more pasting",
              "No automatic verification against ticket acceptance criteria",
              "You manually bridge GitHub, CI, and chat — three switches per iteration",
              "Each turn feels small; the total time is not",
            ],
          },
        ],
      },
      {
        id: "diy",
        title: "What you can do right now",
        blocks: [
          {
            type: "ul",
            items: [
              "Before prompting, list: ticket goal, files touched, last CI error, related PRs",
              "Ask the model for a hypothesis before code — agree on root cause first",
              "Run CI locally when possible to shorten the feedback loop",
              "Stop after two failed CI rounds and read the diff yourself",
              "Use branch protection so spirals do not merge broken work",
            ],
          },
        ],
      },
      {
        id: "ceiling",
        title: "Where manual fixes hit a ceiling",
        blocks: [
          {
            type: "p",
            text: "You can discipline spirals on one task. You cannot manually assemble full stack context for every ticket while also responding on Slack and prepping standup. Spirals return whenever volume exceeds your attention.",
          },
        ],
      },
    ],
    productPitch: {
      title: "What coolplugz automates",
      paragraphs: [
        "coolplugz feeds repo context, PR history, ticket requirements, and CI output into engineered prompts — then runs the loop until output is ready. You Approve & submit or Reject & redo. No spiral because you are not iterating in chat.",
        ctaParagraph,
      ],
    },
  },
  {
    slug: "context-engineering-vs-gathering-context",
    title: "Context Engineering vs Gathering Context",
    metaTitle: "Context Engineering vs Prompt Engineering",
    metaDescription:
      "How context engineering differs from gathering context — and why CRISPE-grade prompts matter for shipping code with AI.",
    keywords: [
      "context engineering vs prompt engineering",
      "AI context engineering",
      "CRISPE prompt engineering",
    ],
    category: "guide",
    faqQuestion: "How does context engineering differ from ‘just gathering context’?",
    directAnswer:
      "Gathering context is step one — collecting tickets, threads, PRs, and CI signals. Context engineering is the full pipeline: structure that material into a prompt tuned to deliver accurate output the first time, using frameworks like CRISPE (Capacity, Role, Insight, Statement, Personality, Experiment).",
    relatedSlugs: [
      "claude-plugin-mcp-explained",
      "llm-spirals-coding",
      "ci-failure-debugging-ai",
    ],
    pillarSlug: "ai-fatigue-for-developers",
    sections: [
      {
        id: "mechanism",
        title: "Why gathering alone is not enough",
        blocks: [
          {
            type: "p",
            text: "Dumping a Jira ticket and a Slack thread into chat is gathering. The model may still miss priority, constraints, and repo conventions because nothing told it how to weigh signals or what 'done' means for this codebase.",
          },
          {
            type: "p",
            text: "Context engineering adds role, success criteria, repo insight, and experiment boundaries — so the model acts like an engineer on your team, not a generic assistant.",
          },
        ],
      },
      {
        id: "diy",
        title: "What you can do right now",
        blocks: [
          {
            type: "ul",
            items: [
              "Use a fixed prompt skeleton: Role, Task, Context sources, Done criteria, Constraints",
              "Link ticket ID, branch, and CI status in every coding prompt",
              "Summarize Slack decisions in three bullets before asking for code",
              "Include test commands and expected pass criteria in the prompt",
              "Store winning prompt shapes per task type in a team doc",
            ],
          },
        ],
      },
      {
        id: "ceiling",
        title: "Where manual fixes hit a ceiling",
        blocks: [
          {
            type: "p",
            text: "Hand-engineering prompts for every ticket does not scale. You become a prompt operator on top of everything else. Context engineering needs to be automatic — gathered from live systems and formatted consistently.",
          },
        ],
      },
    ],
    productPitch: {
      title: "What coolplugz automates",
      paragraphs: [
        "coolplugz gathers context from Jira, Slack, GitHub, and Notion and generates CRISPE-grade prompts automatically — then executes them. You never write or copy prompts.",
        ctaParagraph,
      ],
    },
  },
  {
    slug: "slack-anxiety-remote-developers",
    title: "How to Reduce Slack Anxiety as a Remote Developer",
    metaTitle: "Slack Anxiety Remote Work — Developers",
    metaDescription:
      "Slack notification overload and reply anxiety for remote engineers — practical fixes and when automation helps.",
    keywords: [
      "slack anxiety remote work",
      "slack notification overload developers",
      "how to respond to slack faster",
    ],
    category: "guide",
    faqQuestion: "How do I reduce Slack anxiety as a remote worker?",
    directAnswer:
      "Slack anxiety for remote developers usually comes from constant partial attention — feeling behind on threads, unsure where you are needed, and dreading the time it takes to draft replies that match team tone. Reducing it means batching, triage, and drafting before you open the app.",
    relatedSlugs: [
      "automate-daily-standup-slack",
      "context-switching-developers",
      "ai-fatigue-for-developers",
    ],
    pillarSlug: "ai-fatigue-for-developers",
    sections: [
      {
        id: "mechanism",
        title: "Why Slack drains you",
        blocks: [
          {
            type: "p",
            text: "Slack mixes urgent and non-urgent. Remote work makes it the social layer too — visibility, relationships, blockers. Every red badge pulls you out of code. Drafting replies takes cognitive work: tone, context, what you already promised in another channel.",
          },
        ],
      },
      {
        id: "diy",
        title: "What you can do right now",
        blocks: [
          {
            type: "ul",
            items: [
              "Schedule 3–4 Slack blocks per day instead of always-on",
              "Use unread triage: @mentions first, then DMs, then channels",
              "Keep reply templates for common asks (ETA, PR link, standup defer)",
              "Mute low-signal channels; star what matters for your role",
              "End each block with 'nothing urgent' note to yourself to reduce FOMO",
            ],
          },
        ],
      },
      {
        id: "ceiling",
        title: "Where manual fixes hit a ceiling",
        blocks: [
          {
            type: "p",
            text: "Batching helps but you still read every thread and write every reply. Multiple clients or teams multiply the load. Standup prep still means reconstructing yesterday from memory and git log.",
          },
        ],
      },
    ],
    productPitch: {
      title: "What coolplugz automates",
      paragraphs: [
        "coolplugz monitors Slack for action items and generates reply drafts and standup updates — already written, matched to context. You Approve & submit to post. No drafting loops.",
        ctaParagraph,
      ],
    },
  },
  {
    slug: "ci-failure-debugging-ai",
    title: "CI Failure Debugging with AI - A Practical Guide",
    metaTitle: "Fix CI Failures Faster with AI",
    metaDescription:
      "How to debug CI failures without endless copy-paste loops - context, prompts, and when to automate the GitHub ↔ LLM back-and-forth.",
    keywords: [
      "how to fix CI failures faster",
      "automate CI failure debugging",
      "CI failure debugging AI",
      "github actions failing debug",
    ],
    category: "guide",
    faqQuestion: "Can coolplugz help with CI failure debugging?",
    directAnswer:
      "Yes — but the principle applies with or without tools: CI debugging with AI works when the model sees the full failure log, repo context, related PRs, and ticket requirements in one shot. Copy-pasting only the last error line causes fix-and-fail loops.",
    relatedSlugs: [
      "llm-spirals-coding",
      "context-engineering-vs-gathering-context",
      "claude-plugin-mcp-explained",
    ],
    pillarSlug: "ai-fatigue-for-developers",
    sections: [
      {
        id: "mechanism",
        title: "Why CI + AI loops fail",
        blocks: [
          {
            type: "p",
            text: "CI output is verbose. Engineers paste the bottom red line. The model guesses. Tests fail differently. You paste again. Meanwhile the PR waits and Slack asks for status.",
          },
          {
            type: "ul",
            items: [
              "Truncated logs hide root cause",
              "Missing link between ticket acceptance criteria and the fix",
              "No automatic re-run or verification step",
              "Context switch between GitHub Actions, IDE, and chat",
            ],
          },
        ],
      },
      {
        id: "diy",
        title: "What you can do right now",
        blocks: [
          {
            type: "ul",
            items: [
              "Paste the full failing job log, not just the summary line",
              "Include pyproject/package versions and the command CI runs",
              "Ask for root-cause analysis before asking for a patch",
              "Reproduce locally with the same command when possible",
              "Comment on the PR with what you tried — future you will thank you",
            ],
          },
        ],
      },
      {
        id: "ceiling",
        title: "Where manual fixes hit a ceiling",
        blocks: [
          {
            type: "p",
            text: "Manual CI debugging does not scale across multiple PRs and clients. The gather-paste-fix-push-wait cycle is exactly the LLM spiral problem — and it competes with Slack and standup prep for the same afternoon.",
          },
        ],
      },
    ],
    productPitch: {
      title: "What coolplugz automates",
      paragraphs: [
        "coolplugz syncs GitHub, feeds CI output and repo context into engineered prompts, and delivers fixes as finished output — PR updated, CI watched. You approve or reject.",
        ctaParagraph,
      ],
    },
  },
  {
    slug: "claude-plugin-mcp-explained",
    title: "What Is a Claude Plugin / MCP Server? (For Developers)",
    metaTitle: "Claude Plugin for Developers — MCP Explained",
    metaDescription:
      "What Claude plugins and MCP servers are, how developers use them, and where coolplugz fits in your stack.",
    keywords: [
      "claude plugin for developers",
      "what is an MCP server",
      "Claude MCP dashboard",
    ],
    category: "guide",
    faqQuestion: "What is a Claude plugin — and what does Context Engineer do?",
    directAnswer:
      "A Claude plugin extends Claude with custom workflows via MCP (Model Context Protocol) — a standard way to connect tools, data, and actions. For developers, that means Jira, GitHub, Slack, and Notion inside Claude instead of copy-pasting between browser tabs.",
    relatedSlugs: [
      "best-claude-plugins-for-developers",
      "context-engineering-vs-gathering-context",
      "ci-failure-debugging-ai",
    ],
    sections: [
      {
        id: "mechanism",
        title: "How MCP fits your stack",
        blocks: [
          {
            type: "p",
            text: "MCP servers expose capabilities to Claude: read a ticket, list PRs, draft a message, open a dashboard. You paste one MCP URL into Claude (web Connectors or Desktop config), authorize OAuth once per tool, then talk in plain English or @ keywords.",
          },
          {
            type: "p",
            text: "coolplugz Context Engineer is an MCP built for software engineers — automatic context gathering, prompt generation, task execution, and an in-Claude dashboard for approve/reject.",
          },
        ],
      },
      {
        id: "diy",
        title: "What you can do right now",
        blocks: [
          {
            type: "ul",
            items: [
              "Try Claude with one MCP integration you already use (e.g. GitHub)",
              "Keep sensitive tokens scoped — use OAuth over pasting API keys into chats",
              "Start with one workflow: standup draft, or CI triage, before automating everything",
              "Document @ commands or phrases your team uses consistently",
            ],
          },
        ],
      },
      {
        id: "ceiling",
        title: "Where DIY MCP setup hits a ceiling",
        blocks: [
          {
            type: "p",
            text: "Generic MCP servers connect data. They do not automatically engineer context, run multi-step agent loops, or handle Slack reply tone across channels. That orchestration is what a purpose-built engineering plugin adds.",
          },
        ],
      },
    ],
    productPitch: {
      title: "What coolplugz automates",
      paragraphs: [ctaParagraph],
    },
  },
  {
    slug: "automate-daily-standup-slack",
    title: "How to Automate Your Daily Standup Update in Slack",
    metaTitle: "Automate Daily Standup Updates in Slack",
    metaDescription:
      "Stop reconstructing yesterday from memory — how remote developers automate standup updates in Slack with git, Jira, and AI.",
    keywords: [
      "automate daily standup",
      "automatic standup updates slack",
      "what did I do yesterday standup",
    ],
    category: "guide",
    directAnswer:
      "Automating standup means pulling yesterday's shipped work from git, Jira, and PRs into a short Slack-ready update — before you spend mental energy remembering what you did. Manual version: script git log + ticket queries; better version: tool that drafts tone-matched updates for approval.",
    relatedSlugs: [
      "slack-anxiety-remote-developers",
      "context-switching-developers",
      "claude-plugin-mcp-explained",
    ],
    pillarSlug: "ai-fatigue-for-developers",
    sections: [
      {
        id: "mechanism",
        title: "Why standups drain remote engineers",
        blocks: [
          {
            type: "p",
            text: "Daily calls require reconstructing a day you spent in flow — commits, reviews, blockers, Slack promises. That reconstruction is context switching before 10am. Writing it in Slack afterward is a second pass on the same mental load.",
          },
        ],
      },
      {
        id: "diy",
        title: "What you can do right now",
        blocks: [
          {
            type: "ul",
            items: [
              "End each day with one bullet in a private note: shipped, blocked, tomorrow",
              "Use git log --author since yesterday as a raw standup seed",
              "Link Jira tickets you touched instead of re-explaining them",
              "Post async standup in Slack before the call so the call is sync-only",
              "Keep a consistent three-line format: Done / Doing / Blocked",
            ],
          },
        ],
      },
      {
        id: "ceiling",
        title: "Where manual fixes hit a ceiling",
        blocks: [
          {
            type: "p",
            text: "Notes slip on busy days. Git log alone misses code review and Slack commitments. Multiple clients mean multiple standup formats. Automation needs live context, not just commits.",
          },
        ],
      },
    ],
    productPitch: {
      title: "What coolplugz automates",
      paragraphs: [
        "coolplugz generates standup drafts from Jira, GitHub, and Slack activity — tone-matched and ready to post. You Approve & submit.",
        ctaParagraph,
      ],
    },
  },
];
