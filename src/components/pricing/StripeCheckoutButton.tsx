"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { startStripeCheckout } from "@/lib/start-checkout";
import type { CheckoutPlan } from "@/lib/stripe";
import { cn } from "@/lib/utils";

type StripeCheckoutButtonProps = {
  plan: CheckoutPlan;
  pluginId?: string;
  children: ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
  loadingLabel?: string;
};

/** Sends the user straight to Stripe Checkout — no sign-in step. */
export function StripeCheckoutButton({
  plan,
  pluginId,
  children,
  className,
  size = "default",
  variant = "default",
  loadingLabel = "Redirecting...",
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await startStripeCheckout(plan, pluginId);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={cn(className)}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? loadingLabel : children}
    </Button>
  );
}
