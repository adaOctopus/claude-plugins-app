import type { ReactNode } from "react";
import {
  ArrowRight,
  AtSign,
  Ban,
  BatteryFull,
  Brain,
  CheckCircle2,
  ClipboardPaste,
  Clock,
  Flame,
  GitPullRequest,
  LayoutDashboard,
  MessageSquare,
  Mic,
  Sparkles,
  ThumbsUp,
  Wand2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { integrationSources } from "@/components/icons/IntegrationMarks";
import { chartGradient, velocityData } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";

const crispeLetters = ["C", "R", "I", "S", "P", "E"] as const;

type Benefit = {
  title: string;
  tagline: string;
  accent: string;
  glow: string;
  visual: ReactNode;
};

function BeforeAfterShell({
  before,
  after,
  payoff,
}: {
  before: ReactNode;
  after: ReactNode;
  payoff?: ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex flex-1 items-stretch gap-1.5 sm:gap-2">
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-border/70 bg-white/60 p-2 opacity-85">
          <span className="mb-1 text-[7px] font-bold uppercase tracking-wide text-charcoal-muted/70">
            Without
          </span>
          {before}
        </div>
        <div className="flex shrink-0 items-center text-charcoal/25">
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-[#7DD3C0]/35 bg-[#E8FAF6]/70 p-2">
          <span className="mb-1 text-[7px] font-bold uppercase tracking-wide text-[#0D9488]">
            coolplugz
          </span>
          {after}
        </div>
      </div>
      {payoff ? (
        <div className="flex justify-center">{payoff}</div>
      ) : null}
    </div>
  );
}

/** Prompt engineering drain → auto CRISPE → mental energy preserved. */
function MentalEnergyVisual() {
  return (
    <BeforeAfterShell
      before={
        <div className="flex flex-col items-center gap-1.5">
          <Brain className="h-5 w-5 text-charcoal/35" strokeWidth={1.75} />
          <div className="w-full space-y-0.5 px-0.5">
            <div className="h-1 w-full rounded-full bg-charcoal/15" />
            <div className="h-1 w-[80%] mx-auto rounded-full bg-charcoal/12" />
            <div className="h-1 w-[65%] mx-auto rounded-full bg-charcoal/10" />
          </div>
          <span className="text-[7px] font-medium text-charcoal-muted">You engineer prompts</span>
        </div>
      }
      after={
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <Brain className="h-5 w-5 text-[#0D9488]" strokeWidth={1.75} />
            <BatteryFull
              className="absolute -bottom-1 -right-2 h-3.5 w-3.5 text-emerald-500"
              strokeWidth={2.5}
            />
          </div>
          <Wand2 className="h-3 w-3 text-[#0D9488]" strokeWidth={2} />
          <div className="flex gap-px">
            {crispeLetters.map((l) => (
              <span
                key={l}
                className="flex h-3 w-2 items-center justify-center rounded-sm bg-[#D1F4EE] text-[5px] font-bold text-[#0D9488]"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      }
      payoff={
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-700">
          <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
          MENTAL CLARITY
        </span>
      }
    />
  );
}

/** CI copy-paste loop → one-shot fix → hours back each week. */
function TimeSavedVisual() {
  const GitHubMark = integrationSources.find((s) => s.id === "github")!.Mark;
  const max = Math.max(...velocityData.map((d) => d.hours));

  return (
    <BeforeAfterShell
      before={
        <div className="flex flex-col items-center gap-1">
          <GitHubMark className="h-4 w-4 opacity-70" />
          <div className="flex items-center gap-0.5">
            <XCircle className="h-3 w-3 text-red-500" strokeWidth={2.5} />
            <span className="rounded bg-red-50 px-1 py-0.5 text-[6px] font-mono text-red-600">
              lint fail
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-charcoal/35">
            <ClipboardPaste className="h-2.5 w-2.5" strokeWidth={2} />
            <span className="text-[6px]">paste → chat → repeat</span>
          </div>
          <Ban className="h-2.5 w-2.5 text-charcoal/25" strokeWidth={2} />
        </div>
      }
      after={
        <div className="flex w-full flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <GitHubMark className="h-3.5 w-3.5" />
            <div className="flex gap-px">
              {[0, 1, 2].map((i) => (
                <CheckCircle2
                  key={i}
                  className="h-2.5 w-2.5 text-emerald-600"
                  strokeWidth={2.5}
                />
              ))}
            </div>
            <GitPullRequest className="h-3 w-3 text-[#0D9488]" strokeWidth={2} />
          </div>
          <div className="flex w-full items-end justify-between gap-0.5 px-0.5">
            {velocityData.slice(0, 5).map(({ day, hours }) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-0.5">
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-[#0D9488] to-[#5EC4B6]"
                  style={{ height: `${(hours / max) * 22}px` }}
                />
                <span className="text-[5px] text-charcoal-muted">{day[0]}</span>
              </div>
            ))}
          </div>
        </div>
      }
      payoff={
        <span className="inline-flex items-center gap-1 rounded-full border border-[#7DD3C0]/40 bg-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#0D9488]">
          <Clock className="h-2.5 w-2.5" strokeWidth={2.5} />
          −10 hrs / week
        </span>
      }
    />
  );
}

/** Slack binge + AI fatigue spiral → one panel, one approve. */
function BurnoutAvoidVisual() {
  const SlackMark = integrationSources.find((s) => s.id === "slack")!.Mark;

  return (
    <BeforeAfterShell
      before={
        <div className="flex flex-col items-center gap-1">
          <SlackMark className="h-4 w-4 opacity-70" />
          <div className="w-full space-y-0.5">
            {[8, 6, 7, 5].map((w, i) => (
              <div
                key={i}
                className="flex items-center gap-0.5"
                style={{ paddingLeft: i * 2 }}
              >
                <div
                  className="h-0.5 rounded-full bg-charcoal/15"
                  style={{ width: `${w * 2.5}px` }}
                />
                {i === 1 && (
                  <AtSign className="h-2 w-2 shrink-0 text-orange-500" strokeWidth={2.5} />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <Flame className="h-3 w-3 text-orange-500" strokeWidth={2} />
            <span className="text-[6px] font-bold uppercase text-orange-600/80">
              Binge-checking
            </span>
          </div>
        </div>
      }
      after={
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-full rounded-md border border-[#7DD3C0]/30 p-1.5"
            style={{ background: `linear-gradient(180deg, ${chartGradient.bg}44, white)` }}
          >
            <div className="flex items-center justify-center gap-1">
              <LayoutDashboard className="h-2.5 w-2.5 text-[#0D9488]" strokeWidth={2} />
              <AtSign className="h-2.5 w-2.5 text-orange-500" strokeWidth={2.5} />
              <span className="text-[6px] font-semibold text-charcoal">2 mentions</span>
            </div>
            <div className="mt-1 flex items-center justify-center gap-0.5 rounded border border-emerald-200 bg-emerald-50 px-1 py-0.5">
              <MessageSquare className="h-2 w-2 text-[#0D9488]" strokeWidth={2} />
              <Mic className="h-2 w-2 text-[#0D9488]" strokeWidth={2} />
              <span className="text-[6px] font-bold text-emerald-700">Draft ready</span>
            </div>
          </div>
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-200 bg-white">
            <ThumbsUp className="h-3 w-3 text-emerald-600" strokeWidth={2.25} />
          </span>
        </div>
      }
      payoff={
        <span className="inline-flex items-center gap-1 rounded-full border border-[#7DD3C0]/40 bg-[#E8FAF6] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#0D9488]">
          Approve &amp; done
        </span>
      }
    />
  );
}

function BenefitCard({ title, tagline, accent, glow, visual }: Benefit) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-b p-4 sm:p-5",
        accent,
        glow
      )}
    >
      <div className="mb-4 flex h-[7rem] items-center sm:h-[7.5rem]">{visual}</div>
      <h3 className="font-serif text-lg text-charcoal md:text-xl">{title}</h3>
      <p className="mt-1 text-sm leading-snug text-charcoal-muted">{tagline}</p>
    </article>
  );
}

const benefits: Benefit[] = [
  {
    title: "Mental energy back",
    tagline:
      "No mental energy spent on doing advanced prompt engineering.",
    accent: "from-[#E8FAF6] to-white",
    glow: "shadow-[0_8px_24px_rgba(13,148,136,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
    visual: <MentalEnergyVisual />,
  },
  {
    title: "Save hours weekly",
    tagline:
      "No back and forth between agent chat and Github copy-pasting CI errors.",
    accent: "from-[#E8F4FF] to-white",
    glow: "shadow-[0_8px_24px_rgba(59,130,246,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
    visual: <TimeSavedVisual />,
  },
  {
    title: "Skip AI fatigue & burnout",
    tagline:
      "Stop binge-checking Slack for @mentions. Threads and DM drafts all in one panel.",
    accent: "from-[#F3EEFF] to-white",
    glow: "shadow-[0_8px_24px_rgba(139,92,246,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
    visual: <BurnoutAvoidVisual />,
  },
];

/** Benefits section — merged visuals tying payoff to prompt, CI, and Slack pain. */
export function BenefitsSection() {
  return (
    <section id="benefits" className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          The Benefits
        </Badge>
        <h2 className="max-w-2xl font-serif text-3xl text-charcoal md:text-4xl">
          Less<span style={{ fontStyle: "italic", fontWeight: "600" }}> cognitive overload</span>{" "}
          for you.
        </h2>
        <p className="mt-2 max-w-lg text-sm text-charcoal-muted">
          The mental drain isn&apos;t coding. It&apos;s prompt engineering, copy-pasting CI errors and chasing Slack
          threads.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {[
            { label: "No prompt grind", emoji: "🧠" },
            { label: "No CI error loops", emoji: "⏱️" },
            { label: "No Slack binge-checking", emoji: "✨" },
          ].map(({ label, emoji }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-gradient-to-b from-white to-cream-warm px-3 py-1.5 text-xs font-medium text-charcoal shadow-[0_2px_8px_rgba(45,41,38,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]"
            >
              <span className="text-sm">{emoji}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
