import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  GitPullRequest,
  ShieldCheck,
  Sparkles,
  Wand2,
  XCircle,
  Zap,
} from "lucide-react";
import { ClaudeMark } from "@/components/icons/ClaudeMark";
import { integrationSources, SlackMark } from "@/components/icons/IntegrationMarks";
import { chartGradient } from "@/lib/chart-colors";

const COOLPLUGZ_FAVICON = "/icon.png";
const DASHBOARD_SHORTLINK = "coolplugz.dash/···12v4";

type MarkProps = { className?: string };

function IntegrationLogo({
  Mark,
  className = "h-3 w-3",
}: {
  Mark: ComponentType<MarkProps>;
  className?: string;
}) {
  return <Mark className={className} />;
}

/** Hero right column — one card, chat top + summary bottom. */
export function HeroDashboard() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-white shadow-[0_12px_48px_rgba(45,41,38,0.08)]">
      <ClaudeChrome />

      <div className="border-b border-border bg-[#FAFAF8] p-3.5 sm:p-4">
        <HeroChatBody />
      </div>

      <div className="bg-cream-warm/60 p-3.5 sm:p-4">
        <HeroRunSummaryBody />
      </div>

      {/* <p className="border-t border-border/60 bg-[#FAFAF8] px-4 py-2.5 text-[10px] leading-snug text-charcoal-muted">
        <span className="font-medium text-charcoal/80">Skipped:</span> tab-hopping · Slack scroll ·
        status updates
      </p> */}
    </div>
  );
}

function ClaudeChrome() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-white px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <ClaudeAvatar className="h-7 w-7 p-1.5" />
        <div className="leading-none">
          <p className="text-xs font-semibold text-charcoal">Claude</p>
          <p className="text-[10px] text-charcoal-muted">Sonnet · New chat</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7DD3C0]/40 bg-[#E8FAF6] px-2.5 py-1 text-[9px] font-semibold text-[#0D9488]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        coolplugz MCP
      </span>
    </div>
  );
}

function HeroChatBody() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-end">
        <div className="rounded-2xl rounded-tr-sm bg-charcoal px-3 py-2 text-[12px] leading-snug text-cream sm:text-[13px]">
          Hi <span className="font-semibold">Cooplugz👋</span> Show my dashboard and run a <span className="font-semibold" style={{ fontStyle: "italic" }}>@FullRun</span> for me. Thnx
        </div>
      </div>

      <div className="flex gap-2">
        <CoolplugzAvatar className="mt-0.5 h-6 w-6" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[12px] leading-snug text-charcoal sm:text-[13px]">
            <span className="font-semibold">coolplugz</span> — run complete ✅
          </p>

          <div className="overflow-hidden rounded-xl border border-[#7DD3C0]/35 bg-white shadow-sm">
            <div
              className="flex items-center justify-between gap-2 border-b border-[#7DD3C0]/20 px-3 py-2"
              style={{ background: `linear-gradient(90deg, ${chartGradient.bg}55, #fff)` }}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#0D9488]" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-charcoal">
                  TASKS DELIVERED
                </span>
              </div>
              <span className="font-mono text-[9px] font-medium text-charcoal-muted">7m 12s</span>
            </div>

            <div className="space-y-2 p-3">
              <RunLine icon={ShieldCheck} label="4 sources scanned, context fetched">
                <div className="flex gap-1">
                  {integrationSources.map(({ id, Mark }) => (
                    <span
                      key={id}
                      className="inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-white"
                    >
                      <IntegrationLogo Mark={Mark} className="h-2.5 w-2.5" />
                    </span>
                  ))}
                </div>
              </RunLine>

              <RunLine icon={Wand2} label="Prompts written">
                <span className="rounded border border-[#7DD3C0]/40 bg-[#E8FAF6] px-2 py-0.5 text-[9px] font-bold text-[#0D9488]">
                  CRISPE
                </span>
              </RunLine>

              <RunLine icon={Zap} label="Github synced & CI pass">
                <span className="text-[9px] font-semibold text-emerald-700">PR #847 open</span>
              </RunLine>

              <SlackHandledCard compact />

              <div className="flex items-center gap-1.5 pt-1">
                <ArrowRight className="h-3 w-3 shrink-0 text-[#0D9488]" strokeWidth={2.5} />
                <DashboardShortlink />
              </div>

              <div className="flex gap-1.5 pt-1">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2 text-[11px] font-semibold text-white shadow-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Approve &amp; submit
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-full border border-border bg-white px-3 py-2 text-[11px] font-medium text-charcoal"
                >
                  <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroRunSummaryBody() {
  return (
    <div className="flex flex-col gap-3">
      {/* <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-charcoal">What happened</p>
        <p className="text-[9px] text-charcoal-muted">Under the hood · one run</p>
      </div> */}

      {/* <div className="grid grid-cols-3 gap-2">
        <PipelineNode title="Context" subtitle="4 sources">
          <div className="flex -space-x-1">
            {integrationSources.map(({ id, Mark }) => (
              <span
                key={id}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-white bg-white shadow-sm ring-2 ring-cream-warm"
              >
                <IntegrationLogo Mark={Mark} className="h-3 w-3" />
              </span>
            ))}
          </div>
        </PipelineNode>

        <PipelineNode title="Prompts" subtitle="CRISPE">
          <div className="flex items-center gap-1 rounded-md border border-[#7DD3C0]/40 bg-white px-2 py-1">
            <Wand2 className="h-3 w-3 text-[#0D9488]" strokeWidth={2} />
            <span className="text-[8px] font-bold text-[#0D9488]">CRISPE</span>
          </div>
        </PipelineNode>

        <PipelineNode title="Shipped" subtitle="PR · CI">
          <div className="flex items-center gap-1">
            <GitPullRequest className="h-3 w-3 text-[#0D9488]" strokeWidth={2} />
            <CheckCircle2 className="h-3 w-3 text-emerald-600" strokeWidth={2.5} />
          </div>
        </PipelineNode>
      </div> */}

      <div className="grid grid-cols-3 gap-2">
        <StatCell label="Run time" value="7m 12s" tone="sky" />
        <StatCell label="PR #847 & CI Pass" value="Done✅" tone="mint" />
        <StatCell label="PROJ-124" value="Done✅" tone="emerald" />
      </div>
    </div>
  );
}

