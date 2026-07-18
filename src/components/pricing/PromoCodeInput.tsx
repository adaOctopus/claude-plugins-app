"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePromoCode } from "@/components/pricing/PromoCodeProvider";

/** Collapsed promo entry — below pricing cards; URL ?promo= applies silently. */
export function PromoCodeInput() {
  const { applied, discountPercent, validating, error, applyPromoCode, clearPromo, promoCode } =
    usePromoCode();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  async function handleApply(event: React.FormEvent) {
    event.preventDefault();
    const ok = await applyPromoCode(value);
    if (ok) {
      setValue("");
      setOpen(false);
    }
  }

  if (applied && promoCode && discountPercent != null) {
    return (
      <p className="mt-5 text-center text-xs text-charcoal-muted">
        <span className="font-medium text-[#0D9488]">
          {promoCode} — {discountPercent}% off applied at checkout
        </span>{" "}
        <button
          type="button"
          onClick={clearPromo}
          className="text-charcoal-muted underline underline-offset-2 hover:text-charcoal"
        >
          Remove
        </button>
      </p>
    );
  }

  if (!open) {
    return (
      <p className="mt-5 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-charcoal-muted underline underline-offset-2 hover:text-charcoal"
        >
          Have a promo code?
        </button>
      </p>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-xs">
      <form onSubmit={handleApply} className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="Code"
          className="h-9 bg-white px-3 text-sm font-mono uppercase tracking-wide"
          disabled={validating}
          autoFocus
          aria-label="Promo code"
        />
        <Button type="submit" variant="outline" size="sm" className="h-9 shrink-0 px-3" disabled={validating}>
          {validating ? "…" : "Apply"}
        </Button>
      </form>
      {error && <p className="mt-1.5 text-center text-xs text-red-600">{error}</p>}
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setValue("");
        }}
        className="mt-1.5 w-full text-center text-xs text-charcoal-muted hover:text-charcoal"
      >
        Cancel
      </button>
    </div>
  );
}
