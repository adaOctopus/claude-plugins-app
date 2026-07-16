"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const keywords = [
  { text: "Refetch", emoji: "🔀" },
  { text: "FullRun", emoji: "🚀" },
  { text: "WTF", emoji: "😂" },
  { text: "Slack", emoji: "💬" },
] as const;

const INTERVAL_MS = 2400;

const ease = [0.22, 1, 0.36, 1] as const;

/** Headline with rotating @-tag keywords — width tracks each word inline. */
export function RotatingTagHeadline({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [wordWidth, setWordWidth] = useState<number | null>(null);

  const current = keywords[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % keywords.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  useLayoutEffect(() => {
    if (measureRef.current) {
      setWordWidth(measureRef.current.offsetWidth);
    }
  }, [current.text, current.emoji]);

  return (
    <h2
      className={cn(
        "max-w-3xl font-serif text-[1.65rem] leading-[1.15] text-charcoal sm:text-[1.85rem] md:text-[2.35rem] md:leading-[1.12]",
        className
      )}
    >
      <span className="inline-flex flex-wrap items-baseline gap-x-[0.28em]">
        <span>
          Just type{" "}
          <span className="font-mono text-[0.88em] italic font-bold">@</span>
        </span>

        <span className="relative inline-flex items-baseline">
          {/* Off-screen measurer — drives animated width */}
          <span
            ref={measureRef}
            aria-hidden
            className="pointer-events-none invisible absolute inline-flex items-baseline gap-1 whitespace-nowrap italic"
            style={{ fontWeight: 600 }}
          >
            <span>{current.text}</span>
            <span className="not-italic">{current.emoji}</span>
          </span>

          <motion.span
            aria-live="polite"
            aria-atomic="true"
            className="inline-block overflow-hidden align-bottom"
            initial={false}
            animate={{ width: wordWidth ?? "auto" }}
            transition={{ duration: 0.42, ease }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease }}
                className="inline-flex items-baseline gap-1 whitespace-nowrap italic"
                style={{ fontWeight: 600 }}
              >
                <span>{current.text}</span>
                <span className="not-italic">{current.emoji}</span>
              </motion.span>
            </AnimatePresence>
          </motion.span>

          <motion.span
            layout
            transition={{ layout: { duration: 0.42, ease } }}
            className="whitespace-nowrap"
          >
            . That&apos;s it.
          </motion.span>
        </span>
      </span>
    </h2>
  );
}
