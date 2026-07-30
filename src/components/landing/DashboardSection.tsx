"use client";

import type { ReactNode } from "react";
import { ClaudeMark } from "@/components/icons/ClaudeMark";
import { CoolplugzChatAvatar } from "@/components/brand/CoolplugzMark";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NotionMark } from "@/components/icons/NotionMark";
import {
  AtSign,
  CheckCircle2,
  FileCode2,
  GitBranch,
  GitMerge,
  GitPullRequest,
  MessageSquare,
  Mic,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Ticket,
  Wand2,
  XCircle,
} from "lucide-react";
import { ClientOnly } from "@/components/ui/client-only";
import { chartGradient, speedComparisonData } from "@/lib/chart-colors";

/** Dashboard mock — in-Claude approve/reject, context, CI, and redo flow. */
export function DashboardSection() {
  return (
    <section id="dashboard" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          Everything From Inside Claude
        </Badge>
        <h2 className="max-w-2xl font-serif text-3xl text-charcoal md:text-5xl">
          <span style={{ fontStyle: "italic", fontWeight: "600" }}>Bye-bye</span> context switching👋
        </h2>

        {/* Row 1 — Claude session + side panel */}
        <div className="mt-10 grid gap-6 lg:grid-cols-5 lg:items-start">
          <ClaudeChatMock />
          <DashboardSidePanel className="lg:col-span-2" />
        </div>
      </div>
    </section>
  );
}

