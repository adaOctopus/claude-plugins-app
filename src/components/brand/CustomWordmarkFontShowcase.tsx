import { CoolplugzMark } from "@/components/brand/CoolplugzMark";
import {
  CUSTOM_BRAND_FONTS,
  type CustomBrandFont,
} from "@/lib/custom-brand-fonts";
import { cn } from "@/lib/utils";

function CustomWordmarkSample({
  font,
  className,
  size,
  children = "coolplugz",
}: {
  font: CustomBrandFont;
  className?: string;
  size: string;
  children?: string;
}) {
  return (
    <span
      className={cn("text-charcoal", className)}
      style={{
        fontFamily: `"${font.fontFamily}", system-ui, sans-serif`,
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: size,
        letterSpacing: font.letterSpacing ?? "-0.02em",
        lineHeight: 1.05,
      }}
    >
      {children}
    </span>
  );
}

function CustomFontCard({ font }: { font: CustomBrandFont }) {
  return (
    <article className="rounded-2xl border-2 border-[#7DD3C0]/40 bg-gradient-to-b from-[#E8FAF6]/50 to-white p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#0D9488]">
            Your pick
          </p>
          <h2 className="mt-1 text-lg font-semibold text-charcoal">{font.name}</h2>
          <p className="mt-1 max-w-prose text-sm text-charcoal-muted">{font.description}</p>
        </div>
        <code className="rounded-lg bg-cream-warm px-2 py-1 text-xs text-charcoal-muted">
          {font.id}
        </code>
      </div>

      <div className="space-y-8">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-charcoal-muted">
            Navbar lockup
          </p>
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-border bg-cream px-4 py-3">
            <CoolplugzMark size={42} framed />
            <CustomWordmarkSample font={font} size={font.navSize} />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-charcoal-muted">
            Inline mention
          </p>
          <p className="max-w-md text-base leading-relaxed text-charcoal-muted">
            Stop context-switching between Jira, Slack, and GitHub —{" "}
            <CustomWordmarkSample font={font} size="1.05rem" /> handles it inside Claude.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-charcoal-muted">
            Hero scale
          </p>
          <CustomWordmarkSample font={font} size={font.heroSize} />
        </div>
      </div>
    </article>
  );
}

/** Showcase for user-supplied custom brand fonts. */
export function CustomWordmarkFontShowcase() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {CUSTOM_BRAND_FONTS.map((font) => (
        <CustomFontCard key={font.id} font={font} />
      ))}
    </div>
  );
}
