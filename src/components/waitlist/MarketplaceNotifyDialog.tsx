"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Sparkles, X } from "lucide-react";
import { BrandWordmark } from "@/components/brand/CoolplugzMark";
import { WaitlistEmailForm } from "@/components/waitlist/WaitlistEmailForm";
import { cn } from "@/lib/utils";

type MarketplaceNotifyContextValue = {
  openNotify: (source?: string) => void;
};

const MarketplaceNotifyContext = createContext<MarketplaceNotifyContextValue | null>(
  null
);

export function useMarketplaceNotify() {
  const ctx = useContext(MarketplaceNotifyContext);
  if (!ctx) {
    throw new Error("useMarketplaceNotify must be used within MarketplaceNotifyProvider");
  }
  return ctx;
}

/** Opens the marketplace waitlist popup (v2 — upload, browse, publish). */
export function MarketplaceNotifyProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("marketplace");

  const openNotify = useCallback((nextSource = "marketplace") => {
    setSource(nextSource);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <MarketplaceNotifyContext.Provider value={{ openNotify }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="marketplace-notify-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent-sage via-cream to-accent-peach shadow-[0_16px_48px_rgba(45,41,38,0.18)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-charcoal-muted transition-colors hover:bg-white/60 hover:text-charcoal"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 py-8 md:px-8 md:py-10">
              <p className="text-center text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
                Coming soon
              </p>
              <h2
                id="marketplace-notify-title"
                className="mt-2 text-center font-serif text-xl text-charcoal md:text-2xl"
              >
                <BrandWordmark className="text-[1.05em] align-baseline" />
              </h2>
              <p className="mt-3 text-center text-sm text-charcoal-muted">
                We&apos;ll let you know when browsing, uploading, and selling plugins goes live.
              </p>

              <ul className="mt-5 space-y-2 text-sm text-charcoal">
                <li className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-charcoal-muted" />
                  Early access when we flip the switch
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-charcoal-muted" />
                  One email. No spam.
                </li>
              </ul>

              <div className="mt-6 rounded-2xl border border-border/80 bg-white/90 px-5 py-6 shadow-sm">
                <WaitlistEmailForm source={source} />
              </div>
            </div>
          </div>
        </div>
      )}
    </MarketplaceNotifyContext.Provider>
  );
}

type MarketplaceNotifyTriggerProps = {
  children: ReactNode;
  source?: string;
  className?: string;
  asChild?: boolean;
};

/** Click target that opens the marketplace notify popup instead of navigating (v2). */
export function MarketplaceNotifyTrigger({
  children,
  source = "marketplace",
  className,
}: MarketplaceNotifyTriggerProps) {
  const { openNotify } = useMarketplaceNotify();

  return (
    <button
      type="button"
      onClick={() => openNotify(source)}
      className={cn(className)}
    >
      {children}
    </button>
  );
}
