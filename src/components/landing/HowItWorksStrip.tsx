import type { ReactNode } from "react";
import {
  ArrowRight,
  AtSign,
  Ban,
  CheckCircle2,
  ClipboardPaste,
  GitPullRequest,
  LayoutDashboard,
  MessageSquare,
  Mic,
  Server,
  Sparkles,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  UserRound,
  Wand2,
  XCircle,
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
  visualClassName,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  visualClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center gap-2 sm:min-w-0 sm:flex-1",
        className
      )}
    >
      <div
        className={cn(
          "flex h-[5.5rem] w-full items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-white px-2 shadow-sm sm:h-20",
          visualClassName
        )}
      >
        {children}
      </div>
      <span className="max-w-[9rem] text-center text-[9px] font-semibold uppercase leading-tight tracking-wide text-charcoal-muted sm:max-w-none sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

function BeforeAfterShell({
  before,
  after,
}: {
  before: ReactNode;
  after: ReactNode;
}) {
  return (
    <div className="flex h-full w-full items-stretch gap-1.5 sm:gap-2">
      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-border/70 bg-white/50 p-2 opacity-80">
        <span className="mb-1.5 text-[7px] font-bold uppercase tracking-wide text-charcoal-muted/70">
          Before
        </span>
        {before}
      </div>
      <div className="flex shrink-0 items-center text-charcoal/25">
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-[#7DD3C0]/35 bg-[#E8FAF6]/60 p-2">
        <span className="mb-1.5 text-[7px] font-bold uppercase tracking-wide text-[#0D9488]">
          With coolplugz
        </span>
        {after}
      </div>
    </div>
  );
}

/** Manual prompt typing vs CRISPE auto-engineered — zero effort from you. */
function PromptEngineeringVisual() {
  return (
    <BeforeAfterShell
      before={
        <div className="flex w-full flex-col gap-1">
          <div className="space-y-0.5">
            <div className="h-1 w-full rounded-full bg-charcoal/15" />
            <div className="h-1 w-[85%] rounded-full bg-charcoal/12" />
            <div className="h-1 w-[70%] rounded-full bg-charcoal/10" />
          </div>
          <span className="mt-1 text-[7px] font-medium text-charcoal-muted">
            You craft the prompt…
          </span>
        </div>
      }
      after={
        <div className="flex w-full flex-col items-center gap-1">
          <Wand2 className="h-4 w-4 text-[#0D9488]" strokeWidth={2} />
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
          <span className="flex items-center gap-0.5 text-[7px] font-bold uppercase text-[#0D9488]">
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
            Auto-built
          </span>
        </div>
      }
    />
  );
}

/** CI fail → copy-paste loop vs one-shot fix inside Claude. */
function CiLoopVisual() {
  const GitHubMark = integrationSources.find((s) => s.id === "github")!.Mark;

  return (
    <BeforeAfterShell
      before={
        <div className="flex w-full flex-col items-center gap-1">
          <GitHubMark className="h-3.5 w-3.5 opacity-70" />
          <div className="flex items-center gap-0.5">
            <XCircle className="h-3 w-3 text-red-500" strokeWidth={2.5} />
            <span className="rounded bg-red-50 px-1 py-0.5 text-[6px] font-mono text-red-600">
              lint fail
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-charcoal/30">
            <ClipboardPaste className="h-2.5 w-2.5" strokeWidth={2} />
            <span className="text-[6px]">→ chat → fix → repeat</span>
          </div>
          <Ban className="h-3 w-3 text-charcoal/25" strokeWidth={2} />
        </div>
      }
      after={
        <div className="flex w-full flex-col items-center gap-1">
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
          <GitPullRequest className="h-3 w-3 text-[#0D9488]" strokeWidth={2} />
          <span className="text-[7px] font-bold uppercase text-[#0D9488]">PR ready</span>
        </div>
      }
    />
  );
}

/** Code runs in CoolPlugz env — CI checked there, user does nothing. */
function CiEnvironmentVisual() {
  const GitHubMark = integrationSources.find((s) => s.id === "github")!.Mark;
  const ciChecks = ["lint", "test", "build"] as const;

  return (
    <>
      {/* Mobile — stacked, no overflow */}
      <div className="flex w-full flex-col items-center gap-1.5 sm:hidden">
        <div className="flex items-center gap-1 text-charcoal/35">
          <UserRound className="h-3.5 w-3.5" strokeWidth={2} />
          <ArrowRight className="h-3 w-3 rotate-90" strokeWidth={2} />
          <Server className="h-3.5 w-3.5 text-[#0D9488]" strokeWidth={2.25} />
        </div>
        <div className="w-full rounded-lg border border-[#7DD3C0]/45 bg-gradient-to-b from-[#E8FAF6]/90 to-white p-2">
          <div className="flex flex-wrap items-center justify-center gap-1">
            <GitHubMark className="h-4 w-4 shrink-0" />
            {ciChecks.map((check) => (
              <span
                key={check}
                className="inline-flex items-center gap-0.5 rounded-md border border-emerald-200/80 bg-emerald-50 px-1.5 py-0.5"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-600" strokeWidth={2.5} />
                <span className="font-mono text-[8px] font-semibold uppercase text-emerald-700">
                  {check}
                </span>
              </span>
            ))}
          </div>
          <p className="mt-1.5 text-center text-[8px] font-bold uppercase tracking-wide text-[#0D9488]">
            CI checked in env
          </p>
        </div>
      </div>

      {/* sm+ — horizontal pipeline */}
      <div className="hidden w-full items-center gap-1 sm:flex sm:gap-1.5">
        <div className="flex shrink-0 flex-col items-center gap-0.5 opacity-35">
          <UserRound className="h-3 w-3 text-charcoal" strokeWidth={2} />
          <Ban className="h-2.5 w-2.5 text-charcoal/50" strokeWidth={2.5} />
        </div>

        <ArrowRight className="h-2.5 w-2.5 shrink-0 text-charcoal/20" strokeWidth={2} />

        <div className="min-w-0 flex-1 rounded-md border border-[#7DD3C0]/45 bg-gradient-to-b from-[#E8FAF6]/90 to-white p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="flex items-center gap-0.5">
            <Server className="h-2.5 w-2.5 shrink-0 text-[#0D9488]" strokeWidth={2.25} />
            <span className="truncate text-[5px] font-bold uppercase tracking-wide text-[#0D9488]">
              coolplugz env
            </span>
          </div>

          <div className="mt-0.5 flex items-center gap-0.5 rounded bg-charcoal px-1 py-0.5">
            <Terminal className="h-2 w-2 shrink-0 text-emerald-400/90" strokeWidth={2.5} />
            <span className="truncate font-mono text-[5px] text-emerald-300/95">run &amp; execute</span>
            <span className="ml-auto h-1 w-1 shrink-0 animate-pulse rounded-full bg-emerald-400" />
          </div>

          <div className="mt-0.5 flex flex-wrap items-center justify-center gap-0.5">
            <GitHubMark className="h-2.5 w-2.5 shrink-0 opacity-80" />
            {ciChecks.map((check) => (
              <span
                key={check}
                className="inline-flex items-center gap-px rounded border border-emerald-200/80 bg-emerald-50 px-0.5 py-px"
              >
                <CheckCircle2 className="h-2 w-2 text-emerald-600" strokeWidth={2.5} />
                <span className="font-mono text-[4px] font-semibold uppercase text-emerald-700">
                  {check}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/** Slack thread binge vs mentions + drafts in one panel. */
function SlackUnifiedVisual() {
  const SlackMark = integrationSources.find((s) => s.id === "slack")!.Mark;

  return (
    <BeforeAfterShell
      before={
        <div className="flex w-full flex-col items-center gap-1">
          <SlackMark className="h-3.5 w-3.5 opacity-70" />
          <div className="w-full space-y-0.5">
            {[8, 6, 7, 5].map((w, i) => (
              <div
                key={i}
                className="flex items-center gap-0.5"
                style={{ paddingLeft: i * 3 }}
              >
                <div
                  className="h-0.5 rounded-full bg-charcoal/15"
                  style={{ width: `${w * 3}px` }}
                />
                {i === 1 && (
                  <AtSign className="h-2 w-2 shrink-0 text-orange-500" strokeWidth={2.5} />
                )}
              </div>
            ))}
          </div>
          <span className="text-[7px] font-medium text-charcoal-muted">
            Hunt @mentions…
          </span>
        </div>
      }
      after={
        <div className="flex w-full flex-col items-center gap-1">
          <div
            className="w-full rounded-md border border-[#7DD3C0]/30 p-1.5"
            style={{ background: `linear-gradient(180deg, ${chartGradient.bg}33, white)` }}
          >
            <div className="flex items-center gap-1">
              <LayoutDashboard className="h-2.5 w-2.5 text-[#0D9488]" strokeWidth={2} />
              <AtSign className="h-2.5 w-2.5 text-orange-500" strokeWidth={2.5} />
              <span className="text-[6px] font-semibold text-charcoal">2 mentions</span>
            </div>
            <div className="mt-1 flex items-center gap-0.5 rounded border border-[#7DD3C0]/25 bg-white px-1 py-0.5">
              <MessageSquare className="h-2 w-2 text-[#0D9488]" strokeWidth={2} />
              <Mic className="h-2 w-2 text-[#0D9488]" strokeWidth={2} />
              <span className="text-[6px] text-charcoal-muted">Draft ready</span>
            </div>
          </div>
          <span className="text-[7px] font-bold uppercase text-[#0D9488]">One place</span>
        </div>
      }
    />
  );
}

function ValueCard({
  title,
  description,
  visual,
  accent,
}: {
  title: string;
  description: string;
  visual: ReactNode;
  accent: string;
}) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-b p-4 sm:p-5",
        accent,
        "shadow-[0_8px_24px_rgba(13,148,136,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]"
      )}
    >
      <div className="mb-4 h-[5.5rem] sm:h-[6rem]">{visual}</div>
      <h3 className="font-serif text-base text-charcoal md:text-lg">{title}</h3>
      <p className="mt-1 text-sm leading-snug text-charcoal-muted">{description}</p>
    </article>
  );
}

const valueProps = [
  {
    title: "Prompt engineering done for you",
    description:
      "Advanced CRISPE-style prompts are engineered automatically — you never write or refine them yourself.",
    visual: <PromptEngineeringVisual />,
    accent: "from-[#E8FAF6] to-white",
  },
  {
    title: "No CI errors copy-paste loop",
    description:
      "GitHub checks run, failures get fixed, and the PR moves forward, without going back and forth between agent chat and Github.",
    visual: <CiLoopVisual />,
    accent: "from-[#E8F4FF] to-white",
  },
  {
    title: "No binge-checking Slack threads",
    description:
      "No more hunting slack @mentions. Thread mentions, DMs, and tone-matched drafts done in one panel.",
    visual: <SlackUnifiedVisual />,
    accent: "from-[#FFF4E8] to-white",
  },
];

/** Compact visual pipeline — how coolplugz works, icons only. */
export function HowItWorksStrip() {
  const SlackMark = integrationSources.find((s) => s.id === "slack")!.Mark;

  return (
    <section
      id="how"
      aria-label="How coolplugz works"
      className="border-y border-border/60 bg-cream-warm/40 px-4 py-12 md:px-8 md:py-14"
    >
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          The Real Benefit
        </Badge>
        <h2 className="max-w-2xl font-serif text-3xl text-charcoal md:text-4xl">
          Engineers in{" "}
          <strong style={{ fontStyle: "italic", fontWeight: "600" }}>God Mode</strong>.
        </h2>
        <p className="mt-2 max-w-xl text-sm text-charcoal-muted">
          Instead of context switching you just say RUN in Claude. That's it. Saves dozens of hrs🔥
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:flex sm:items-start sm:justify-between sm:gap-0 md:mt-10">
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

          <HowStep label="WRITES FULL-CONTEXT PROMPTS">
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

          <HowStep
            label="Ships code with CI checked"
            visualClassName="h-[6.5rem] sm:h-[5.5rem]"
          >
            <CiEnvironmentVisual />
          </HowStep>

          <StepConnector />

          <HowStep label="Drafts tone-matched messages">
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

          <HowStep label="Claude panel" className="col-span-2 mx-auto w-full max-w-[12rem] sm:col-span-1 sm:max-w-none">
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
{/* 
        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:mt-12">
          {valueProps.map((prop) => (
            <ValueCard key={prop.title} {...prop} />
          ))}
        </div> */}
      </div>
    </section>
  );
}
