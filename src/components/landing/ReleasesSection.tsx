"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Flag, Clock } from "lucide-react";
import { MarketplaceNotifyTrigger } from "@/components/waitlist/MarketplaceNotifyDialog";
import { resolveProductHref } from "@/lib/site-mode";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const flagship = {
  title: "Context Engineer",
  description:
    "One Claude plugin for engineers. An orchestration layer that guides Claude Code through your stack - context, workflows, and delivery without babysitting.",
  price: "Included in $17/mo plan",
};

const comingSoon = [
  {
    title: "Product Manager Plugin",
    description: "Roadmap synthesis, stakeholder updates, and sprint summaries.",
    date: "Coming Q3",
    category: "Product",
  },
  {
    title: "Designer Plugin",
    description: "Design review context, Figma handoff notes, and critique summaries.",
    date: "Coming Q4",
    category: "Design",
  },
];

/** Plugin releases — flagship CTA to pricing; view details opens notify popup (v2). */
export function ReleasesSection() {
  return (
    <section id="plugins" className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800">
            <Flag className="h-4 w-4 fill-emerald-500 text-emerald-500" />
            Available now — for engineers
          </span>
        </div>

        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          The plugin for engineers is live
        </h2>
        <p className="mt-4 max-w-2xl text-charcoal-muted">
          <strong className="font-medium text-charcoal">Context Engineer</strong> runs
          the full pipeline automatically — you never write prompts or iterate with
          the LLM. When output is ready, you Approve &amp; submit or Reject &amp; redo.
          More plugins for other roles arrive later.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="bento-card p-5 text-center">
            <p className="font-serif text-3xl text-charcoal md:text-4xl">−6 hrs/week</p>
            <p className="mt-2 text-sm text-charcoal-muted">
              Less time gathering context from Slack, Jira, GitHub, and docs
            </p>
          </div>
          <div className="bento-card p-5 text-center">
            <p className="font-serif text-3xl text-charcoal md:text-4xl">Zero</p>
            <p className="mt-2 text-sm text-charcoal-muted">
              Cognitive load on prompts — automatic context engineering
            </p>
          </div>
          <div className="bento-card p-5 text-center">
            <p className="font-serif text-3xl text-charcoal md:text-4xl">CI ✓</p>
            <p className="mt-2 text-sm text-charcoal-muted">
              No GitHub back-and-forth — CI status in your Claude dashboard
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <Card className="relative flex flex-col border-2 border-emerald-400 bg-gradient-to-br from-emerald-50/80 to-white shadow-md lg:col-span-3">
            <div className="absolute -top-3 left-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                Live now
              </span>
            </div>

            <CardHeader className="pt-8">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  Engineering
                </Badge>
                <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                  Flagship plugin
                </Badge>
              </div>
              <CardTitle className="font-serif text-2xl md:text-3xl">
                {flagship.title}
              </CardTitle>
              <p className="text-sm leading-relaxed text-charcoal-muted md:text-base">
                {flagship.description}
              </p>
            </CardHeader>

            <CardContent className="mt-auto space-y-2 border-t border-emerald-100 pt-4 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="uppercase text-charcoal-muted">Status</span>
                <span className="font-medium text-emerald-700">Available now</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase text-charcoal-muted">Built for</span>
                <span className="font-medium text-charcoal">Software engineers</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase text-charcoal-muted">Pricing</span>
                <span>{flagship.price}</span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href={resolveProductHref("/pricing")}>
                  Buy the plugin <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <MarketplaceNotifyTrigger
                source="releases-view-details"
                className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
              >
                View details
              </MarketplaceNotifyTrigger>
            </CardFooter>
          </Card>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wider text-charcoal-muted">
              Coming soon
            </p>
            {comingSoon.map((plugin) => (
              <Card
                key={plugin.title}
                className="flex flex-1 flex-col border-dashed opacity-75"
              >
                <CardHeader className="pb-2">
                  <div className="mb-1 flex items-center gap-2 text-xs text-charcoal-muted">
                    <Clock className="h-3.5 w-3.5" />
                    {plugin.date}
                  </div>
                  <CardTitle className="text-lg text-charcoal-muted">
                    {plugin.title}
                  </CardTitle>
                  <p className="text-sm text-charcoal-muted">{plugin.description}</p>
                </CardHeader>
                <CardContent className="mt-auto border-t border-border pt-3 text-xs">
                  <span className="uppercase text-charcoal-muted">Category · </span>
                  {plugin.category}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
