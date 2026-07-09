import type { Metadata } from "next";
import { CustomWordmarkFontShowcase } from "@/components/brand/CustomWordmarkFontShowcase";
import { WordmarkFontShowcase } from "@/components/brand/WordmarkFontShowcase";
import "./custom-fonts.css";

export const metadata: Metadata = {
  title: "Wordmark font showcase",
  robots: { index: false, follow: false },
};

/** Dev-only page to compare wordmark fonts for the coolplugz brand. */
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
          Your downloaded fonts — reply with the{" "}
          <code className="rounded bg-cream-warm px-1.5 py-0.5 text-sm">id</code> slug to apply live.
        </p>
        <p className="mt-2 text-xs text-charcoal-muted">
          Note: these files are personal-use licenses — confirm commercial rights before launch.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="mb-6 font-serif text-2xl text-charcoal">Your downloads</h2>
        <CustomWordmarkFontShowcase />
      </section>

      <section>
        <h2 className="mb-6 font-serif text-2xl text-charcoal-muted">Google Font options</h2>
        <WordmarkFontShowcase />
      </section>
    </div>
  );
}
