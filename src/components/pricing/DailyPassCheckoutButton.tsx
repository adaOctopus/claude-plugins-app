"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dailyPassLoginRedirect } from "@/lib/mcp-setup-paths";
import { cn } from "@/lib/utils";

type DailyPassCheckoutButtonProps = {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
};

/** Starts Stripe Checkout for the €5 Daily Pass. */
export function DailyPassCheckoutButton({
  className,
  variant = "outline",
  size = "default",
  children,
}: DailyPassCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/daily-checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };

      if (res.status === 401) {
        window.location.href = dailyPassLoginRedirect();
        return;
      }

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Could not start checkout");
    }
  }

  return (
    <div className="w-full">
      <Button
        type="button"
        className={cn("w-full", className)}
        variant={variant}
        size={size}
        disabled={loading}
        onClick={() => void handleClick()}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Redirecting…
          </>
        ) : (
          children
        )}
      </Button>
      {error ? <p className="mt-2 text-center text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
