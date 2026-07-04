import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex w-full flex-col items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:w-auto";

/** 5 — Cursor: dev-product tone with mono sub-line. */
export function CtaCursorDev() {
  return (
    <Link
      href="/install"
      className={cn(
        base,
        "h-auto min-h-12 gap-0.5 bg-charcoal px-8 py-2.5 text-cream hover:bg-charcoal/90"
      )}
    >
      <span className="text-[15px] font-medium tracking-[-0.01em]">Install in Claude</span>
      <span className="font-mono text-[10px] font-normal tracking-wide text-cream/70">
        plugin · setup in 5 min
      </span>
    </Link>
  );
}