/** Realistic Claude chat mock — coolplugz run card with clear status checkpoints. */
function ClaudeChatMock() {
  return (
    <Card className="overflow-hidden border-border shadow-md lg:col-span-3">
      {/* Claude app chrome */}
      <div className="flex items-center justify-between border-b border-border bg-white px-4 py-2.5">
        <div className="flex items-center gap-2.5">
  
          <ClaudeMark className="h-4 w-4" />
          <div>
            <p className="text-sm font-semibold text-charcoal">Claude</p>
            <p className="text-[10px] text-charcoal-muted">Sonnet · New chat</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7DD3C0]/40 bg-[#E8FAF6] px-2.5 py-1 text-[10px] font-semibold text-[#0D9488]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          coolplugz MCP
        </span>
      </div>

      <CardContent className="space-y-4 bg-[#FAFAF8] p-4 sm:p-5">
        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-charcoal px-3.5 py-2.5 text-sm leading-snug text-cream">
            Hi <span className="font-semibold">Cooplugz👋</span> Run my tasks and show my dashboard. Thnx
          </div>
        </div>

        {/* Claude response */}
        <div className="flex gap-2.5">
          <CoolplugzChatAvatar className="mt-0.5 h-7 w-7 shrink-0" />
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-sm leading-relaxed text-charcoal">
              <strong>coolplugz</strong> finished the run 🎉 Everything is structured, CI-checked, and
              what <strong style={{ fontStyle: "italic" }}>@Edouard</strong> shared in team's channel was used too.
            </p>

            {/* coolplugz run card embedded in chat */}
            <div className="overflow-hidden rounded-xl border border-[#7DD3C0]/35 bg-white shadow-sm">
              <div
                className="flex items-center justify-between border-b border-[#7DD3C0]/20 px-3.5 py-2"
                style={{ background: `linear-gradient(90deg, ${chartGradient.bg}66, #fff)` }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#0D9488]" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-charcoal">
                    coolplugz · dashboard preview
                  </span>
                </div>
                <span className="rounded-full bg-grey-400 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-800">
                  GO TO DASHBOARD
                </span>
              </div>

              <div className="space-y-3 p-3.5">
                {/* Context synced */}
                <RunSection label="Context synced" icon={ShieldCheck}>
                  <div className="flex flex-wrap gap-1">
                    <ContextPill icon={Ticket} label="Jira PROJ-124" />
                    <ContextPill icon={MessageSquare} label="Slack #backend" />
                    <ContextPill icon={GitBranch} label="GitHub main" />
                    <ContextPill
                      label="Notion spec"
                      logo={<NotionMark className="h-3 w-3 text-charcoal" />}
                    />
                  </div>
                </RunSection>

                {/* Prompts structured */}
                <RunSection label="Prompts structured · CRISPE" icon={Wand2}>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["C", "R", "I", "S", "P", "E"].map((l) => (
                      <span
                        key={l}
                        className="flex h-5 w-5 items-center justify-center rounded-md bg-[#D1F4EE] text-[9px] font-bold text-[#0D9488]"
                      >
                        {l}
                      </span>
                    ))}
                    <span className="text-[10px] font-medium text-emerald-900">
                    CLICK TO VIEW PROMPT
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <ToolPill icon={Terminal} label="cursor-cli" />
                    <ToolPill icon={Terminal} label="claude-code" />
                  </div>
                </RunSection>

                {/* Deliverables checklist */}
                <div className="rounded-lg border border-border bg-cream-warm/60 p-2.5">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-charcoal-muted">
                    Deliverables
                  </p>
                  <div className="space-y-1.5">
                    <DeliverableRow
                      icon={FileCode2}
                      label="Coding task done"
                      detail="Auth middleware implemented + pushed"
                      status="done"
                    />
                    <DeliverableRow
                      icon={GitPullRequest}
                      label="CI pass"
                      detail="lint · tests · build — all green"
                      status="done"
                      badges={["lint", "tests", "build"]}
                    />
                    <DeliverableRow
                      icon={GitMerge}
                      label="Ready to merge"
                      detail="PR #142 · no conflicts · reviewers notified"
                      status="done"
                    />
                    <DeliverableRow
                      icon={MessageSquare}
                      label="Slack messages drafted"
                      detail="Reply to @alex + standup — from synced context"
                      status="done"
                    />
                  </div>
                </div>

                {/* Approve / reject — only user action */}
                <div className="rounded-xl border-2 border-emerald-300/80 bg-emerald-50/50 p-3">
                  <p className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-wide text-emerald-900">
                    Your only action - right here in chat
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve &amp; submit
                    </button>
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-charcoal shadow-sm"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject &amp; redo
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[9px] text-charcoal-muted">
                    Approve merges PR, posts Slack drafts, closes Jira ticket
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disabled input — reinforces "no prompting needed" */}
        {/* <div className="flex items-center gap-2 rounded-xl border border-dashed border-border/80 bg-white/60 px-3 py-2.5 opacity-60">
          <div className="h-8 flex-1 rounded-lg bg-cream-warm px-3 text-[11px] leading-8 text-charcoal-muted">
            No prompting needed — approve or reject above
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}

function ClaudeAvatar({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D97757] text-xs font-bold text-white ${className ?? ""}`}
    >
      C
    </span>
  );
}

function RunSection({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof ShieldCheck;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-[#0D9488]" strokeWidth={2.5} />
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#0D9488]">
          {label}
        </span>
        <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
      </div>
      {children}
    </div>
  );
}

function DeliverableRow({
  icon: Icon,
  label,
  detail,
  status,
  badges,
}: {
  icon: typeof FileCode2;
  label: string;
  detail: string;
  status: "done";
  badges?: string[];
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-white px-2.5 py-2">
      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={2.5} />
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0D9488]" strokeWidth={2} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-charcoal">{label}</span>
          {status === "done" && (
            <span className="rounded bg-emerald-100 px-1.5 py-px text-[8px] font-bold uppercase tracking-wide text-emerald-800">
              done
            </span>
          )}
        </div>
        <p className="text-[10px] text-charcoal-muted">{detail}</p>
        {badges && (
          <div className="mt-1 flex gap-1">
            {badges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-800"
              >
                <CheckCircle2 className="h-2 w-2 text-emerald-600" />
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Slack mark — simplified logo for dashboard mock. */
function SlackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#E01E5A"
        d="M5.042 15.165a2.144 2.144 0 0 1-2.143 2.143A2.144 2.144 0 0 1 .756 15.165a2.144 2.144 0 0 1 2.143-2.143h2.143v2.143zM6.313 15.165a2.144 2.144 0 0 1 2.143-2.143 2.144 2.144 0 0 1 2.144 2.143v5.357a2.144 2.144 0 0 1-2.144 2.144 2.144 2.144 0 0 1-2.143-2.144v-5.357z"
      />
      <path
        fill="#36C5F0"
        d="M8.572 5.042a2.144 2.144 0 0 1-2.143-2.143A2.144 2.144 0 0 1 8.572.756a2.144 2.144 0 0 1 2.143 2.143v2.143H8.572zM8.572 6.313a2.144 2.144 0 0 1 2.143 2.143 2.144 2.144 0 0 1-2.143 2.144H3.215a2.144 2.144 0 0 1-2.143-2.144 2.144 2.144 0 0 1 2.143-2.143h5.357z"
      />
      <path
        fill="#2EB67D"
        d="M18.958 8.572a2.144 2.144 0 0 1 2.143-2.143 2.144 2.144 0 0 1 2.143 2.143 2.144 2.144 0 0 1-2.143 2.143h-2.143V8.572zM17.687 8.572a2.144 2.144 0 0 1-2.143 2.143 2.144 2.144 0 0 1-2.144-2.143V3.215a2.144 2.144 0 0 1 2.144-2.143 2.144 2.144 0 0 1 2.143 2.143v5.357z"
      />
      <path
        fill="#ECB22E"
        d="M15.428 18.958a2.144 2.144 0 0 1 2.143 2.143 2.144 2.144 0 0 1-2.143 2.143 2.144 2.144 0 0 1-2.144-2.143v-2.143h2.144zM15.428 17.687a2.144 2.144 0 0 1-2.144-2.143 2.144 2.144 0 0 1 2.144-2.144h5.357a2.144 2.144 0 0 1 2.143 2.144 2.144 2.144 0 0 1-2.143 2.144h-5.357z"
      />
    </svg>
  );
}

