"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, GitBranch, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const painPoints = [
  {
    id: "slack",
    icon: MessageSquare,
    title: "Slack anxiety & reply fatigue",
    description:
      "Missing a message feels like career risk. Crafting replies drains your focus before you even start coding.",
    visual: "slack",
  },
  {
    id: "context",
    icon: GitBranch,
    title: "Context switching chaos",
    description:
      "Jira tickets, Slack threads, GitHub PRs, and docs — scattered across tabs. Your brain becomes the integration layer.",
    visual: "context",
  },
  {
    id: "ci",
    icon: AlertTriangle,
    title: "CI failure & LLM spirals",
    description:
      "Copy-pasting failed checks into AI, re-prompting, pushing commits back-to-back — each iteration adds AI fatigue. Hours lost to loops that better context and prompts would prevent.",
    visual: "ci",
  },
];

function SlackVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6">
      <div className="rounded-2xl bg-accent-sand p-4 text-sm text-charcoal">
        &quot;Can you give a quick update on the API refactor?&quot;
      </div>
      <div className="ml-auto max-w-[80%] rounded-2xl bg-charcoal p-4 text-sm text-cream">
        Typing... deleting... typing again...
      </div>
      <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
        12 unread channels · 3 mentions waiting
      </div>
    </div>
  );
}

function ContextVisual() {
  const tabs = ["Jira", "Slack", "GitHub", "Docs", "CI"];
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <span
            key={tab}
            className="rounded-full border border-border bg-white px-3 py-1 text-xs text-charcoal-muted"
          >
            {tab}
          </span>
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-3 rounded-full bg-accent-sand"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
      <p className="text-xs text-charcoal-muted">Your brain: the middleware</p>
    </div>
  );
}

function CIVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6 font-mono text-xs">
      <div className="rounded-lg bg-red-50 p-3 text-red-700">
        ✗ build failed — 14 errors
      </div>
      <div className="rounded-lg bg-accent-sage p-3 text-charcoal-muted">
        &gt; paste error into Claude...
      </div>
      <div className="rounded-lg bg-accent-peach p-3 text-charcoal-muted">
        &gt; push commit #7...
      </div>
      <div className="rounded-lg bg-red-50 p-3 text-red-700">
        ✗ still failing — 11 errors
      </div>
    </div>
  );
}

const visuals = {
  slack: SlackVisual,
  context: ContextVisual,
  ci: CIVisual,
};

/** Problem section — tabbed pain points with animated visuals. */
export function ProblemSection() {
  const [active, setActive] = useState("slack");
  const ActiveVisual = visuals[active as keyof typeof visuals];

  return (
    <section id="problem" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          The Problem
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          Context chaos is killing remote productivity
        </h2>
        <p className="mt-4 max-w-2xl text-charcoal-muted">
          Today you manually gather context, write prompts, run AI, and iterate.
          With coolplugz,{" "}
          <strong className="font-medium text-charcoal">all of that runs automatically</strong>.
          You only show up to Approve &amp; submit or Reject &amp; redo.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {painPoints.map((point) => {
              const Icon = point.icon;
              const isActive = active === point.id;
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => setActive(point.id)}
                  className={`w-full rounded-2xl border bg-white p-6 text-left transition-all ${
                    isActive
                      ? "border-charcoal shadow-md"
                      : "border-border hover:border-charcoal/30"
                  }`}
                >
                  {isActive && (
                    <div className="mb-3 h-1 w-12 rounded-full bg-charcoal" />
                  )}
                  <div className="flex items-start gap-3">
                    <Icon className="mt-1 h-5 w-5 shrink-0 text-charcoal" />
                    <div>
                      <h3 className="font-semibold text-charcoal">{point.title}</h3>
                      <p className="mt-1 text-sm text-charcoal-muted">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="min-h-[320px] overflow-hidden rounded-2xl border border-border bg-accent-sage/50">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full min-h-[320px]"
              >
                <ActiveVisual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
