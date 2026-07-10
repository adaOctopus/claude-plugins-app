/** Site launch mode — flip `NEXT_PUBLIC_SITE_MODE=LIVE` when ready to ship. */
export type SiteMode = "LIVE" | "WIP";

export const SITE_MODE: SiteMode =
  process.env.NEXT_PUBLIC_SITE_MODE === "LIVE" ? "LIVE" : "WIP";

export const COMING_SOON_SECTION_ID = "coming-soon";

export const comingSoonHref = `/#${COMING_SOON_SECTION_ID}` as const;

export function isLiveSite(): boolean {
  return SITE_MODE === "LIVE";
}

export function isWipSite(): boolean {
  return SITE_MODE === "WIP";
}

/** In WIP mode, product routes scroll to the waitlist section instead. */
export function resolveProductHref(liveHref: string): string {
  if (isLiveSite()) return liveHref;
  if (liveHref.startsWith("/#")) return liveHref;
  return comingSoonHref;
}
