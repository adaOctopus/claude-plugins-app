import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BrandWordmark } from "@/components/brand/CoolplugzMark";
import { Badge } from "@/components/ui/badge";
import { GuideReadMoreLink } from "@/components/guides/GuideDocument";
import { getGuideSlugForFaqQuestion, TROUBLESHOOTING_GUIDE_SLUG } from "@/lib/guides/registry";

export const faqItems: {
  question: string;
  answer: string;
  guideSlug?: string;
}[] = [
  {
    question: "Why does the GitHub ↔ CI ↔ LLM back-and-forth destroy mental energy?",
    answer:
      "Each CI iteration forces a hard context switch: chat → GitHub Actions → copy logs → chat → push → wait → refresh. You juggle three mental models at once — how the model reasons, what the pipeline actually ran, and what changed in git — while CI latency fragments your attention. The bug might take twenty minutes; the loop takes two hours and leaves you more drained than coding from scratch. That switch tax is a major driver of AI fatigue for developers.",
    guideSlug: TROUBLESHOOTING_GUIDE_SLUG,
  },
  {
    question: "What if my company blocks the Slack API for Coolplugz?",
    answer:
      "Common at larger companies — admins often restrict third-party Slack apps. Switch to Claude Cowork, enable the Claude in Chrome extension, and keep Coolplugz connected in parallel. Sign in to Slack in your browser when prompted; Cowork reads thread DOM data while Coolplugz still orchestrates your Claude Code session. You approve before anything posts.",
    guideSlug: TROUBLESHOOTING_GUIDE_SLUG,
  },
  {
    question: "What if GitHub repos require SSO or a personal access token (PAT)?",
    answer:
      "Org repos behind GitHub SSO need SSO authorized under GitHub Settings → Applications before Coolplugz can read them. If OAuth still cannot reach a repo, create a fine-grained PAT scoped to the repos you need and paste it in the GitHub connect flow when Coolplugz prompts you inside Claude Code. Use minimal scopes and rotate on your company schedule.",
    guideSlug: TROUBLESHOOTING_GUIDE_SLUG,
  },
  {
    question: "Do I write or copy prompts myself?",
    answer:
      "No. CoolPlugz is an orchestration layer — it gathers context, structures workflows, and guides your Claude Code session. You don't write prompts or copy-paste between tools. Claude Code executes in your environment; CoolPlugz keeps the session on track.",
  },
  {
    question: "What does Approve & submit vs Reject & redo actually mean?",
    answer:
      "Approve & submit ships the work: merge the PR, post the Slack message, send the standup update — whatever was generated. Reject & redo sends the task back through the automatic pipeline for another run. In both cases, you never write prompts, gather context, or iterate manually with the LLM. You're out of the loop until that final decision.",
  },
  {
    question: "What is context switching - and why does it drain engineers?",
    answer:
      "Context switching is the mental cost of jumping between tools and modes: Slack messages, Jira tickets, GitHub PRs, CI logs, and docs — each requiring you to reload a different thread of thought. Research on knowledge work consistently shows that every switch adds recovery time and error risk. For remote engineers, this isn’t occasional — it’s the default state of the day. coolplugz removes you as the integration layer by pulling everything into one context engine before AI acts.",
  },
  {
    question: "What is AI fatigue - and what causes it?",
    answer:
      "AI fatigue is the exhaustion that comes from endlessly prompting, correcting, re-prompting, and copy-pasting outputs between tools — what we call LLM spirals. You spend more energy steering the model than doing the work. Anthropic’s research on how people use AI (including findings from the Anthropic Economic Index) highlights that adoption is soaring, but the burden of crafting effective prompts and iterating for accuracy still falls heavily on the user. That cognitive load is AI fatigue — and it’s why ‘just use ChatGPT’ isn’t enough for real engineering work.",
  },
  {
    question: "How does coolplugz eliminate LLM spirals?",
    answer:
      "CoolPlugz orchestrates your Claude Code session: it syncs Jira, Slack, GitHub, and Notion, guides workflow steps, and helps Claude Code deliver finished work. You're not babysitting agents or switching tools — CoolPlugz keeps the session structured until tasks are done.",
  },
  {
    question: "What is a Claude plugin - and what does Context Engineer do?",
    answer:
      "A Claude plugin extends Claude with custom workflows. CoolPlugz is an orchestration layer for Claude Code: it gathers context from Jira, Slack, GitHub, and Notion, guides your session with structured prompts and workflow steps, and helps Claude Code deliver tasks end-to-end — without you supervising every step.",
  },
  {
    question: "How does context engineering differ from ‘just gathering context’?",
    answer:
      "Gathering context is step one. Context engineering is the full pipeline: collect every relevant signal (tickets, threads, PRs, CI, docs), structure it for the model, and produce a CRISPE-grade prompt — Capacity, Role, Insight, Statement, Personality, Experiment — tuned to deliver accurate, high-quality output the first time. coolplugz does both. Automatically.",
  },
  {
    question: "Can coolplugz help with CI failure debugging?",
    answer:
      "Yes. Instead of copying CI logs into a chat window and spiraling through failed fixes, the plugin feeds full repo context, PR history, and CI output into an engineered prompt — so fixes are targeted, verified against requirements, and delivered without iteration loops. See our integration troubleshooting guide for the mental-energy cost of manual GitHub ↔ CI ↔ LLM loops and how to escape them.",
    guideSlug: TROUBLESHOOTING_GUIDE_SLUG,
  },
  {
    question: "How do I reduce Slack anxiety as a remote worker?",
    answer:
      "The plugin monitors Slack for action items and generates reply drafts and standup updates automatically — already written, ready to send. You Approve & submit to post them. No drafting, no prompting, no iteration.",
  },
  {
    question: "What is the free trial?",
    answer:
      "The free trial gives you 7 days of CoolPlugz with full Jira, GitHub, Notion, and Slack integration — smart branch detection, push verification, PR creation, CI checks, and PR review resolution. No credit card required. Upgrade to Pro ($17/month or $147/year) for unlimited usage, multi-repo tasks, and developer insights.",
  },
  {
    question: "What's included in the Pro subscription?",
    answer:
      "Pro is $17/month or $147/year (~28% savings on annual). It includes everything in the free trial plus unlimited usage, tasks spanning multiple repos, and developer insights. CoolPlugz orchestrates your Claude Code session — Claude Code executes in your environment.",
  },
  {
    question: "Can I add more plugins later?",
    answer:
      "Yes. We launch with one plugin built for engineers. A marketplace for additional plugins — and tools to upload or create your own — is coming. Extra plugins will be available from $2.50/month each.",
  },
];

