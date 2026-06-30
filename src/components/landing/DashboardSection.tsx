"use client";

import type { ReactNode } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  GitPullRequest,
  MessageSquare,
  RefreshCw,
  Terminal,
  Ticket,
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
          Full Context From Inside Claude
        </Badge>
        <h2 className="max-w-2xl font-serif text-3xl text-charcoal md:text-5xl">
          No more context switching.
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {/* Claude chat mock */}
          <Card className="overflow-hidden border-border shadow-md lg:col-span-3">
            <div className="flex items-center justify-between border-b border-border bg-cream-warm px-4 py-3">
              <span className="text-sm font-medium text-charcoal">Claude</span>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-medium text-charcoal-muted">
                Chat session
              </span>
            </div>

            <CardContent className="space-y-4 p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-1.5">
                <ContextPill icon={Ticket} label="Jira" />
                <ContextPill icon={MessageSquare} label="Slack" />
                <ContextPill icon={GitBranch} label="GitHub" />
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <GitPullRequest className="h-3 w-3" />
                  CI ✓
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <ToolPill icon={Terminal} label="cursor-cli" />
                <ToolPill icon={Terminal} label="claude-code" />
                <span className="text-[10px] text-charcoal-muted self-center pl-1">
                  · full context synced for your stack
                </span>
              </div>

              <div className="rounded-xl bg-cream-warm px-4 py-3">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-charcoal-muted">
                  plugsville · output ready
                </p>
                <div className="rounded-lg border border-border bg-white p-3 font-mono text-xs leading-relaxed text-charcoal">
                  <span className="text-emerald-700">✓</span> Auth middleware done
                  <br />
                  <span className="text-emerald-700">✓</span> CI lint + tests green
                  <br />
                  <span className="text-charcoal-muted">→ PR #142 ready to merge</span>
                </div>
              </div>

              <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/60 p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-emerald-900">
                  Your decision — in this chat
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve &amp; submit
                  </button>
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-charcoal"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject &amp; redo
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reject → redo flow */}
          <Card className="border-border lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Reject &amp; redo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RedoStep
                step="1"
                title="Reject in chat"
                detail="Tap Reject & redo on the output"
              />
              <FlowArrow />
              <RedoStep
                step="2"
                title="Say what's missing"
                detail={
                  <span className="mt-1 block rounded-lg border border-dashed border-border bg-cream-warm px-3 py-2 text-xs italic text-charcoal-muted">
                    &quot;Add error handling for the edge case in PROJ-124&quot;
                  </span>
                }
              />
              <FlowArrow />
              <RedoStep
                step="3"
                title="Runs again — full context"
                detail="Jira · Slack · GitHub · CI re-synced, then cursor-cli or claude-code re-runs"
                highlight
              />

              <div className="flex items-center gap-2 rounded-xl bg-[#E8FAF6] px-3 py-2.5">
                <RefreshCw className="h-4 w-4 shrink-0 text-[#0D9488]" />
                <p className="text-[11px] font-medium text-[#0D9488]">
                  Same synced context every time — nothing to re-gather
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <CardTitle className="text-lg">Task delivery speed</CardTitle>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                10× faster
              </span>
            </CardHeader>
            <CardContent>
              <ClientOnly
                fallback={
                  <div
                    className="h-44 w-full animate-pulse rounded-xl"
                    style={{
                      background: `linear-gradient(180deg, ${chartGradient.top}, ${chartGradient.bottom})`,
                    }}
                  />
                }
              >
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={speedComparisonData}
                      barCategoryGap="22%"
                      barGap={4}
                    >
                      <defs>
                        <linearGradient id="dashChartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartGradient.top} />
                          <stop offset="100%" stopColor={chartGradient.bottom} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="task"
                        stroke="#6B6661"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#6B6661"
                        fontSize={11}
                        unit="h"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(209, 244, 238, 0.35)" }}
                        contentStyle={{
                          background: "#FFFFFF",
                          border: "1px solid #E5E0D8",
                          borderRadius: "12px",
                        }}
                        formatter={(value, name) => [
                          `${value ?? 0}h`,
                          name === "withPlugin" ? "With plugsville" : "Without",
                        ]}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) =>
                          value === "withPlugin" ? "With plugsville" : "Without plugin"
                        }
                        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                      />
                      <Bar
                        dataKey="without"
                        name="without"
                        fill="#E8E2D8"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="withPlugin"
                        name="withPlugin"
                        fill="url(#dashChartGradient)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ClientOnly>
              <p className="mt-2 text-xs font-medium text-[#0D9488]">
                Lower is faster — plugsville cuts delivery time by 10× on every task type
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Included on every run</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { label: "Jira tickets", ok: true },
                { label: "Slack threads", ok: true },
                { label: "GitHub PRs", ok: true },
                { label: "CI status", ok: true },
                { label: "cursor-cli", ok: true },
                { label: "claude-code", ok: true },
              ].map(({ label, ok }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-border bg-cream-warm px-3 py-2 text-sm"
                >
                  <CheckCircle2
                    className="h-4 w-4 shrink-0"
                    style={{ color: ok ? chartGradient.accentDark : "#6B6661" }}
                  />
                  <span className="text-charcoal">{label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ContextPill({
  icon: Icon,
  label,
}: {
  icon: typeof Ticket;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-medium text-charcoal">
      <Icon className="h-3 w-3 text-[#0D9488]" strokeWidth={2} />
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

function RedoStep({
  step,
  title,
  detail,
  highlight,
}: {
  step: string;
  title: string;
  detail: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 ${highlight ? "border-emerald-200 bg-emerald-50/50" : "border-border bg-white"}`}
    >
      <div className="flex items-start gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-charcoal text-[10px] font-bold text-cream">
          {step}
        </span>
        <div>
          <p className="text-sm font-semibold text-charcoal">{title}</p>
          <div className="mt-0.5 text-xs text-charcoal-muted">{detail}</div>
        </div>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center">
      <ArrowRight className="h-4 w-4 rotate-90 text-charcoal/30" />
    </div>
  );
}
