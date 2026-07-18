"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

type PromoState = {
  promoCode: string | null;
  discountPercent: number | null;
  partnerName: string | null;
  applied: boolean;
  validating: boolean;
  error: string | null;
  applyPromoCode: (code: string) => Promise<boolean>;
  clearPromo: () => void;
};

const PromoCodeContext = createContext<PromoState | null>(null);

async function validatePromoCode(code: string) {
  const res = await fetch(`/api/promo/validate?code=${encodeURIComponent(code)}`);
  const data = (await res.json()) as {
    valid?: boolean;
    code?: string;
    partnerName?: string;
    discountPercent?: number;
    error?: string;
  };
  return data;
}

function PromoCodeProviderInner({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyPromoCode = useCallback(async (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      setError("Enter a promo code");
      setApplied(false);
      return false;
    }

    setValidating(true);
    setError(null);
    try {
      const data = await validatePromoCode(code);
      if (!data.valid || !data.code) {
        setPromoCode(null);
        setDiscountPercent(null);
        setPartnerName(null);
        setApplied(false);
        setError(data.error || "Invalid promo code");
        return false;
      }

      setPromoCode(data.code);
      setDiscountPercent(data.discountPercent ?? null);
      setPartnerName(data.partnerName ?? null);
      setApplied(true);
      setError(null);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("coolplugz_promo", data.code);
      }
      return true;
    } catch {
      setError("Could not validate promo code");
      setApplied(false);
      return false;
    } finally {
      setValidating(false);
    }
  }, []);

  const clearPromo = useCallback(() => {
    setPromoCode(null);
    setDiscountPercent(null);
    setPartnerName(null);
    setApplied(false);
    setError(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("coolplugz_promo");
    }
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get("promo");
    const fromStorage =
      typeof window !== "undefined" ? sessionStorage.getItem("coolplugz_promo") : null;
    const initial = fromUrl || fromStorage;
    if (initial) {
      void applyPromoCode(initial);
    }
  }, [searchParams, applyPromoCode]);

  const value = useMemo(
    () => ({
      promoCode,
      discountPercent,
      partnerName,
      applied,
      validating,
      error,
      applyPromoCode,
      clearPromo,
    }),
    [
      promoCode,
      discountPercent,
      partnerName,
      applied,
      validating,
      error,
      applyPromoCode,
      clearPromo,
    ]
  );

  return <PromoCodeContext.Provider value={value}>{children}</PromoCodeContext.Provider>;
}

/** Promo state for influencer checkout codes (?promo=CODE or manual entry). */
export function PromoCodeProvider({ children }: { children: ReactNode }) {
  return <PromoCodeProviderInner>{children}</PromoCodeProviderInner>;
}

export function usePromoCode() {
  const ctx = useContext(PromoCodeContext);
  if (!ctx) {
    throw new Error("usePromoCode must be used within PromoCodeProvider");
  }
  return ctx;
}

export function useOptionalPromoCode() {
  return useContext(PromoCodeContext);
}