/** FAQ section — SEO-rich accordion with schema-friendly content. */
export function FAQSection() {
  return (
    <section id="faq" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Badge variant="secondary" className="mb-4">
          FAQ
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-charcoal-muted">
          <BrandWordmark className="text-[1.2rem] md:text-[1.45rem]" /> helps with context switching,
          AI fatigue, and the constant burnout, that the modern remote worker faces.
        </p>

        <Accordion type="single" collapsible className="mt-10">
          {faqItems.map((item, i) => {
            const guideSlug =
              item.guideSlug ?? getGuideSlugForFaqQuestion(item.question);

            return (
              <AccordionItem key={item.question} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p>{item.answer}</p>
                  {guideSlug ? (
                    <p className="mt-3">
                      <GuideReadMoreLink slug={guideSlug} />
                    </p>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <p className="mt-8 text-center text-sm text-charcoal-muted">
          Explore all topics in our{" "}
          <Link href="/guides" className="font-medium text-charcoal underline underline-offset-2">
            developer guides
          </Link>{" "}
          — or{" "}
          <Link href="/#make-money" className="font-medium text-charcoal underline underline-offset-2">
            generate passive income with Claude
          </Link>{" "}
          by referring CoolPlugz.
        </p>
      </div>
    </section>
  );
}
