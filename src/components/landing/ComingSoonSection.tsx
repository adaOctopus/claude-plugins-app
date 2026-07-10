import { Badge } from "@/components/ui/badge";
import { BrandWordmark } from "@/components/brand/CoolplugzMark";
import { WaitlistEmailForm } from "@/components/waitlist/WaitlistEmailForm";
import { COMING_SOON_SECTION_ID, isWipSite } from "@/lib/site-mode";
import { Sparkles } from "lucide-react";

/** Coming-soon waitlist block — shown on landing while site is in WIP mode. */
export function ComingSoonSection() {
  if (!isWipSite()) return null;

  return (
    <section
      id={COMING_SOON_SECTION_ID}
      className="scroll-mt-28 border-t border-border/60 px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent-sage via-cream to-accent-peach">
        <div className="grid items-center gap-10 p-8 md:grid-cols-2 md:gap-12 md:p-14 lg:p-16">
          <div>
            <Badge variant="secondary" className="mb-4 bg-accent-peach/70 text-charcoal">
              Coming soon😉
            </Badge>
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl lg:text-[2.75rem] lg:leading-tight">
              When <BrandWordmark className="text-[1.05em] align-baseline" /> goes live we let you know first.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal-muted md:text-base">
              {/* Payments, plugins, and the full marketplace are almost ready. Leave your
              email — we&apos;ll ping you on launch day. */}
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-charcoal">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-charcoal-muted" />
                Early access when we flip the switch
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-charcoal-muted" />
                One email. No spam.
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <div className="w-full max-w-md rounded-2xl border border-border/80 bg-white/90 px-6 py-8 shadow-[0_8px_32px_rgba(45,41,38,0.08)] backdrop-blur-sm md:px-8 md:py-10">
              <p className="text-center text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
                Join the waitlist
              </p>
              <p className="mt-2 text-center font-serif text-lg text-charcoal md:text-xl">
                Launch day notification
              </p>
              <div className="mt-6 md:mt-8">
                <WaitlistEmailForm source="coming-soon-section" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
