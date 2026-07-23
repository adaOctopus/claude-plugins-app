"use client";

import { useState } from "react";
import { Copy, Check, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReferralStatsCard } from "@/components/referral/ReferralStatsCard";
import { cn } from "@/lib/utils";

type ReferralStats = {
  redemptionCount: number;
  totalNetRevenue: number;
  totalPartnerShare: number;
};

type GenerateResponse = {
  code: string;
  shareUrl: string;
  discountPercent: number;
  revenueSharePercent: number;
  created: boolean;
  stats: ReferralStats;
  error?: string;
};

type ReferralGeneratorProps = {
  /** Inside the gradient section card — no extra outer chrome. */
  embedded?: boolean;
};

/** Email → unique promo code + share link for the dev referral program. */
export function ReferralGenerator({ embedded = false }: ReferralGeneratorProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [copiedField, setCopiedField] = useState<"code" | "url" | null>(null);

  async function handleGenerate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/referral/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as GenerateResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Could not generate referral link");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate referral link");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function copyText(value: string, field: "code" | "url") {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setError("Could not copy to clipboard");
    }
  }

  return (
    <div className={cn(!embedded && "rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8")}>
      {!result ? (
        <form onSubmit={handleGenerate} className="w-full">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted"
                aria-hidden
              />
              <Input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-11 rounded-full border-border bg-white pl-10 pr-4 shadow-sm"
                aria-label="Email for referral payouts"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 shrink-0 rounded-full px-6 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Generating…
                </>
              ) : (
                "Get my link"
              )}
            </Button>
          </div>
          {error ? (
            <p className="mt-2 text-center text-xs text-red-600 sm:text-left">{error}</p>
          ) : (
            <p className="mt-2 text-center text-[11px] text-charcoal-muted sm:text-left">
              One link per email. Payouts go to this address.
            </p>
          )}
        </form>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
              Your promo code
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="flex-1 rounded-full bg-cream-warm px-4 py-2.5 font-mono text-sm text-charcoal">
                {result.code}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 gap-2 rounded-full"
                onClick={() => copyText(result.code, "code")}
              >
                {copiedField === "code" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Copy
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
              Share link
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="flex-1 break-all rounded-2xl bg-cream-warm px-4 py-2.5 font-mono text-xs text-charcoal sm:text-sm">
                {result.shareUrl}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 gap-2 rounded-full"
                onClick={() => copyText(result.shareUrl, "url")}
              >
                {copiedField === "url" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Copy
              </Button>
            </div>
          </div>

          <p className="text-sm text-charcoal-muted">
            Friends get {result.discountPercent}% off · You earn {result.revenueSharePercent}% on
            every payment and renewal.
            {!result.created ? " We found your existing code." : null}
          </p>

          <ReferralStatsCard stats={result.stats} revenueSharePercent={result.revenueSharePercent} />
        </div>
      )}
    </div>
  );
}
