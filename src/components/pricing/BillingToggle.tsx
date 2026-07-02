"use client";

import type { BillingPeriod } from "@/lib/pricing-plans";
import { billingOptions } from "@/lib/pricing-plans";
import { cn } from "@/lib/utils";

type BillingToggleProps = {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
  className?: string;
};

/** Monthly vs annual billing switch — sits under the Pricing heading. */
export function BillingToggle({ value, onChange, className }: BillingToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-secondary/40 p-1",
        className
      )}
      role="group"
      aria-label="Billing period"
    >
      {(["monthly", "annual"] as const).map((period) => {
        const isActive = value === period;
        const toggleLabel = billingOptions[period].toggleLabel;

        return (
          <button
            key={period}
            type="button"
            onClick={() => onChange(period)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-charcoal shadow-sm"
                : "text-charcoal-muted hover:text-charcoal"
            )}
            aria-pressed={isActive}
          >
            {period === "monthly" ? "Monthly" : "Annual"}
            {toggleLabel && (
              <span
                className={cn(
                  "text-xs",
                  isActive ? "text-emerald-700" : "text-charcoal-muted"
                )}
              >
                {toggleLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
