import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BrandWordmark } from "@/components/brand/PlugsvilleMark";
import { Badge } from "@/components/ui/badge";

export const faqItems = [
  {
    question: "Do I write or copy prompts myself?",
    answer:
      "No. Prompts are never handed to you. The plugin generates CRISPE-engineered prompts and runs them automatically in the background using all gathered context. You don't see the prompt layer — you see finished output: code, fixes, Slack drafts, standup updates. Your only interaction is Approve & submit or Reject & redo.",
  },
  {
    question: "What does Approve & submit vs Reject & redo actually mean?",
    answer:
      "Approve & submit ships the work: merge the PR, post the Slack message, send the standup update — whatever was generated. Reject & redo sends the task back through the automatic pipeline for another run. In both cases, you never write prompts, gather context, or iterate manually with the LLM. You're out of the loop until that final decision.",
  },
  {
    question: "What is context switching — and why does it drain engineers?",
    answer:
      "Context switching is the mental cost of jumping between tools and modes: Slack messages, Jira tickets, GitHub PRs, CI logs, and docs — each requiring you to reload a different thread of thought. Research on knowledge work consistently shows that every switch adds recovery time and error risk. For remote engineers, this isn’t occasional — it’s the default state of the day. plugsville removes you as the integration layer by pulling everything into one context engine before AI acts.",
  },
  {
    question: "What is AI fatigue — and what causes it?",
    answer:
      "AI fatigue is the exhaustion that comes from endlessly prompting, correcting, re-prompting, and copy-pasting outputs between tools — what we call LLM spirals. You spend more energy steering the model than doing the work. Anthropic’s research on how people use AI (including findings from the Anthropic Economic Index) highlights that adoption is soaring, but the burden of crafting effective prompts and iterating for accuracy still falls heavily on the user. That cognitive load is AI fatigue — and it’s why ‘just use ChatGPT’ isn’t enough for real engineering work.",
  },
  {
    question: "How does plugsville eliminate LLM spirals?",
    answer:
      "The plugin runs the entire loop for you in the background: gather context from Jira, Slack, GitHub, and docs → generate CRISPE prompts → execute them → produce finished output. You never prompt, iterate, or copy-paste. You only Approve & submit or Reject & redo. No spirals because you're not in the loop until the work is already done.",
  },
  {
    question: "What is a Claude plugin — and what does Context Engineer do?",
    answer:
      "A Claude plugin extends Claude with custom workflows. Context Engineer is our plugin for software engineers: it automatically gathers all context, generates and runs advanced prompts, completes tasks (code, CI fixes, messages), and puts finished output on your screen. You Approve & submit or Reject & redo. You never write a prompt.",
  },
  {
    question: "How does context engineering differ from ‘just gathering context’?",
    answer:
      "Gathering context is step one. Context engineering is the full pipeline: collect every relevant signal (tickets, threads, PRs, CI, docs), structure it for the model, and produce a CRISPE-grade prompt — Capacity, Role, Insight, Statement, Personality, Experiment — tuned to deliver accurate, high-quality output the first time. plugsville does both. Automatically.",
  },
  {
    question: "Can plugsville help with CI failure debugging?",
    answer:
      "Yes. Instead of copying CI logs into a chat window and spiraling through failed fixes, the plugin feeds full repo context, PR history, and CI output into an engineered prompt — so fixes are targeted, verified against requirements, and delivered without iteration loops.",
  },
  {
    question: "How do I reduce Slack anxiety as a remote worker?",
    answer:
      "The plugin monitors Slack for action items and generates reply drafts and standup updates automatically — already written, ready to send. You Approve & submit to post them. No drafting, no prompting, no iteration.",
  },
  {
    question: "What's included in the €17/month subscription?",
    answer:
      "The Context Engineer Claude plugin with full Jira, Slack, and GitHub integration; automatic CRISPE-based context engineering; in-Claude dashboard via MCP; install guide; and ongoing updates. No per-task prompt writing. No LLM iteration tax.",
  },
  {
    question: "Can I add more plugins later?",
    answer:
      "Yes. We launch with one plugin built for engineers. A marketplace for additional plugins — and tools to upload or create your own — is coming. Extra plugins will be available from €2.50/month each.",
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
          <BrandWordmark /> helps with context switching, AI fatigue, and the constant burnout, that
          the modern remote worker faces.
        </p>

        <Accordion type="single" collapsible className="mt-10">
          {faqItems.map((item, i) => (
            <AccordionItem key={item.question} value={`item-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
