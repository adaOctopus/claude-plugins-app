import Link from "next/link";
import { CoolplugzMark } from "@/components/brand/CoolplugzMark";
import { brandWordmarkFont, BRAND_WORDMARK_FAMILY } from "@/lib/brand-font";
import { CUSTOM_BRAND_FONTS, type CustomBrandFont } from "@/lib/custom-brand-fonts";
import { cn } from "@/lib/utils";

type CompareEntry = {
  id: string;
  name: string;
  fontFamily: string;
  letterSpacing?: string;
  isLive?: boolean;
};

const LIVE_ENTRY: CompareEntry = {
  id: "live",
  name: `Live — ${BRAND_WORDMARK_FAMILY}`,
  fontFamily: "var(--font-brand-wordmark)",
  letterSpacing: "-0.04em",
  isLive: true,
};

const COMPARE_ENTRIES: CompareEntry[] = [
  ...CUSTOM_BRAND_FONTS.map((f) => ({
    id: f.id,
    name: f.name,
    fontFamily: `"${f.fontFamily}"`,
    letterSpacing: f.letterSpacing,
  })),
  {
    id: LIVE_ENTRY.id,
    name: LIVE_ENTRY.name,
    fontFamily: LIVE_ENTRY.fontFamily,
    letterSpacing: LIVE_ENTRY.letterSpacing,
    isLive: true,
  },
];

function CompareWordmark({
  entry,
  size,
  className,
}: {
  entry: CompareEntry;
  size: string;
  className?: string;
}) {
  return (
    <span
      className={cn("whitespace-nowrap text-charcoal", className)}
      style={{
        fontFamily: entry.isLive
          ? `var(--font-brand-wordmark), "Plus Jakarta Sans", system-ui, sans-serif`
          : `${entry.fontFamily}, system-ui, sans-serif`,
        fontWeight: entry.isLive ? 700 : 400,
        fontStyle: "normal",
        fontSize: size,
        letterSpacing: entry.letterSpacing ?? "-0.02em",
        lineHeight: 1.05,
      }}
    >
      coolplugs
    </span>
  );
}

function CompareColumn({
  entry,
  uniformSize,
}: {
  entry: CompareEntry;
  uniformSize: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[9.5rem] flex-1 flex-col items-center gap-4 rounded-2xl border bg-white p-4 sm:min-w-[10.5rem] sm:p-5",
        entry.isLive ? "border-charcoal/25 ring-1 ring-charcoal/10" : "border-border"
      )}
    >
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-muted">
          {entry.isLive ? "Navbar now" : "Candidate"}
        </p>
        <p className="mt-1 text-xs font-medium text-charcoal">{entry.name}</p>
        <code className="mt-1 inline-block rounded bg-cream-warm px-1.5 py-0.5 text-[10px] text-charcoal-muted">
          {entry.id}
        </code>
      </div>

      <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-cream px-3 py-2">
        <CoolplugzMark size={38} framed />
        <CompareWordmark entry={entry} size="19px" />
      </div>

      <CompareWordmark entry={entry} size={uniformSize} className="text-center" />
    </div>
  );
}

/** All wordmark fonts side-by-side — same word, same sizes, easy pick. */
export function WordmarkFontCompare() {
  const uniformSize = "clamp(1.35rem, 3.2vw, 2rem)";

  return (
    <div className="space-y-8">
      <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:overflow-visible md:px-0">
        <div className="flex min-w-max gap-3 md:min-w-0 md:w-full">
          {COMPARE_ENTRIES.map((entry) => (
            <CompareColumn key={entry.id} entry={entry} uniformSize={uniformSize} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-cream-warm/50 p-5 sm:p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
          Same size strip — {uniformSize}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6">
          {COMPARE_ENTRIES.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-1">
              <span className="text-[10px] font-medium text-charcoal-muted">{entry.name}</span>
              <CompareWordmark entry={entry} size={uniformSize} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-charcoal-muted">
        Pick an <code className="rounded bg-white px-1.5 py-0.5 text-xs">id</code> and tell me
        to apply it — or{" "}
        <Link href="/dev/wordmark-fonts" className="font-medium text-[#0D9488] hover:underline">
          view full detail cards
        </Link>
        .
      </p>
    </div>
  );
}
