import type { ReactNode } from "react";
import {
  CheckCircle2,
  FileCode2,
  GitBranch,
  GitPullRequest,
  MessageSquare,
  Ticket,
  Wand2,
} from "lucide-react";
import { chartGradient } from "@/lib/chart-colors";

const weekBars = [
  { day: "M", height: 100 },
  { day: "T", height: 72 },
  { day: "W", height: 48 },
  { day: "Th", height: 28 },
  { day: "F", height: 14 },
] as const;

const sources = [
  { icon: Ticket, label: "Jira" },
  { icon: MessageSquare, label: "Slack" },
  { icon: GitBranch, label: "GitHub" },
] as const;

const crispeLetters = ["C", "R", "I", "S", "P", "E"] as const;

/** Prompt engineering — light, minimal 4-step strip. */
function PromptEngineeringPanel() {
  return (
    <div
      className="border-t border-[#7DD3C0]/25 px-4 py-4 sm:px-5"
      style={{
        background: `linear-gradient(180deg, ${chartGradient.bottom}33 0%, #F9F8F6 100%)`,
      }}
    >
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#0D9488]">
        Prompt engineering
      </p>

      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Context */}
        <StepCard label="Context-engineered">
          <div className="flex gap-1">
            {[Ticket, MessageSquare, GitBranch].map((Icon, i) => (
              <span
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white"
              >
                <Icon className="h-3.5 w-3.5 text-[#0D9488]" strokeWidth={2} />
              </span>
            ))}
          </div>
        </StepCard>

        <Connector />

        {/* CRISPE */}
        <StepCard label="CRISPE">
          <div className="flex items-center gap-1 rounded-lg border border-[#7DD3C0]/40 bg-white px-2 py-1.5">
            <Wand2 className="h-3.5 w-3.5 text-[#0D9488]" strokeWidth={2} />
            <div className="flex gap-px">
              {crispeLetters.map((l) => (
                <span
                  key={l}
                  className="flex h-4 w-3 items-center justify-center rounded-sm bg-[#D1F4EE] text-[7px] font-bold text-[#0D9488]"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </StepCard>

        <Connector />

        {/* CI */}
        <StepCard label="CI ✓">
          <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5">
            <GitPullRequest className="h-3.5 w-3.5 text-[#0D9488]" strokeWidth={2} />
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <CheckCircle2
                  key={i}
                  className="h-3 w-3 text-emerald-600"
                  strokeWidth={2.5}
                />
              ))}
            </div>
          </div>
        </StepCard>

        <Connector />

        {/* Output */}
        <StepCard label="Done">
          <div className="relative rounded-lg border border-emerald-200 bg-white px-2.5 py-2">
            <FileCode2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
            <div className="mt-1 space-y-0.5">
              <div className="h-0.5 w-8 rounded-full bg-emerald-400/70" />
              <div className="h-0.5 w-5 rounded-full bg-border" />
            </div>
            <CheckCircle2
              className="absolute -right-1 -top-1 h-3 w-3 text-emerald-600"
              strokeWidth={2.5}
            />
          </div>
        </StepCard>
      </div>
    </div>
  );
}

function StepCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <div className="flex h-11 w-full items-center justify-center">{children}</div>
      <span className="text-[9px] font-semibold text-charcoal-muted sm:text-[10px]">{label}</span>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex w-2 shrink-0 items-center sm:w-2.5">
      <div className="h-px w-full bg-[#7DD3C0]/40" />
    </div>
  );
}

/** Hero right column — visual outcome dashboard for engineers. */
export function HeroDashboard() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#7DD3C0]/35 bg-white shadow-[0_8px_40px_rgba(45,41,38,0.07)]">
      {/* Hours saved */}
      <div
        className="px-4 pb-4 pt-4 sm:px-5 sm:pt-5"
        style={{
          background: `linear-gradient(145deg, ${chartGradient.bg} 0%, ${chartGradient.bottom} 100%)`,
        }}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#0D9488]">
              Hours saved
            </p>
            <p className="mt-0.5 font-serif text-4xl leading-none text-charcoal">−6 hrs</p>
          </div>

          <div className="flex h-[4rem] w-full max-w-[10rem] items-end justify-end gap-1.5">
            {weekBars.map((bar, i) => (
              <div
                key={i}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                <div
                  className="w-full min-h-[3px] rounded-t-md"
                  style={{
                    height: `${bar.height}%`,
                    background: `linear-gradient(to top, ${chartGradient.accent}, ${chartGradient.top})`,
                    opacity: 0.4 + (bar.height / 100) * 0.6,
                  }}
                />
                <span className="text-[8px] text-charcoal/40">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {sources.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/75 px-2 py-0.5 text-[10px] font-medium text-charcoal"
            >
              <Icon className="h-3 w-3 text-[#0D9488]" strokeWidth={2} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* AI run — synced with all sources, stress free */}
      <div className="flex items-center justify-between gap-3 border-t border-[#7DD3C0]/20 bg-cream-warm px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-30" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <p className="font-serif text-lg leading-tight text-charcoal sm:text-xl">
              AI run fully synced with 
            </p>
          </div>
          <p className="mt-1 pl-4 text-[10px] font-medium text-[#0D9488] sm:text-[11px]">
            Slack · Jira · GitHub ·{" "}
            <span className="italic text-charcoal/70">no extra actions needed, relax</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {sources.map(({ icon: Icon }, i) => (
            <span
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200/80 bg-white shadow-sm"
            >
              <Icon className="h-3 w-3 text-emerald-600" strokeWidth={2} />
            </span>
          ))}
          <CheckCircle2 className="ml-0.5 h-4 w-4 text-emerald-600" strokeWidth={2} />
        </div>
      </div>

      <PromptEngineeringPanel />
    </div>
  );
}
