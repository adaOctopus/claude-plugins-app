import type { ComponentType, ReactNode } from "react";
import {
  CheckCircle2,
  Clock,
  FileCode2,
  GitPullRequest,
  Ticket,
  Wand2,
} from "lucide-react";
import { integrationSources } from "@/components/icons/IntegrationMarks";
import { chartGradient } from "@/lib/chart-colors";

const crispeLetters = ["C", "R", "I", "S", "P", "E"] as const;

const ciChecks = ["lint", "tests", "build"] as const;

type MarkProps = { className?: string };

function IntegrationLogo({
  Mark,
  size = "md",
}: {
  Mark: ComponentType<MarkProps>;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return <Mark className={sizeClass} />;
}

/** Single source tile — logo + scanned check. */
function ScannedSourceTile({
  Mark,
  label,
}: {
  Mark: ComponentType<MarkProps>;
  label: string;
}) {
  return (
    <div className="relative flex min-w-[4rem] flex-col items-center gap-1.5" title={`${label} scanned`}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/90 bg-white shadow-sm sm:h-12 sm:w-12">
        <IntegrationLogo Mark={Mark} size="md" />
        <CheckCircle2
          className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-white text-emerald-600"
          strokeWidth={2.5}
        />
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-charcoal/70">
        {label}
      </span>
    </div>
  );
}

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
        <StepCard label="Context-engineered">
          <div className="flex gap-1">
            {integrationSources.map(({ id, Mark }) => (
              <span
                key={id}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white"
              >
                <IntegrationLogo Mark={Mark} size="sm" />
              </span>
            ))}
          </div>
        </StepCard>

        <Connector />

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

function OutcomeMetric({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#0D9488]">{label}</p>
      <p className="mt-0.5 font-serif text-3xl leading-none text-charcoal sm:text-4xl">{value}</p>
      {sub ? <p className="mt-1 text-[10px] font-medium text-charcoal-muted">{sub}</p> : null}
    </div>
  );
}

function OutcomeStatusCard({
  icon: Icon,
  title,
  detail,
  children,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  detail: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-white/80 bg-white/90 px-2.5 py-2 shadow-sm">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 shrink-0 text-[#0D9488]" strokeWidth={2} />
        <span className="truncate text-[10px] font-bold uppercase tracking-wide text-charcoal">
          {title}
        </span>
      </div>
      <p className="mt-1 truncate text-[10px] text-charcoal-muted">{detail}</p>
      {children ? <div className="mt-1.5">{children}</div> : null}
    </div>
  );
}

/** Top panel — concrete run outcomes instead of generic hours saved. */
function TodayOutcomesPanel() {
  return (
    <div
      className="px-4 pb-4 pt-4 sm:px-5 sm:pt-5"
      style={{
        background: `linear-gradient(145deg, ${chartGradient.bg} 0%, ${chartGradient.bottom} 100%)`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <OutcomeMetric
          label="Task completed"
          value="7 mins"
          sub="PROJ-124 · Context fetched from Jira, Github, Slack & Notion"
        />
        <OutcomeMetric
          label="Today saved"
          value="2.5 hrs"
          sub=""
          className="text-right"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <OutcomeStatusCard icon={Clock} title="Delivered" detail="Run complete · 7m 12s">
          <div className="h-1.5 overflow-hidden rounded-full bg-emerald-100">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-[#0D9488] to-emerald-400" />
          </div>
        </OutcomeStatusCard>

        <OutcomeStatusCard icon={GitPullRequest} title="Github CI pass" detail="PR #847 · CI green">
          <div className="flex flex-wrap gap-1">
            {ciChecks.map((check) => (
              <span
                key={check}
                className="inline-flex items-center gap-0.5 rounded-md border border-emerald-200 bg-emerald-50 px-1 py-0.5 text-[8px] font-bold uppercase text-emerald-800"
              >
                <CheckCircle2 className="h-2 w-2" strokeWidth={2.5} />
                {check}
              </span>
            ))}
          </div>
        </OutcomeStatusCard>

        <OutcomeStatusCard icon={Ticket} title="Jira done" detail="PROJ-124 → Done">
          <span className="inline-flex items-center gap-1 rounded-md border border-[#7DD3C0]/40 bg-[#E8FAF6] px-1.5 py-0.5 text-[8px] font-bold uppercase text-[#0D9488]">
            <CheckCircle2 className="h-2 w-2" strokeWidth={2.5} />
            Moved to Review
          </span>
        </OutcomeStatusCard>
      </div>
    </div>
  );
}

/** Hero right column — visual outcome dashboard for engineers. */
export function HeroDashboard() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#7DD3C0]/35 bg-white shadow-[0_8px_40px_rgba(45,41,38,0.07)]">
      <TodayOutcomesPanel />

      {/* Context scan — visual only, no tool names in copy */}
      <div className="border-t border-[#7DD3C0]/20 bg-cream-warm px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-30" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <p className="font-serif text-lg leading-tight text-charcoal sm:text-xl">
                AI Executed tasks with full context fetched
              </p>
            </div>
            <p className="mt-1 pl-4 text-[10px] font-medium text-[#0D9488] sm:text-[11px]">
              from Jira tickets, Github comments, Slack threads, and Notion docs ·{" "}
              <span className="italic text-charcoal/70"></span>
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
            100% synced
          </span>
        </div>

        <div className="relative mt-4 flex items-center justify-between gap-1 sm:justify-center sm:gap-3">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[12%] right-[12%] top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent sm:block"
          />
          {integrationSources.map(({ id, label, Mark }) => (
            <ScannedSourceTile key={id} Mark={Mark} label={label} />
          ))}
        </div>
      </div>

      <PromptEngineeringPanel />
    </div>
  );
}
