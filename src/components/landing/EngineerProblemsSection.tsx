"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { integrationSources } from "@/components/icons/IntegrationMarks";
import {
  ENGINEER_PROBLEMS_SECTION_ID,
  engineerProblemsSeoItems,
} from "@/lib/engineer-problems-seo-copy";
import { chartGradient } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";

type ProblemCard = {
  id: string;
  title: string;
  fix: string;
  payoff: string;
  accent: string;
  glow: string;
  visual: ReactNode;
};

function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return canHover;
}

function BeforeAfterShell({
  before,
  after,
}: {
  before: ReactNode;
  after: ReactNode;
}) {
  return (
    <div className="flex h-full w-full min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:items-stretch sm:gap-1.5 md:gap-2">
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg border border-border/70 bg-white/50 p-2 opacity-80 sm:p-2.5">
        <span className="mb-1.5 text-[8px] font-bold uppercase tracking-wide text-charcoal-muted/70 min-[375px]:text-[7px]">
          Before
        </span>
        {before}
      </div>
      <div className="flex shrink-0 items-center justify-center text-charcoal/25 sm:self-center">
        <ArrowRight className="h-3.5 w-3.5 rotate-90 sm:rotate-0" strokeWidth={2} aria-hidden />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg border border-[#7DD3C0]/35 bg-[#E8FAF6]/60 p-2 sm:p-2.5">
        <span className="mb-1.5 text-[8px] font-bold uppercase tracking-wide text-[#0D9488] min-[375px]:text-[7px]">
          With coolplugz
        </span>
        {after}
      </div>
    </div>
  );
}

/** Scattered tabs vs one Claude dashboard. */
function ContextSwitchVisual() {
  const tabs = ["Jira", "Slack", "GitHub", "CI", "Docs"];

  return (
    <BeforeAfterShell
      before={
        <div className="flex w-full min-w-0 flex-col items-center gap-1.5">
          <div className="flex max-w-full flex-wrap justify-center gap-0.5">
            {tabs.map((tab) => (
              <span
                key={tab}
                className="rounded-full border border-border bg-white px-1.5 py-0.5 text-[7px] text-charcoal-muted min-[375px]:text-[6px]"
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="w-full space-y-0.5">
            {[100, 75, 55].map((w) => (
              <div
                key={w}
                className="mx-auto h-0.5 rounded-full bg-charcoal/12"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          <span className="text-center text-[8px] font-medium text-charcoal-muted min-[375px]:text-[7px]">
            Tab-hopping…
          </span>
        </div>
      }
      after={
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <LayoutDashboard className="h-4 w-4 text-[#0D9488]" strokeWidth={2} aria-hidden />
          <div className="flex flex-wrap justify-center gap-0.5">
            {integrationSources.slice(0, 4).map(({ id, Mark }) => (
              <span
                key={id}
                className="flex h-5 w-5 items-center justify-center rounded-md border border-[#7DD3C0]/30 bg-white/80"
              >
                <Mark className="h-2.5 w-2.5" aria-hidden />
              </span>
            ))}
          </div>
          <span className="text-[8px] font-bold uppercase text-[#0D9488] min-[375px]:text-[7px]">
            One panel
          </span>
        </div>
      }
    />
  );
}

/** CI fail → copy-paste loop vs checks green in env. */
function CiLoopVisual() {
  const GitHubMark = integrationSources.find((s) => s.id === "github")!.Mark;

  return (
    <BeforeAfterShell
      before={
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <GitHubMark className="h-3.5 w-3.5 opacity-70" aria-hidden />
          <div className="flex flex-wrap items-center justify-center gap-0.5">
            <XCircle className="h-3 w-3 text-red-500" strokeWidth={2.5} aria-hidden />
            <span className="rounded bg-red-50 px-1 py-0.5 text-[7px] font-mono text-red-600 min-[375px]:text-[6px]">
              test fail
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-0.5 text-charcoal/30">
            <ClipboardPaste className="h-2.5 w-2.5 shrink-0" strokeWidth={2} aria-hidden />
            <span className="text-center text-[7px] min-[375px]:text-[6px]">→ fix → push → repeat</span>
          </div>
          <Ban className="h-3 w-3 text-charcoal/25" strokeWidth={2} aria-hidden />
        </div>
      }
      after={
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <GitHubMark className="h-3.5 w-3.5" aria-hidden />
          <div className="flex flex-wrap items-center justify-center gap-0.5">
            {["lint", "test", "build"].map((check) => (
              <span
                key={check}
                className="inline-flex items-center gap-px rounded border border-emerald-200/80 bg-emerald-50 px-0.5 py-px"
              >
                <CheckCircle2 className="h-2 w-2 text-emerald-600" strokeWidth={2.5} aria-hidden />
                <span className="font-mono text-[5px] font-semibold uppercase text-emerald-700 min-[375px]:text-[4px]">
                  {check}
                </span>
              </span>
            ))}
          </div>
          <span className="text-[8px] font-bold uppercase text-[#0D9488] min-[375px]:text-[7px]">
            Green in env
          </span>
        </div>
      }
    />
  );
}

/** PR comments + failed checks vs resolved in one run. */
function GitHubPingPongVisual() {
  const GitHubMark = integrationSources.find((s) => s.id === "github")!.Mark;

  return (
    <BeforeAfterShell
      before={
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <GitHubMark className="h-3.5 w-3.5 opacity-70" aria-hidden />
          <div className="w-full max-w-full rounded border border-border/70 bg-white/70 px-1.5 py-1">
            <p className="text-center text-[7px] leading-tight text-charcoal-muted min-[375px]:text-[6px]">
              &quot;Can you fix this edge case?&quot;
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-0.5 text-charcoal/30">
            <ArrowRight className="h-2 w-2 rotate-180" strokeWidth={2} aria-hidden />
            <span className="text-[7px] min-[375px]:text-[6px]">chat ↔ GitHub</span>
            <ArrowRight className="h-2 w-2" strokeWidth={2} aria-hidden />
          </div>
          <XCircle className="h-3 w-3 text-red-400" strokeWidth={2.5} aria-hidden />
        </div>
      }
      after={
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <GitPullRequest className="h-3.5 w-3.5 text-[#0D9488]" strokeWidth={2} aria-hidden />
          <div className="flex flex-wrap items-center justify-center gap-0.5">
            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" strokeWidth={2.5} aria-hidden />
            <span className="text-[7px] font-semibold text-charcoal min-[375px]:text-[6px]">
              Comments addressed
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <CheckCircle2
                key={i}
                className="h-2.5 w-2.5 text-emerald-600"
                strokeWidth={2.5}
                aria-hidden
              />
            ))}
          </div>
          <span className="text-[8px] font-bold uppercase text-[#0D9488] min-[375px]:text-[7px]">
            Same run
          </span>
        </div>
      }
    />
  );
}

/** Slack thread binge vs mentions + drafts in one panel. */
function SlackAnxietyVisual() {
  const SlackMark = integrationSources.find((s) => s.id === "slack")!.Mark;

  return (
    <BeforeAfterShell
      before={
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <SlackMark className="h-3.5 w-3.5 opacity-70" aria-hidden />
          <div className="w-full max-w-full space-y-0.5">
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
                  <AtSign className="h-2 w-2 shrink-0 text-orange-500" strokeWidth={2.5} aria-hidden />
                )}
              </div>
            ))}
          </div>
          <span className="rounded bg-red-50 px-1 py-0.5 text-[7px] font-medium text-red-600 min-[375px]:text-[6px]">
            12 unread · 3 @you
          </span>
        </div>
      }
      after={
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <div
            className="w-full max-w-full rounded-md border border-[#7DD3C0]/30 p-1.5"
            style={{ background: `linear-gradient(180deg, ${chartGradient.bg}33, white)` }}
          >
            <div className="flex flex-wrap items-center gap-1">
              <LayoutDashboard className="h-2.5 w-2.5 text-[#0D9488]" strokeWidth={2} aria-hidden />
              <AtSign className="h-2.5 w-2.5 text-orange-500" strokeWidth={2.5} aria-hidden />
              <span className="text-[7px] font-semibold text-charcoal min-[375px]:text-[6px]">
                2 mentions
              </span>
            </div>
            <div className="mt-1 flex items-center gap-0.5 rounded border border-[#7DD3C0]/25 bg-white px-1 py-0.5">
              <MessageSquare className="h-2 w-2 text-[#0D9488]" strokeWidth={2} aria-hidden />
              <Mic className="h-2 w-2 text-[#0D9488]" strokeWidth={2} aria-hidden />
              <span className="text-[7px] text-charcoal-muted min-[375px]:text-[6px]">Draft ready</span>
            </div>
          </div>
          <span className="text-[8px] font-bold uppercase text-[#0D9488] min-[375px]:text-[7px]">
            Approve &amp; send
          </span>
        </div>
      }
    />
  );
}

