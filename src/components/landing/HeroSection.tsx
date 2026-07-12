import { HeroDashboard } from "@/components/landing/HeroDashboard";
import { CtaMonoBadge } from "@/components/hero-cta";

/** Hero section — split layout: copy left, outcome dashboard right. */
export function HeroSection() {
  return (
    <section className="hero-glow relative flex min-h-[calc(100dvh-4rem)] items-center px-4 pb-12 pt-[7rem] md:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(232,237,230,0.45),transparent_50%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-12 xl:gap-16">
        <div className="text-left">
          <h1 className="max-w-xl font-serif text-[1.625rem] leading-[1.15] text-charcoal sm:text-[1.875rem] md:text-3xl md:leading-[1.12] lg:text-[2.5rem] lg:leading-[1.1]">
            Ships<em className="font-medium italic"> merge-ready</em> code and handles your <em className="font-medium italic">Slack</em> too😎<br />
          </h1>

          <p className="mt-5 max-w-md text-sm leading-snug text-charcoal-muted md:text-base">
            A plugin that gathers context from your entire stack, writes your prompts, ships merge-ready code & handles your Slack too. All inside Claude.
          </p>

          <div className="mt-8">
            <CtaMonoBadge />
          </div>
        </div>

        <HeroDashboard />
      </div>
    </section>
  );
}