function DashboardShortlink() {
  return (
    <span
      className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full border border-[#7DD3C0]/45 px-2.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
      style={{ background: `linear-gradient(90deg, ${chartGradient.bg}, #fff 85%)` }}
    >
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#0D9488]/10">
        <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488]" />
      </span>
      <span className="truncate font-mono text-[10px] font-semibold tracking-tight text-[#0D9488]">
        {DASHBOARD_SHORTLINK}
      </span>
      <span className="shrink-0 rounded-full bg-charcoal/5 px-1.5 py-px text-[7px] font-bold uppercase tracking-wider text-charcoal-muted">
        GO TO DASHBOARD
      </span>
    </span>
  );
}

function ClaudeAvatar({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F4F3EE] p-1.5 ${className ?? ""}`}
    >
      <ClaudeMark className="h-full w-full" />
    </span>
  );
}

function CoolplugzAvatar({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-lg border border-border/60 bg-white shadow-sm ${className ?? "h-6 w-6"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={COOLPLUGZ_FAVICON} alt="" className="h-full w-full object-cover" />
    </span>
  );
}

function SlackHandledCard({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="rounded-lg border border-[#E8DEFF]/70 bg-gradient-to-r from-[#FAF8FF] to-white px-2.5 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <SlackMark className="h-3 w-3 shrink-0" />
            <span className="text-[9px] font-bold uppercase tracking-wide text-[#611F69]">
              Slack handled
            </span>
          </div>
          <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" strokeWidth={2.5} />
        </div>
        <p className="mt-1 text-[9px] text-charcoal-muted">3 threads scanned · 2 replies drafted</p>
        <p className="mt-0.5 truncate text-[9px] text-[#0D9488]">
          @alex → &quot;PR open, middleware ships today&quot;
        </p>
      </div>
    );
  }

  return null;
}

function RunLine({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-[#0D9488]" strokeWidth={2.5} />
        <span className="text-[9px] font-bold uppercase tracking-wide text-[#0D9488]">{label}</span>
        <CheckCircle2 className="h-3 w-3 text-emerald-600" strokeWidth={2.5} />
      </div>
      {children}
    </div>
  );
}

function PipelineNode({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-white/90 bg-white px-2 py-2 text-center shadow-sm">
      <div className="flex h-7 items-center justify-center">{children}</div>
      <p className="mt-1.5 text-[10px] font-bold leading-tight text-charcoal">{title}</p>
      <p className="text-[8px] text-charcoal-muted">{subtitle}</p>
    </div>
  );
}

const statToneStyles = {
  sky: {
    background: `linear-gradient(135deg, ${chartGradient.top}cc, ${chartGradient.bg})`,
    borderColor: `${chartGradient.border}55`,
    valueClass: "text-charcoal",
  },
  mint: {
    background: `linear-gradient(135deg, ${chartGradient.bg}, ${chartGradient.bottom})`,
    borderColor: `${chartGradient.border}70`,
    valueClass: "text-emerald-700",
  },
  emerald: {
    background: `linear-gradient(135deg, ${chartGradient.bottom}bb, ${chartGradient.mid}99)`,
    borderColor: `${chartGradient.accent}66`,
    valueClass: "text-[#0D9488]",
  },
} as const;

function StatCell({
  label,
  value,
  tone = "sky",
}: {
  label: string;
  value: string;
  tone?: keyof typeof statToneStyles;
}) {
  const style = statToneStyles[tone];

  return (
    <div
      className="rounded-lg border px-2 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
      style={{ background: style.background, borderColor: style.borderColor }}
    >
      <p className="text-[8px] font-bold uppercase tracking-wider text-charcoal-muted">{label}</p>
      <p className={`mt-0.5 font-mono text-sm font-semibold ${style.valueClass}`}>{value}</p>
    </div>
  );
}
