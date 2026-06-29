import { Badge } from "@/components/ui/badge";

const integrations = [
  { name: "Jira", color: "bg-blue-100 text-blue-800", angle: 0 },
  { name: "Slack", color: "bg-purple-100 text-purple-800", angle: 72 },
  { name: "GitHub", color: "bg-gray-100 text-gray-800", angle: 144 },
  { name: "Docs", color: "bg-amber-100 text-amber-800", angle: 216 },
  { name: "CI/CD", color: "bg-green-100 text-green-800", angle: 288 },
];

/** Integrations bento — orbit graphic showing unified context sources. */
export function IntegrationsSection() {
  return (
    <section id="integrations" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          Integrations
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          Built for absolute clarity and focused work
        </h2>
        <p className="mt-4 max-w-2xl text-charcoal-muted">
          Stay focused with tools that organize, connect, and turn information
          into confident decisions — all unified in one context engine.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="bento-card p-8">
            <h3 className="text-xl font-semibold text-charcoal">
              Smart. Simple. Brilliant.
            </h3>
            <p className="mt-2 text-sm text-charcoal-muted">
              Your data from Jira, Slack, and GitHub is beautifully organized
              so AI sees everything clearly without the clutter.
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
          </div>

          <div className="bento-card p-8">
            <h3 className="text-xl font-semibold text-charcoal">
              Your work, in sync
            </h3>
            <p className="mt-2 text-sm text-charcoal-muted">
              Every update from Jira, Slack, and GitHub flows instantly into
              your AI context — keeping collaboration effortless and fast.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-sand text-xs font-medium">
                  TM
                </div>
                <div className="rounded-2xl bg-accent-sand px-4 py-3 text-sm text-charcoal">
                  Team updates flow seamlessly
                </div>
              </div>
              <div className="flex items-start justify-end gap-3">
                <div className="rounded-2xl bg-charcoal px-4 py-3 text-sm text-cream">
                  Context synced from all platforms
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal text-xs font-medium text-cream">
                  AI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
