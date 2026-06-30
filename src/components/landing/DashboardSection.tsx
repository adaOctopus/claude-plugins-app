"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MessageSquare, Clock, XCircle } from "lucide-react";
import { ClientOnly } from "@/components/ui/client-only";
import { chartGradient, chartPalette, velocityData } from "@/lib/chart-colors";

const requirements = [
  { item: "Implement auth middleware", done: true },
  { item: "Add unit tests for API routes", done: true },
  { item: "Update README with setup steps", done: false },
  { item: "Fix CI lint errors", done: true },
];

const slackItems = [
  "Reply to Sarah about API timeline",
  "Review PR #142 feedback from team",
];

/** Dashboard mock — charts and cards showing in-Claude MCP overview. */
export function DashboardSection() {
  return (
    <section id="dashboard" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          Inside Claude
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          Finished work lands on your screen. You decide.
        </h2>
        <p className="mt-4 max-w-3xl text-charcoal-muted">
          Everything ran automatically in the background — context gathered,
          prompts generated and executed, output produced. Inside Claude you see
          the results and the update messages already written. Your only action:{" "}
          <strong className="font-medium text-charcoal">Approve &amp; submit</strong> or{" "}
          <strong className="font-medium text-charcoal">Reject &amp; redo</strong>.
        </p>

        <Card className="mt-8 border-2 border-emerald-300 bg-emerald-50/40">
          <CardContent className="flex flex-col items-center justify-between gap-6 p-6 sm:flex-row">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">
                Ready for your decision
              </p>
              <p className="mt-1 text-sm text-charcoal">
                3 tasks completed · 2 update messages generated · 0 prompts written by you
              </p>
            </div>
            <div className="flex w-full shrink-0 gap-3 sm:w-auto">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white sm:flex-initial"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve &amp; submit
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-2.5 text-sm font-medium text-charcoal sm:flex-initial"
              >
                <XCircle className="h-4 w-4" />
                Reject &amp; redo
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Task delivery speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClientOnly
                fallback={
                  <div
                    className="h-48 w-full animate-pulse rounded-xl"
                    style={{ background: `linear-gradient(180deg, ${chartGradient.top}, ${chartGradient.bottom})` }}
                  />
                }
              >
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={velocityData} barCategoryGap="20%">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartGradient.top} />
                          <stop offset="100%" stopColor={chartGradient.bottom} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        stroke="#6B6661"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#6B6661"
                        fontSize={12}
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
                          boxShadow: "0 4px 12px rgba(45, 41, 38, 0.08)",
                        }}
                      />
                      <Bar
                        dataKey="hours"
                        fill="url(#chartGradient)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ClientOnly>
              <p
                className="mt-2 text-xs font-medium"
                style={{ color: chartGradient.accentDark }}
              >
                ↓ 87% faster than manual context gathering
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements vs output</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {requirements.map((req) => (
                <div key={req.item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{
                      color: req.done ? chartGradient.accent : "#6B6661",
                    }}
                  />
                  <span className={req.done ? "text-charcoal" : "text-charcoal-muted"}>
                    {req.item}
                  </span>
                </div>
              ))}
              <p className="pt-2 text-xs font-medium text-charcoal">75% complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                Slack action items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {slackItems.map((text) => (
                <div
                  key={text}
                  className="rounded-xl border-l-4 p-3 font-medium"
                  style={{
                    backgroundColor: chartPalette.bg,
                    borderLeftColor: chartPalette.border,
                    color: chartGradient.accentDark,
                  }}
                >
                  {text}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Generated standup update — approve to send</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-xl border-l-4 p-4 text-sm"
                style={{
                  backgroundColor: chartPalette.bg,
                  borderLeftColor: chartPalette.border,
                  color: chartGradient.accentDark,
                }}
              >
                &quot;Yesterday I completed the auth middleware and fixed CI lint
                errors on PR #142. Today I&apos;m adding unit tests and updating
                the README. No blockers — CI is green.&quot;
              </div>
              <p className="mt-3 text-xs text-charcoal-muted">
                Written automatically. Tap Approve &amp; submit to post — no typing required.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
