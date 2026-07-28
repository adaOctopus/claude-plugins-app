import { Badge } from "@/components/ui/badge";
import { ReferralGenerator } from "@/components/referral/ReferralGenerator";
import { MAKE_MONEY_SECTION_ID } from "@/lib/referral-seo-copy";
import { TrendingUp } from "lucide-react";

const perks = [
  { emoji: "🔗", text: "Unique referral link tied to your email" },
  { emoji: "💰", text: "15% revenue share on every subscription & renewal" },
  { emoji: "🎁", text: "They also get 15% off when they join through you" },
  { emoji: "📈", text: "Earn as long as your referrals stay subscribed" },
];

/** Small ascending chart — revenue-share concept, gold accent. */
function RevenueUpVisual() {
  return (
    <div
      className="mb-6 inline-flex flex-col rounded-2xl border border-white/80 bg-white/55 px-5 py-4 shadow-[0_4px_20px_rgba(45,41,38,0.06)] backdrop-blur-sm"
      aria-hidden
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50">
          <TrendingUp className="h-4 w-4 text-amber-700" strokeWidth={2.25} />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-muted">
            Revenue share
          </p>
          <p className="text-xs font-medium text-charcoal">Grows with renewals</p>
        </div>
      </div>
      <svg viewBox="0 0 140 44" className="mt-3 h-11 w-[8.75rem]" role="img" aria-label="Revenue trending up">
        <defs>
          <linearGradient id="makeMoneyRevFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M4 38 L32 30 L58 32 L88 20 L136 10"
          fill="none"
          stroke="#B45309"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 38 L32 30 L58 32 L88 20 L136 10 L136 44 L4 44 Z"
          fill="url(#makeMoneyRevFill)"
        />
        <circle cx="136" cy="10" r="3" fill="#D97706" />
      </svg>
    </div>
  );
}

/** Homepage section — developer revenue share for inviting other devs to CoolPlugz. */
export function MakeMoneySection() {
  return (
    <section
      id={MAKE_MONEY_SECTION_ID}
      aria-labelledby="make-money-heading"
      className="scroll-mt-28 border-t border-border/60 px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-accent-sage via-cream to-amber-50/90 shadow-[0_8px_40px_rgba(45,41,38,0.06)]">
        <div className="grid items-center gap-10 p-8 md:grid-cols-2 md:gap-12 md:p-14 lg:p-16">
          <div>
            {/* <RevenueUpVisual /> */}
            <Badge variant="secondary" className="mb-4 bg-white/70 text-charcoal">
              Developers Revenue Share
            </Badge>
            <h2
              id="make-money-heading"
              className="font-serif text-3xl text-charcoal md:text-4xl lg:text-[2.65rem] lg:leading-[1.15]"
            >
              Make money with{" "}
              <span style={{ fontStyle: "italic", fontWeight: "600" }}>CoolPlugz</span>💰
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal-muted md:text-[15px]">
              Share CoolPlugz with engineers you know - we pay{" "}
              <span className="font-medium text-charcoal">15% revenue share</span> when they
              subscribe, including every renewal.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-charcoal">
              {perks.map(({ emoji, text }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <span className="shrink-0 text-base leading-none" aria-hidden>
                    {emoji}
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <div className="w-full max-w-md rounded-2xl border border-border/80 bg-white/92 px-6 py-8 shadow-[0_8px_32px_rgba(45,41,38,0.07)] backdrop-blur-sm md:px-8 md:py-10">
              <p className="text-center text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
                Get your referral link
              </p>
              <p className="mt-2 text-center font-serif text-lg text-charcoal md:text-xl">
                Start earning today
              </p>
              <div className="mt-6 md:mt-8">
                <ReferralGenerator embedded />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
