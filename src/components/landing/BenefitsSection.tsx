import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { chartGradient, velocityData } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";
import {
  BatteryFull,
  Brain,
  CheckCircle2,
  Flame,
  Layers,
  Rocket,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

type Benefit = {
  title: string;
  tagline: string;
  accent: string;
  glow: string;
  visual: ReactNode;
};

/** Mini bar chart — context-switch hours dropping through the week. */
function TimeSavedVisual() {
  const max = Math.max(...velocityData.map((d) => d.hours));

  return (
    <div className="flex h-full w-full flex-col justify-end gap-2 px-1">
      <div className="flex items-end justify-between gap-1">
        {velocityData.map(({ day, hours }) => (
          <div key={day} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-[#0D9488] to-[#5EC4B6] transition-all"
              style={{ height: `${(hours / max) * 56}px` }}
            />
            <span className="text-[8px] font-medium text-charcoal-muted">{day}</span>
          </div>
        ))}
      </div>
      <span className="text-center text-[9px] font-bold uppercase tracking-wide text-[#0D9488]">
        −87% switch tax
      </span>
    </div>
  );
}

/** Battery + calm brain — mental energy preserved. */
function MentalEnergyVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1 opacity-30">
        <Layers className="h-5 w-5 text-charcoal/40" strokeWidth={1.75} />
        <div className="flex gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-charcoal/20" />
          ))}
        </div>
        <span className="text-[7px] font-bold uppercase text-grey/60">Before</span>
      </div>
      <div className="text-charcoal/20">→</div>
      <div className="flex flex-col items-center gap-1.5">
        <div className="relative">
          <Brain className="h-8 w-8 text-[#0D9488]" strokeWidth={1.75} />
          <BatteryFull className="absolute -bottom-1 -right-2 h-4 w-4 text-emerald-500" strokeWidth={2.5} />
        </div>
        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-emerald-400 to-[#0D9488]" />
        </div>
        <span className="text-[7px] font-bold uppercase text-[#0D9488]">Charged</span>
      </div>
    </div>
  );
}

/** Side project gets the hours back. */
function FocusProjectsVisual() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 px-1">
      <div className="rounded-lg border border-border/60 bg-white/80 px-2.5 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-medium text-charcoal-muted">Day job</span>
          <span className="flex items-center gap-0.5 text-[8px] font-bold text-emerald-700">
            <Sparkles className="h-2.5 w-2.5" />
            Autopilot
          </span>
        </div>
        <div className="mt-1 h-1 w-full rounded-full bg-emerald-200/80">
          <div className="h-full w-full rounded-full bg-emerald-400/70" />
        </div>
      </div>
      <div
        className="rounded-lg border border-[#7DD3C0]/40 px-2.5 py-2 shadow-sm"
        style={{ background: `linear-gradient(135deg, ${chartGradient.bg}88, white)` }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[9px] font-semibold text-charcoal">
            <Rocket className="h-3 w-3 text-[#0D9488]" />
            Your project
          </span>
          <span className="text-[8px] font-bold text-[#0D9488]">+2h today</span>
        </div>
        <div className="mt-1.5 flex gap-1">
          {["Ship", "Build", "Learn"].map((l) => (
            <span
              key={l}
              className="rounded-md bg-white/90 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-charcoal-muted"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** AI fatigue spiral vs calm approve loop. */
function BurnoutAvoidVisual() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-2 px-0.5">
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/60 p-2">
        <Flame className="h-5 w-5 text-orange-500" strokeWidth={2} />
        <div className="mt-1 flex flex-wrap justify-center gap-0.5">
          {["↻", "↻", "↻"].map((s, i) => (
            <span key={i} className="text-[9px] text-orange-600/70">
              {s}
            </span>
          ))}
        </div>
        <span className="mt-1 text-[7px] font-bold uppercase text-orange-700/80">LLM spiral</span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-[#7DD3C0]/35 bg-[#E8FAF6]/70 p-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-white">
          <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.25} />
        </span>
        <CheckCircle2 className="mt-1 h-3.5 w-3.5 text-[#0D9488]" strokeWidth={2.5} />
        <span className="mt-0.5 text-[7px] font-bold uppercase text-[#0D9488]">Approve & done</span>
      </div>
    </div>
  );
}

function BenefitCard({
  title,
  tagline,
  accent,
  glow,
  visual,
}: Benefit) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-b p-4 sm:p-5",
        accent,
        glow
      )}
    >
      <div className="mb-4 flex h-[5.5rem] items-center sm:h-[6rem]">{visual}</div>
      <h3 className="font-serif text-lg text-charcoal md:text-xl">{title}</h3>
      <p className="mt-1 text-sm leading-snug text-charcoal-muted">{tagline}</p>
    </article>
  );
}

const benefits: Benefit[] = [
  {
    title: "Mental energy back",
    tagline: "Carries the cognitive overload.",
    accent: "from-[#E8FAF6] to-white",
    glow: "shadow-[0_8px_24px_rgba(13,148,136,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
    visual: <MentalEnergyVisual />,
  },
  {
    title: "Save hours weekly",
    tagline: "Eliminates context-switching.",
    accent: "from-[#E8F4FF] to-white",
    glow: "shadow-[0_8px_24px_rgba(59,130,246,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
    visual: <TimeSavedVisual />,
  },
  {
    title: "Frees up your time",
    tagline: "More time for your side projects.",
    accent: "from-[#FFF4E8] to-white",
    glow: "shadow-[0_8px_24px_rgba(245,158,11,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
    visual: <FocusProjectsVisual />,
  },
  {
    title: "Skip AI fatigue & burnout",
    tagline: "No back and forth with AI.",
    accent: "from-[#F3EEFF] to-white",
    glow: "shadow-[0_8px_24px_rgba(139,92,246,0.1),inset_0_1px_0_rgba(255,255,255,0.95)]",
    visual: <BurnoutAvoidVisual />,
  },
];

/** Benefits section — visual payoff: energy, time, focus, less burnout. */
export function BenefitsSection() {
  return (
    <section id="benefits" className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          The Benefits
        </Badge>
        <h2 className="max-w-2xl font-serif text-3xl text-charcoal md:text-4xl">
          Carries the<span style={{ fontStyle: "italic", fontWeight: "600" }}> cognitive overload</span> for you.
        </h2>
        <p className="mt-2 max-w-lg text-sm text-charcoal-muted">
          Handles everything AI needs - prompts, context, slack updates - without you thinking about it.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {[
            { label: "Less drain", emoji: "🧠" },
            { label: "More time", emoji: "⏱️" },
            { label: "Your projects", emoji: "🚀" },
            { label: "No burnout", emoji: "✨" },
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
