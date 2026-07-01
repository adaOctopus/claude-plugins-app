import Link from "next/link";
import { Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroDashboard } from "@/components/landing/HeroDashboard";

/** Hero section — split layout: copy left, outcome dashboard right. */
export function HeroSection() {
  return (
    <section className="hero-glow relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden px-4 pb-12 pt-[7rem] md:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(232,237,230,0.45),transparent_50%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-12 xl:gap-16">
        <div className="text-left">
          <h1 className="max-w-lg font-serif text-4xl text-charcoal md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Deliver your coding tasks{" "}
            <em className="font-medium italic">faster</em> and without{" "}
            <span className="relative inline-block font-medium italic text-charcoal/85">
              Slack-anxiety
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[54%] h-[2.5px] bg-charcoal/75 md:h-[3px]"
              />
            </span>
            .
          </h1>

          <p className="mt-5 max-w-md text-sm leading-snug text-charcoal-muted md:text-base">
            A Claude plugin that scans Jira tickets,
            Slack threads, GitHub repos & Notion docs and executes your coding tasks
            with full context.
          </p>

          <div className="mt-8">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/pricing" className="inline-flex items-center gap-2">
                <Plug className="h-4 w-4 text-white" strokeWidth={2.25} />
                GET STARTED NOW
              </Link>
            </Button>
          </div>
        </div>

        <HeroDashboard />
      </div>
    </section>
  );
}
