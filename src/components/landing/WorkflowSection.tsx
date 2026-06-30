import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bot, CheckCircle2, XCircle, Zap } from "lucide-react";

const autoSteps = [
  {
    icon: Zap,
    label: "Gathers all context",
    detail: "Jira, Slack, GitHub, CI, docs — automatically, in the background.",
  },
  {
    icon: Bot,
    label: "Generates & runs prompts",
    detail: "CRISPE-engineered prompts are built and executed. You never write or copy them.",
  },
  {
    icon: ArrowRight,
    label: "AI completes the work",
    detail: "Code, CI fixes, Slack replies, and standup updates — done before you look.",
  },
];

/** Workflow section — automatic pipeline; human only approves or rejects. */
export function WorkflowSection() {
  return (
    <section id="how-it-works" className="border-y border-border bg-cream-warm px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          How it works
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          You&apos;re out of the loop. Until approve or reject.
        </h2>
        <p className="mt-4 max-w-3xl text-charcoal-muted">
          No manual context gathering. No prompt writing. No running jobs or
          iterating with the LLM. The plugin does all of that automatically in
          the background — then puts finished output on your screen. Your only
          job: <strong className="font-medium text-charcoal">Approve &amp; submit</strong>, or{" "}
          <strong className="font-medium text-charcoal">Reject &amp; redo</strong>.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {autoSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="relative rounded-2xl border border-border bg-white p-6">
                <span className="mb-3 inline-block rounded-full bg-charcoal/5 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-charcoal-muted">
                  Automatic · Step {i + 1}
                </span>
                <Icon className="mb-3 h-6 w-6 text-charcoal" />
                <h3 className="font-semibold text-charcoal">{step.label}</h3>
                <p className="mt-2 text-sm text-charcoal-muted">{step.detail}</p>
              </div>
            );
          })}

          <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/60 p-6 lg:col-span-1">
            <span className="mb-3 inline-block rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
              You · Step 4
            </span>
            <div className="mt-2 flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Approve &amp; submit
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-charcoal">
                <XCircle className="h-5 w-5 text-charcoal-muted" />
                Reject &amp; redo
              </div>
            </div>
            <p className="mt-4 text-xs text-charcoal-muted">
              That&apos;s it. No prompts to edit. No tabs to switch. No LLM spirals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
