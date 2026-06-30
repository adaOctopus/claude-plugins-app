import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

const integrations = [
  { name: "Jira", color: "bg-blue-100 text-blue-800", angle: 0 },
  { name: "Slack", color: "bg-purple-100 text-purple-800", angle: 72 },
  { name: "GitHub", color: "bg-gray-100 text-gray-800", angle: 144 },
  { name: "Docs", color: "bg-amber-100 text-amber-800", angle: 216 },
  { name: "CI/CD", color: "bg-green-100 text-green-800", angle: 288 },
];

/** Integrations bento — automatic execution; human only approves or rejects. */
export function IntegrationsSection() {
  return (
    <section id="integrations" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          Context engineering
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          The old loop is dead. Welcome to approve / reject.
        </h2>
        <p className="mt-4 max-w-3xl text-charcoal-muted">
          The old way: you gather context, write prompts, run the AI, read output,
          re-prompt, iterate, copy-paste into Slack, repeat. The new way:{" "}
          <strong className="font-medium text-charcoal">
            everything before the final screen is automatic
          </strong>
          . Prompts are generated and used — not shown to you. Work runs in the
          background. You only decide when it&apos;s ready to ship.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="bento-card p-8">
            <h3 className="text-xl font-semibold text-charcoal">
              Runs in the background. Not on your to-do list.
            </h3>
            <p className="mt-2 text-sm text-charcoal-muted">
              The plugin pulls everything from Jira, Slack, GitHub, CI, and docs,
              builds CRISPE prompts, runs them against Claude, and produces
              finished output — code commits, fix suggestions, Slack messages,
              standup updates. You don&apos;t touch any of that pipeline.
            </p>
            <div className="relative mx-auto mt-8 flex h-64 items-center justify-center">
              <div className="absolute h-48 w-48 rounded-full border border-border/60" />
              <div className="absolute h-32 w-32 rounded-full border border-border/40" />
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-charcoal font-serif text-sm text-cream">
                PX
              </div>
              {integrations.map((item) => {
                const radius = 100;
                const rad = (item.angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                return (
                  <span
                    key={item.name}
                    className={`absolute rounded-full px-3 py-1 text-xs font-medium ${item.color}`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    {item.name}
                  </span>
                );
              })}
            </div>
            <p className="mt-4 text-center text-xs text-charcoal-muted">
              Context → prompts → execution — all automatic
            </p>
          </div>

          <div className="bento-card p-8">
            <h3 className="text-xl font-semibold text-charcoal">
              Your only interface: approve or reject
            </h3>
            <p className="mt-2 text-sm text-charcoal-muted">
              When work is done, you get a single screen: the output, the generated
              update messages, and two buttons. Approve &amp; submit ships it.
              Reject &amp; redo sends it back through the pipeline — still without
              you writing a single prompt.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Approve &amp; submit</p>
                  <p className="text-xs text-charcoal-muted">
                    Merge the PR, post the Slack reply, send the standup — one tap.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-charcoal-muted" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Reject &amp; redo</p>
                  <p className="text-xs text-charcoal-muted">
                    Plugin re-runs automatically. You still never touch the prompts.
                  </p>
                </div>
              </div>
              <p className="text-xs font-medium text-charcoal">
                Human out of the loop until the very last step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
