import type { ReactNode } from "react";
import {
  CheckCircle2,
  GitPullRequest,
  LayoutDashboard,
  MessageSquare,
  Mic,
  ThumbsDown,
  ThumbsUp,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { integrationSources } from "@/components/icons/IntegrationMarks";
import { chartGradient } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";

const crispeLetters = ["C", "R", "I", "S", "P", "E"] as const;

function StepConnector() {
  return (
    <div
      aria-hidden
      className="hidden shrink-0 items-center self-center px-0.5 sm:flex md:px-1"
    >
      <div className="h-px w-3 bg-[#7DD3C0]/50 md:w-5" />
    </div>
  );
}

function HowStep({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[5.5rem] flex-1 flex-col items-center gap-2 sm:min-w-0",
        className
      )}
    >
      <div className="flex h-[4.5rem] w-full items-center justify-center rounded-xl border border-border/80 bg-white px-2 shadow-sm sm:h-20">
        {children}
      </div>
      <span className="text-center text-[9px] font-semibold uppercase tracking-wide text-charcoal-muted sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

/** Compact visual pipeline — how plugsville works, icons only. */
export function HowItWorksStrip() {
  const GitHubMark = integrationSources.find((s) => s.id === "github")!.Mark;
  const SlackMark = integrationSources.find((s) => s.id === "slack")!.Mark;

  return (
    <section
      id="how"
      aria-label="How plugsville works"
      className="border-y border-border/60 bg-cream-warm/40 px-4 py-12 md:px-8 md:py-14"
    >
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          What Is It?
        </Badge>
        <h2 className="max-w-2xl font-serif text-3xl text-charcoal md:text-4xl">
          A Claude plugin that puts you in <strong style={{ fontStyle: "italic", fontWeight: "600" }}>God Mode</strong>.
        </h2>
        <p className="mt-2 max-w-xl text-sm text-charcoal-muted">
          6 Agents working in parallel to fetch context, engineer prompts, and handle both CI & Slack. You just approve or click redo.
        </p>

        <div className="mt-8 flex items-start justify-between gap-1 overflow-x-auto pb-1 sm:gap-0 md:mt-10 md:overflow-visible">
          {/* 1 — Fetch context from stack */}
          <HowStep label="Gathers context automatically">
            <div className="grid grid-cols-2 gap-1">
              {integrationSources.map(({ id, Mark }) => (
                <span
                  key={id}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-cream/80"
                >
                  <Mark className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          </HowStep>

          <StepConnector />

          {/* 2 — CRISPE prompt engineering */}
          <HowStep label="Engineers prompts for you">
            <div className="flex flex-col items-center gap-1">
              <Wand2 className="h-3.5 w-3.5 text-[#0D9488]" strokeWidth={2} />
              <div className="flex gap-px">
                {crispeLetters.map((l) => (
                  <span
                    key={l}
                    className="flex h-3.5 w-2.5 items-center justify-center rounded-sm bg-[#D1F4EE] text-[6px] font-bold text-[#0D9488]"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </HowStep>

          <StepConnector />

          {/* 3 — GitHub CI, PR reviews, comments */}
          <HowStep label="CI & reviews checked">
            <div className="flex flex-col items-center gap-1">
              <GitHubMark className="h-3.5 w-3.5" />
              <div className="flex items-center gap-0.5">
                {[0, 1, 2].map((i) => (
                  <CheckCircle2
                    key={i}
                    className="h-2.5 w-2.5 text-emerald-600"
                    strokeWidth={2.5}
                  />
                ))}
              </div>
              <GitPullRequest className="h-3 w-3 text-charcoal/50" strokeWidth={2} />
            </div>
          </HowStep>

          <StepConnector />

          {/* 4 — Slack threads, actions, tone-matched drafts */}
          <HowStep label="Message Drafts tone-matched">
            <div className="flex flex-col items-center gap-1">
              <SlackMark className="h-3.5 w-3.5" />
              <div className="space-y-0.5">
                <div className="h-0.5 w-8 rounded-full bg-border" />
                <div className="h-0.5 w-6 rounded-full bg-border/70" />
              </div>
              <div className="flex items-center gap-0.5 rounded-md border border-[#7DD3C0]/30 bg-[#E8FAF6]/80 px-1 py-0.5">
                <MessageSquare className="h-2.5 w-2.5 text-[#0D9488]" strokeWidth={2} />
                <Mic className="h-2.5 w-2.5 text-[#0D9488]" strokeWidth={2} />
              </div>
            </div>
          </HowStep>

          <StepConnector />

          {/* 5 — Control panel inside Claude */}
          <HowStep label="Claude panel">
            <div
              className="flex w-full flex-col gap-1 rounded-lg border border-[#7DD3C0]/25 p-1.5"
              style={{
                background: `linear-gradient(180deg, ${chartGradient.bg}44, white)`,
              }}
            >
              <div className="flex items-center gap-1">
                <LayoutDashboard className="h-2.5 w-2.5 text-[#0D9488]" strokeWidth={2} />
                <div className="h-1 flex-1 rounded-full bg-emerald-400/60" />
              </div>
              <div className="flex gap-1">
                <span className="flex flex-1 items-center justify-center gap-0.5 rounded border border-emerald-200 bg-emerald-50 py-0.5 text-[7px] font-bold text-emerald-700">
                  <ThumbsUp className="h-2 w-2" strokeWidth={2.5} />
                  OK
                </span>
                <span className="flex flex-1 items-center justify-center gap-0.5 rounded border border-border bg-white py-0.5 text-[7px] font-bold text-charcoal-muted">
                  <ThumbsDown className="h-2 w-2" strokeWidth={2.5} />
                  Redo
                </span>
              </div>
            </div>
          </HowStep>
        </div>
      </div>
    </section>
  );
}
