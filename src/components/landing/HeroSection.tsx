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
          <h1 className="hero-headline max-w-xl font-serif text-[1.875rem] leading-[1.15] text-charcoal max-sm:max-w-none sm:text-[2rem] md:text-3xl md:leading-[1.12] lg:text-[2.9em] lg:leading-[1.1]">
            <span className="block whitespace-nowrap">Tired of AI fatigue and</span>
            <span className="block whitespace-nowrap">
               context switching?
            </span>
            <span className="block whitespace-nowrap">
               Try Coolplugz😎
            </span>
            {/* <span className="inline text-[0.8em] -ml-[0.2em]">🔋</span> */}
          </h1>
{/* <span style={{ fontSize: '0.8em', marginLeft: '-0.2em' }}>🍼</span> */}
          <p className="mt-2 text-xs font-normal uppercase tracking-wide text-charcoal-muted/90">
          #1 Claude plugin for devs · save +10hrs/week
          </p>

          <p className="mt-5 max-w-md text-sm leading-snug text-charcoal-muted md:text-base">
            Fetches context from your entire stack, writes excellent prompts, ships merge-ready code & handles your Slack too.
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
