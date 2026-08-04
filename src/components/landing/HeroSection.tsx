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
          <h1 className="hero-headline max-w-xl font-serif text-[1.555rem] leading-[1.15] text-charcoal max-sm:max-w-none sm:text-[2rem] md:text-3xl md:leading-[1.12] lg:text-[2.65em] lg:leading-[1.1]">
            <span className="block whitespace-nowrap">Tired of babysitting coding</span>
            <span className="block whitespace-nowrap">
             agents, fixing CI and
            </span>
            <span className="block whitespace-nowrap">
            switching tools all day?<span style={{ fontSize: '0.9em', marginLeft: '-0.1em' }}>😮‍💨</span>
            {/* Try Coolplugz<span style={{ fontSize: '0.9em', marginLeft: '-0.2em' }}>😎</span> */}
            {/* <span style={{ fontSize: '1.0em', marginLeft: '-0.3em' }}>🔌</span> */}
            </span>
            
          </h1>
{/* <span style={{ fontSize: '0.8em', marginLeft: '-0.2em' }}>🍼</span> */}
          <p className="mt-2 text-xs font-normal uppercase tracking-wide text-charcoal-muted/90">
          TRY THE BEST CLAUDE CODE TOOL FOR DEVS
          {/* <span className="inline text-[0.8em] -ml-[0.5em]">🔋</span> */}
          
          </p>

          <p className="mt-5 max-w-md text-sm leading-snug text-charcoal-muted md:text-base">
           An orchestrator that ensures Claude Code delivers your tasks without your constant supervision.</p>
          <div className="mt-8">
            <CtaMonoBadge />
          </div>
        </div>

        <HeroDashboard />
      </div>
    </section>
  );
}
