import { CoolplugzMark } from "@/components/brand/CoolplugzMark";
import {
  WORDMARK_FONT_VARIANTS,
  wordmarkFontStyle,
  type WordmarkFontVariant,
} from "@/lib/brand-wordmark-fonts";
import { cn } from "@/lib/utils";

function WordmarkSample({
  variant,
  className,
  children = "coolplugz",
}: {
  variant: WordmarkFontVariant;
  className?: string;
  children?: string;
}) {
  return (
    <span className={cn("text-charcoal", className)} style={wordmarkFontStyle(variant)}>
      {children}
    </span>
  );
}

function VariantCard({ variant }: { variant: WordmarkFontVariant }) {
  return (
    <article
      className={cn(
        "rounded-2xl border bg-white p-6 md:p-8",
        variant.isCurrent ? "border-charcoal/30 ring-1 ring-charcoal/10" : "border-border"
      )}
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-charcoal-muted">
            {variant.isCurrent ? "Baseline" : "Candidate"}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-charcoal">{variant.name}</h2>
          <p className="mt-1 max-w-prose text-sm text-charcoal-muted">{variant.description}</p>
        </div>
        <code className="rounded-lg bg-cream-warm px-2 py-1 text-xs text-charcoal-muted">
          {variant.cssVar}
        </code>
      </div>

      <div className="space-y-8">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-charcoal-muted">
            Navbar lockup — 18px
          </p>
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-border bg-cream px-4 py-3">
            <CoolplugzMark size={38} framed />
            <WordmarkSample variant={variant} className="text-[18px]" />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-charcoal-muted">
            Inline mention — body copy
          </p>
          <p className="max-w-md text-base leading-relaxed text-charcoal-muted">
            Stop context-switching between Jira, Slack, and GitHub —{" "}
            <WordmarkSample variant={variant} className="text-base" /> handles it inside Claude.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-charcoal-muted">
            Hero scale — 32px
          </p>
          <WordmarkSample variant={variant} className="text-[32px] md:text-4xl" />
        </div>
      </div>
    </article>
  );
}

/** Side-by-side wordmark font comparison for brand selection. */
export function WordmarkFontShowcase() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {WORDMARK_FONT_VARIANTS.map((variant) => (
        <VariantCard key={variant.id} variant={variant} />
      ))}
    </div>
  );
}
