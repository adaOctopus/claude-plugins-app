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
import { CheckCircle2, MessageSquare, Clock } from "lucide-react";
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
          Your context dashboard, rendered inside Claude
        </h2>
        <p className="mt-4 max-w-2xl text-charcoal-muted">
          See task velocity, requirements coverage, Slack action items, and
          generated standup messages — all without leaving your AI workspace.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <CardTitle className="text-lg">Generated standup update</CardTitle>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
