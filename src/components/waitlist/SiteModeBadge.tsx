import { cn } from "@/lib/utils";
import { isLiveSite, SITE_MODE } from "@/lib/site-mode";

/** Navbar pill — shows LIVE or WIP site mode. */
export function SiteModeBadge({ className }: { className?: string }) {
  const live = isLiveSite();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
        live
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-amber-200 bg-amber-50 text-amber-900",
        className
      )}
      aria-label={`Site status: ${SITE_MODE}`}
    >
      <span
        className={cn(
          "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
          live ? "bg-emerald-500" : "bg-amber-500"
        )}
        aria-hidden
      />
      {SITE_MODE}
    </span>
  );
}
