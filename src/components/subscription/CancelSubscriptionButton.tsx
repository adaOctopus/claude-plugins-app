"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type CancelSubscriptionButtonProps = {
  currentPeriodEnd: string;
};

/** Cancel active subscription — only place that mentions canceling. */
export function CancelSubscriptionButton({ currentPeriodEnd }: CancelSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renewsOn = new Date(currentPeriodEnd).toLocaleDateString();

  async function handleCancel() {
    const confirmed = window.confirm("Cancel subscription?");
    if (!confirmed) return;

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
      <p className="text-sm text-charcoal-muted">
        Canceled. Access until {renewsOn}.
      </p>
    );
  }

  return (
    <div>
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-red-300 text-red-700 hover:bg-red-50"
        onClick={handleCancel}
        disabled={loading}
      >
        {loading ? "Canceling..." : "Cancel subscription"}
      </Button>
    </div>
  );
}
