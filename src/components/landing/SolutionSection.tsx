import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palmtree, Sparkles } from "lucide-react";

/** Solution section — tropical lay-back visual with product outcome messaging. */
export function SolutionSection() {
  return (
    <section id="solution" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent-sage via-cream to-accent-peach">
        <div className="grid items-center gap-10 p-8 md:grid-cols-2 md:p-16">
          <div>
            <Badge variant="secondary" className="mb-4">
              The Solution
            </Badge>
            <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
              Lay back. AI has the context.
            </h2>
            <p className="mt-4 text-charcoal-muted">
              Project X connects Jira, Slack, GitHub, and your docs into one
              context engine. No more copy-pasting CI logs. No more Slack anxiety.
              No more telling AI what it should already know.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-charcoal">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Tasks delivered in minutes, not hours
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Standup updates generated automatically
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                CI failures resolved with full repo context
              </li>
            </ul>
            <Button className="mt-8" size="lg" asChild>
              <Link href="/pricing">Start working less</Link>
            </Button>
          </div>

          <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-b from-sky-200 to-emerald-100">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-200 to-transparent" />
            </div>
            <div className="relative text-center">
              <Palmtree className="mx-auto h-16 w-16 text-emerald-700" />
              <p className="mt-4 font-serif text-2xl text-charcoal">
                Tropical productivity
              </p>
              <p className="mt-2 text-sm text-charcoal-muted">
                Chaise lounge not included — but the calm is.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
