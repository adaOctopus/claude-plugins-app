"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type CancelSubscriptionButtonProps = {
  currentPeriodEnd: string;
};

/** Text link + modal — cancel active subscription from Manage Account. */
export function CancelSubscriptionButton({ currentPeriodEnd }: CancelSubscriptionButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessUntil = new Date(currentPeriodEnd).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, loading]);

  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);

  async function handleCancel() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/cancel-subscription", { method: "POST" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Cancel failed");
      setCanceled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    } finally {
      setLoading(false);
    }
  }

  if (canceled) {
    return (
      <p className="text-right text-sm text-charcoal-muted">
        Subscription canceled. Access until {accessUntil}.
      </p>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-charcoal-muted underline-offset-2 transition-colors hover:text-charcoal hover:underline"
      >
        unhappy with Coolplugz?
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-subscription-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]"
            aria-label="Close"
            disabled={loading}
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-cream shadow-[0_16px_48px_rgba(45,41,38,0.18)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="absolute right-4 top-4 rounded-full p-1.5 text-charcoal-muted transition-colors hover:bg-white/60 hover:text-charcoal disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 py-8 md:px-8">
              <h2
                id="cancel-subscription-title"
                className="font-serif text-xl text-charcoal md:text-2xl"
              >
                Cancel subscription?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">
                You&apos;ll keep access until <span className="font-medium text-charcoal">{accessUntil}</span>.
                After that, your MCP URL stops working until you resubscribe.
              </p>

              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Keep subscription
                </Button>
                <Button
                  type="button"
                  className="border-red-300 bg-red-600 text-white hover:bg-red-700"
                  onClick={() => void handleCancel()}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                      Canceling…
                    </>
                  ) : (
                    "Cancel subscription"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
