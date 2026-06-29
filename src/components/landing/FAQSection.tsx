import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export const faqItems = [
  {
    question: "What is a Claude plugin for developers?",
    answer:
      "A Claude plugin extends Claude with custom commands, context sources, and workflows. Project X's Context Engineer plugin connects Jira, Slack, and GitHub so Claude understands your tasks, CI status, and team conversations without manual copy-pasting.",
  },
  {
    question: "How does AI context engineering work with Jira, Slack, and GitHub?",
    answer:
      "Our MCP server aggregates data from your connected platforms — open Jira tickets, Slack threads, GitHub PRs and CI results — into structured context that Claude uses to generate accurate code, messages, and standup updates.",
  },
  {
    question: "Can Project X help with CI failure debugging?",
    answer:
      "Yes. Instead of copying CI logs into ChatGPT and spiraling through failed fixes, Project X feeds full repo context, PR history, and CI output directly to Claude — so fixes are targeted and verified against your requirements.",
  },
  {
    question: "How do I reduce Slack anxiety as a remote worker?",
    answer:
      "Project X monitors Slack for action items and generates draft replies and standup updates. You review and send — no more staring at unread badges or crafting responses from scratch under pressure.",
  },
  {
    question: "Can I upload or sell my own Claude plugin?",
    answer:
      "Absolutely. Upload an existing plugin bundle or use our in-app builder to create one. Set your price (typically €2–3/month) and earn 99% of each sale. We handle billing and take a 1% platform fee.",
  },
  {
    question: "What's included in the €19/month subscription?",
    answer:
      "The flagship Context Engineer plugin with Jira, Slack, GitHub integration, in-Claude dashboard, install guide, and ongoing updates. Additional marketplace plugins are €2.50/month each.",
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
          Everything you need to know about Claude plugins, context engineering,
          and working less in the remote era.
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
