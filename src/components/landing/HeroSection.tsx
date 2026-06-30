import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GitBranch as GitHubIcon,
  MessageSquare,
  Ticket,
  XCircle,
  Zap,
} from "lucide-react";

const sources = [
  { label: "Jira", Icon: Ticket },
  { label: "Slack", Icon: MessageSquare },
  { label: "GitHub", Icon: GitHubIcon },
  { label: "Docs", Icon: FileText },
] as const;

/** Hero section — primary value proposition with pipeline preview and CTAs. */
export function HeroSection() {
  return (
    <section className="hero-glow relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-20 text-center md:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,237,230,0.5),transparent_55%)]"
      />

      <span className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        Claude plugin · Live for engineers
      </span>

      <h1 className="relative max-w-4xl font-serif text-4xl text-charcoal md:text-5xl lg:text-6xl">
        All the context-gathering and prompt-engineering done for you.
        {/* <span className="italic text-charcoal/90">fast.</span> */}
      </h1>

      <p className="relative mt-5 max-w-2xl text-sm leading-relaxed text-charcoal-muted md:text-base">
        It scans Jira tickets,
        Slack messages, GitHub repos and technical docs so you don't have to context switch all day. It completes tasks based on context-engineered prompts
        that guarantee accurate AI outputs. You just approve or reject the output. Directly from Claude.
      </p>

      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2">
        {sources.map(({ label, Icon }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-charcoal shadow-sm backdrop-blur-sm"
          >
            <Icon className="h-3.5 w-3.5 text-charcoal-muted" />
            {label}
          </span>
        ))}
      </div>

      <div className="relative mt-10 w-full max-w-3xl rounded-2xl border border-border bg-white/90 p-4 shadow-md backdrop-blur-sm md:p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-charcoal-muted">
          Runs automatically in the background
        </p>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <div className="rounded-xl border border-border bg-cream-warm px-3 py-3 text-left">
            <Zap className="mb-1 h-4 w-4 text-emerald-600" />
            <p className="text-xs font-semibold text-charcoal">Gather context</p>
            <p className="text-[11px] text-charcoal-muted">Jira, Slack, CI, docs</p>
          </div>
          <ArrowRight className="mx-auto hidden h-4 w-4 text-charcoal-muted sm:block" />
          <div className="rounded-xl border border-border bg-cream-warm px-3 py-3 text-left">
            <p className="text-xs font-semibold text-charcoal">CRISPE prompts</p>
            <p className="text-[11px] text-charcoal-muted">Built & executed for you</p>
          </div>
          <ArrowRight className="mx-auto hidden h-4 w-4 text-charcoal-muted sm:block" />
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/70 px-3 py-3 text-left">
            <p className="text-xs font-semibold text-emerald-900">You decide</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                <CheckCircle2 className="h-3 w-3" />
                Approve
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-medium text-charcoal">
                <XCircle className="h-3 w-3" />
                Reject
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-10 flex flex-col gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/pricing">Get the plugin</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/pricing?plan=free">Try free for 1 day</Link>
        </Button>
      </div>

      <p className="relative mt-6 text-xs text-charcoal-muted md:text-sm">
        Free day includes Jira <strong className="font-medium text-charcoal">or</strong> Slack
        only — no GitHub, no coding.{" "}
        <Link href="#pricing" className="underline underline-offset-2 hover:text-charcoal">
          See all plans
        </Link>
      </p>
    </section>
  );
}
