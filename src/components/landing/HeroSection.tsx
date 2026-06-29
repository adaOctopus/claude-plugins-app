import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

/** Hero section — primary value proposition with buy and create CTAs. */
export function HeroSection() {
  return (
    <section className="hero-glow relative flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-20 text-center md:px-8">
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800">
        <Flag className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
        For engineers · Available now
      </span>

      <h1 className="font-serif text-4xl text-charcoal md:text-6xl lg:text-7xl">
        Claude Plugins that do your work
        <br />
        <span className="italic">extremely well</span>. So you don&apos;t have to.
      </h1>

      <p className="mt-6 max-w-2xl text-base font-light tracking-wide text-charcoal-muted md:text-lg">
        Gathers all the context needed from Jira, Slack, GitHub and technical
        documents, so AI can deliver your tasks accurately — built for{" "}
        <strong className="font-medium text-charcoal">software engineers</strong> first.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/pricing">Buy the Engineer Plugin</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="#plugins">See the plugin</Link>
        </Button>
      </div>

      <p className="mt-8 text-sm text-charcoal-muted">
        Context Engineer is live today. PM &amp; Design plugins coming soon.
      </p>
    </section>
  );
}
