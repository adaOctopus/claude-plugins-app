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
              The work runs. You approve.
            </h2>
            <p className="mt-4 text-charcoal-muted">
              While you&apos;re away from the screen, the plugin gathers context,
              writes and runs advanced prompts, and completes the task — code,
              CI fixes, Slack drafts, standup updates. Prompts aren&apos;t handed
              to you. They&apos;re generated, executed, and turned into finished
              output automatically.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-charcoal">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Background execution — zero manual prompt writing
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Update messages generated for you — approve and send
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Reject triggers automatic redo — no LLM spiral on your end
              </li>
            </ul>
            <Button className="mt-8" size="lg" asChild>
              <Link href="/pricing">Get the plugin</Link>
            </Button>
          </div>

          <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-b from-sky-200 to-emerald-100">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-200 to-transparent" />
            </div>
            <div className="relative w-full max-w-xs px-6 text-center">
              <div className="rounded-2xl border border-border bg-white/90 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-charcoal-muted">
                  Your screen
                </p>
                <p className="mt-2 text-sm text-charcoal">
                  Task complete. Standup draft ready. Slack reply written.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="flex-1 rounded-full bg-emerald-500 py-2 text-xs font-semibold text-white">
                    Approve &amp; submit
                  </span>
                  <span className="flex-1 rounded-full border border-border py-2 text-xs font-medium text-charcoal">
                    Reject &amp; redo
                  </span>
                </div>
              </div>
              <p className="mt-6 font-serif text-xl text-charcoal">
                That&apos;s your entire job.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
