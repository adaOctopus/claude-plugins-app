import { cn } from "@/lib/utils";

export type AccountTierBadge = "trial" | "pro";

type TierBadgeProps = {
  tier: AccountTierBadge;
  className?: string;
};

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-2 w-2 shrink-0", className)}
      aria-hidden
    >
      <path
        d="M6 0.5L11 6L6 11.5L1 6L6 0.5Z"
        fill="currentColor"
        fillOpacity="0.95"
      />
      <path
        d="M6 2.5L8.5 6L6 9.5L3.5 6L6 2.5Z"
        fill="white"
        fillOpacity="0.35"
      />
    </svg>
  );
}

/** Pill badge for account tier — free trial (green) or Pro (blue + diamond). */
export function TierBadge({ tier, className }: TierBadgeProps) {
  if (tier === "trial") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-white",
          "bg-gradient-to-br from-[#1F8F72] to-[#5BC4A8]",
          className
        )}
      >
        Free Trial
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-[0.06em] text-white",
        "bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#7DD3FC]",
        className
      )}
    >
      <DiamondIcon />
      Pro
    </span>
  );
}

export function resolveAccountTierBadge(input: {
  hasSubscription: boolean;
  trialActive: boolean;
}): AccountTierBadge | null {
  if (input.hasSubscription) return "pro";
  if (input.trialActive) return "trial";
  return null;
}