function GlassProblemCard({
  id,
  title,
  fix,
  payoff,
  accent,
  glow,
  visual,
  canHover,
}: ProblemCard & { canHover: boolean }) {
  return (
    <motion.li
      id={id}
      className="min-w-0 list-none"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-b p-4 backdrop-blur-xl sm:p-5",
          accent,
          glow,
          "shadow-[0_8px_24px_rgba(13,148,136,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]",
          "transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(13,148,136,0.14),inset_0_1px_0_rgba(255,255,255,0.98)]"
        )}
        style={{ transformStyle: "preserve-3d" }}
        whileHover={
          canHover
            ? {
                rotateX: -5,
                rotateY: 8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }
            : undefined
        }
      >
        <div
          className="relative mb-4 flex min-h-[7.5rem] items-center overflow-hidden sm:min-h-[8rem]"
          aria-hidden
        >
          {visual}
        </div>

        <div className="relative mt-auto">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#0D9488] sm:text-[9px]">
            {payoff}
          </span>
          <h3 className="mt-1 font-serif text-base text-charcoal sm:text-lg md:text-xl">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-charcoal-muted sm:leading-snug">{fix}</p>
        </div>
      </motion.article>
    </motion.li>
  );
}

const problems: ProblemCard[] = engineerProblemsSeoItems.map((item, index) => {
  const visuals = [
    <ContextSwitchVisual key="context" />,
    <CiLoopVisual key="ci" />,
    <GitHubPingPongVisual key="github" />,
    <SlackAnxietyVisual key="slack" />,
  ];
  const accents = [
    "from-[#E8FAF6]/90 to-white/60",
    "from-[#E8F4FF]/90 to-white/60",
    "from-[#FFF4E8]/90 to-white/60",
    "from-[#F3EEFF]/90 to-white/60",
  ];
  const glows = [
    "shadow-[0_8px_24px_rgba(13,148,136,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
    "shadow-[0_8px_24px_rgba(59,130,246,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
    "shadow-[0_8px_24px_rgba(245,158,11,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
    "shadow-[0_8px_24px_rgba(139,92,246,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
  ];

  const titles = [
    "Context switching kills focus",
    "CI trial-and-error loops",
    "GitHub ↔ assistant back-and-forth",
    "Eliminates Slack anxiety",
  ];
  const fixes = [
    "GitHub, Slack, Jira, CI - now all gathered inside Claude ❋",
    "CI checks tested in the CoolPlugz env until green✅",
    "Reviews comments and failed CI checks fixed inside the same run.",
    "Thread mentions scanned; tone-matched drafted messages.",
  ];

  return {
    id: item.id,
    title: titles[index] ?? item.name,
    fix: fixes[index] ?? item.description,
    payoff: item.payoff,
    accent: accents[index] ?? accents[0],
    glow: glows[index] ?? glows[0],
    visual: visuals[index] ?? visuals[0],
  };
});

