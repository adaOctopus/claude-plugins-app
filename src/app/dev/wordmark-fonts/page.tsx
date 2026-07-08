import type { Metadata } from "next";
import { WordmarkFontShowcase } from "@/components/brand/WordmarkFontShowcase";

export const metadata: Metadata = {
  title: "Wordmark font showcase",
  robots: { index: false, follow: false },
};

/** Dev-only page to compare sans-serif wordmark fonts for the coolplugz brand. */
export default function WordmarkFontsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-32 md:px-8">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-wider text-charcoal-muted">
          Dev showcase
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal md:text-4xl">
          coolplugz wordmark fonts
        </h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal-muted">
          Compare rounded sans options for the brand name only. Page body copy stays on Geist —
          pick the lockup that reads best at navbar size next to the plug icon.
        </p>
      </div>

      <WordmarkFontShowcase />
    </div>
  );
}