/** Right column — Slack status, speed chart, reject & redo (compact). */
function DashboardSidePanel({ className }: { className?: string }) {
  return (
    <Card
      className={`flex h-full flex-col overflow-hidden border-border shadow-sm ${className ?? ""}`}
    >
      <div className="flex items-center justify-between border-b border-border bg-cream-warm px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#0D9488]" />
          <span className="text-sm font-semibold text-charcoal">coolplugz</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live sync
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        {/* Slack — minimal */}
        <div className="rounded-xl border border-[#E8E2E8] bg-[#FAF8FA] p-3">
          <div className="mb-2 flex items-center gap-2">
            <SlackMark className="h-4 w-4" />
            <span className="text-[11px] font-bold text-charcoal">Slack</span>
            <span className="ml-auto text-[9px] font-semibold text-emerald-700">
              From your context
            </span>
          </div>
          <div className="space-y-1">
            <SlackCompactRow
              icon={MessageSquare}
              label="Messages generated"
              detail="2 drafts · @alex #backend"
              variant="done"
            />
            <SlackCompactRow
              icon={AtSign}
              label="Thread needs action"
              detail="@you · #backend"
              variant="action"
            />
            <SlackCompactRow
              icon={Mic}
              label="Standup update"
              detail="Ready for today's call"
              variant="done"
            />
          </div>
        </div>

        {/* Speed chart — grows to fill space */}
        <div className="flex min-h-[148px] flex-1 flex-col rounded-xl border border-border bg-white p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-charcoal">Task delivery speed</span>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
              10× faster
            </span>
          </div>
          <div className="min-h-[100px] flex-1">
            <SpeedChartCompact />
          </div>
          <p className="mt-1.5 text-[9px] font-medium text-[#0D9488]">
            Lower is faster — with vs without coolplugz
          </p>
        </div>

        {/* Reject & redo */}
        <div className="rounded-xl border border-border bg-white p-3">
          <p className="mb-2 text-[11px] font-bold text-charcoal">Reject &amp; redo</p>
          <div className="space-y-1">
            <CompactRedoStep step="1" title="Reject in chat" />
            <CompactRedoStep step="2" title="Say what's missing" />
            <CompactRedoStep step="3" title="Full context re-runs" highlight />
          </div>
          <div className="mt-2 rounded-lg border border-dashed border-border bg-cream-warm/80 px-2.5 py-2">
            <p className="text-[9px] italic text-charcoal-muted">
              &quot;Add error handling for PROJ-124&quot;
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-[#E8FAF6] px-2 py-1.5">
            <RefreshCw className="h-3 w-3 shrink-0 text-[#0D9488]" />
            <p className="text-[9px] font-medium text-[#0D9488]">
              Nothing to re-gather — same synced context
            </p>
          </div>
        </div>

        {/* Run summary — fills bottom, mirrors left card */}
        <div
          className="mt-auto rounded-xl border border-[#7DD3C0]/30 p-3"
          style={{ background: `linear-gradient(135deg, ${chartGradient.bg}55, #F9F8F6)` }}
        >
          <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-charcoal-muted">
            This run
          </p>
          <div className="grid grid-cols-3 gap-2">
            <RunStat label="Hours saved" value="−6 hrs" accent />
            <RunStat label="Deliverables" value="4 done" />
            <RunStat label="Your move" value="Approve" />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-[#7DD3C0]/20 pt-2.5">
            <span className="text-[9px] font-semibold text-charcoal-muted">Synced:</span>
            <ContextPill icon={Ticket} label="Jira" />
            <ContextPill icon={MessageSquare} label="Slack" />
            <ContextPill icon={GitBranch} label="GitHub" />
            <ContextPill
              label="Notion"
              logo={<NotionMark className="h-3 w-3 text-charcoal" />}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RunStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/80 bg-white/90 px-2 py-2 text-center shadow-sm">
      <p className="text-[8px] font-semibold uppercase tracking-wide text-charcoal-muted">
        {label}
      </p>
      <p
        className={`mt-0.5 text-[11px] font-bold ${accent ? "text-[#0D9488]" : "text-charcoal"}`}
      >
        {value}
      </p>
    </div>
  );
}

function SlackCompactRow({
  icon: Icon,
  label,
  detail,
  variant,
}: {
  icon: typeof MessageSquare;
  label: string;
  detail: string;
  variant: "done" | "action";
}) {
  const isAction = variant === "action";
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${isAction ? "border border-amber-200/70 bg-amber-50/60" : "bg-white"}`}
    >
      <Icon
        className={`h-3 w-3 shrink-0 ${isAction ? "text-amber-600" : "text-[#0D9488]"}`}
        strokeWidth={2}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold leading-tight text-charcoal">{label}</p>
        <p className="truncate text-[9px] text-charcoal-muted">{detail}</p>
      </div>
      {isAction ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
      ) : (
        <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" strokeWidth={2.5} />
      )}
    </div>
  );
}

function SpeedChartCompact() {
  return (
    <ClientOnly
      fallback={
        <div
          className="h-[100px] w-full animate-pulse rounded-lg"
          style={{
            background: `linear-gradient(180deg, ${chartGradient.top}, ${chartGradient.bottom})`,
          }}
        />
      }
    >
      <div className="h-[100px] w-full">
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={speedComparisonData} barCategoryGap="22%" barGap={3}>
            <defs>
              <linearGradient id="sideChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartGradient.top} />
                <stop offset="100%" stopColor={chartGradient.bottom} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="task"
              stroke="#6B6661"
              fontSize={9}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B6661"
              fontSize={9}
              unit="h"
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip
              cursor={{ fill: "rgba(209, 244, 238, 0.35)" }}
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #E5E0D8",
                borderRadius: "8px",
                fontSize: 10,
              }}
              formatter={(value, name) => [
                `${value ?? 0}h`,
                name === "withPlugin" ? "With coolplugz" : "Without",
              ]}
            />
            <Bar dataKey="without" name="without" fill="#E8E2D8" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="withPlugin"
              name="withPlugin"
              fill="url(#sideChartGradient)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ClientOnly>
  );
}

function CompactRedoStep({
  step,
  title,
  highlight,
}: {
  step: string;
  title: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${highlight ? "border border-emerald-200 bg-emerald-50/50" : "bg-cream-warm/80"}`}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-charcoal text-[8px] font-bold text-cream">
        {step}
      </span>
      <p className="text-[10px] font-semibold text-charcoal">{title}</p>
      {highlight && (
        <CheckCircle2 className="ml-auto h-3 w-3 shrink-0 text-emerald-600" strokeWidth={2.5} />
      )}
    </div>
  );
}

function ContextPill({
  icon: Icon,
  label,
  logo,
}: {
  icon?: typeof Ticket;
  label: string;
  logo?: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-medium text-charcoal">
      {logo ??
        (Icon && <Icon className="h-3 w-3 text-[#0D9488]" strokeWidth={2} />)}
      {label}
    </span>
  );
}

function ToolPill({
  icon: Icon,
  label,
}: {
  icon: typeof Terminal;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-[#7DD3C0]/40 bg-[#E8FAF6]/80 px-2 py-0.5 font-mono text-[10px] font-medium text-[#0D9488]">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