/** Glass problem cards — pains remote AI-native engineers face, solved in Claude. */
export function EngineerProblemsSection() {
  const canHover = useCanHover();

  return (
    <section
      id={ENGINEER_PROBLEMS_SECTION_ID}
      aria-labelledby="engineer-problems-heading"
      className="scroll-mt-28 border-t border-border/60 px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-accent-sage via-cream to-amber-50/90 shadow-[0_8px_40px_rgba(45,41,38,0.06)]">
        <div className="p-8 md:p-14 lg:p-16">
        <Badge variant="secondary" className="mb-4">
          For AI-native engineers
        </Badge>
        <h2
          id="engineer-problems-heading"
          className="max-w-2xl font-serif text-2xl text-charcoal sm:text-3xl md:text-4xl"
        >
          Stop paying the{" "}
          <strong style={{ fontStyle: "italic", fontWeight: "600" }}>hidden AI tax</strong>.
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-charcoal-muted sm:max-w-lg">
          Deliver work in minutes without AI fatigue and zero context switching.
        </p>

        <ul
          className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:mt-10 lg:gap-6"
          style={{ perspective: 1000 }}
        >
          {problems.map((problem) => (
            <GlassProblemCard key={problem.id} {...problem} canHover={canHover} />
          ))}
        </ul>

        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10 sm:gap-4"
          role="list"
          aria-label="Developer outcomes with CoolPlugz"
        >
          {[
            { label: "Less context switching", emoji: "⚡" },
            { label: "CI without loops", emoji: "✅" },
            { label: "No Slack dread", emoji: "😌" },
          ].map(({ label, emoji }) => (
            <span
              key={label}
              role="listitem"
              className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-gradient-to-b from-white to-cream-warm px-3 py-1.5 text-xs font-medium text-charcoal shadow-[0_2px_8px_rgba(45,41,38,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]"
            >
              <span className="text-sm" aria-hidden>
                {emoji}
              </span>
              {label}
            </span>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
