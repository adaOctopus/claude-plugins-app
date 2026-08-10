"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  loopEngineeringCopy,
  LOOP_ENGINEERING_GUIDE_SLUG,
  LOOP_ENGINEERING_SECTION_ID,
  type LoopTerminalStep,
} from "@/lib/loop-engineering-copy";
import { cn } from "@/lib/utils";

const stepLineClass: Record<LoopTerminalStep, string> = {
  gather: "text-[#9ca3af]",
  act: "text-[#e5e5e5]",
  verify: "text-[#7DD3C0]",
  repeat: "text-[#6b7280]",
};

const lineVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.12, duration: 0.35, ease: "easeOut" as const },
  }),
};

/** Terminal log visual — gather → act → verify → repeat loop CoolPlugz runs. */
function LoopTerminalMock() {
  const copy = loopEngineeringCopy;

  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-xl border border-charcoal/20 bg-[#1e1e1e] shadow-[0_16px_48px_rgba(45,41,38,0.18)]"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </span>
          <span className="font-mono text-[11px] text-[#a3a3a3]">{copy.terminalTitle}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7DD3C0]/40 bg-[#0D9488]/15 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#7DD3C0]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          live
        </span>
      </div>

      <div className="overflow-x-auto px-4 py-4 font-mono text-xs leading-relaxed sm:text-[13px]">
        <p className="text-[#525252]">{copy.terminalDivider}</p>
        <motion.ul
          className="mt-2 space-y-1.5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {copy.lines.map((line, index) => (
            <motion.li
              key={line.step}
              custom={index}
              variants={lineVariants}
              className={cn("whitespace-nowrap sm:whitespace-normal", stepLineClass[line.step])}
            >
              <span className="font-semibold">{line.prefix}</span>
              <span className="ml-2">{line.message}</span>
            </motion.li>
          ))}
        </motion.ul>
        <motion.p
          className="mt-3 text-[#525252]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.3 }}
        >
          <span className="animate-pulse">▌</span>
        </motion.p>
      </div>
    </div>
  );
}

/** Loop engineering section — terminal visual + minimal copy before dashboard. */
export function LoopEngineeringSection() {
  const copy = loopEngineeringCopy;

  return (
    <section
      id={LOOP_ENGINEERING_SECTION_ID}
      aria-labelledby="loop-engineering-heading"
      className="scroll-mt-28 border-t border-border/60 px-4 py-16 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="text-left">
            <Badge variant="secondary" className="mb-4">
              {copy.badge}
            </Badge>
            <h2
              id="loop-engineering-heading"
              className="max-w-lg font-serif text-2xl text-charcoal sm:text-3xl md:text-4xl"
            >
              {copy.headline}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal-muted md:text-base">
              {copy.subhead}
            </p>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-charcoal-muted/90 md:text-sm">
              {copy.aside}
            </p>
            <Link
              href={`/guides/${LOOP_ENGINEERING_GUIDE_SLUG}`}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0D9488] underline-offset-2 transition-colors hover:text-[#0D9488]/80 hover:underline"
            >
              {copy.guideLinkLabel}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <p className="mt-1 text-xs text-charcoal-muted/80">{copy.guideLinkHint}</p>
          </div>

          <div className="min-w-0">
            <LoopTerminalMock />
            <ul
              className="mt-4 flex flex-wrap gap-2"
              aria-label="Loop engineering capabilities"
            >
              {copy.pills.map(({ label }) => (
                <li key={label}>
                  <span className="inline-flex rounded-full border border-[#7DD3C0]/35 bg-[#E8FAF6]/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#0D9488] sm:text-[11px]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
