import Link from "next/link";
import { Plug } from "lucide-react";
import { cn } from "@/lib/utils";
import { HERO_CTA_HREF } from "../types";

const base =
  "inline-flex w-full items-center justify-center gap-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:w-auto";

/** 10 — Dev tools: mono badge typography inside pill. */
export function CtaMonoBadge() {
  return (
    <Link
      href={HERO_CTA_HREF}
      className={cn(
        base,
        "h-12 bg-charcoal px-9 font-mono text-sm font-medium uppercase tracking-[0.12em] text-cream hover:bg-charcoal/90"
      )}
    >
      <Plug className="h-4 w-4 text-cream" strokeWidth={2.25} />
      GET STARTED
    </Link>
  );
}
