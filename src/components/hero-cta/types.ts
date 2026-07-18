import type { ComponentType } from "react";
import { comingSoonHref, isWipSite } from "@/lib/site-mode";

export type HeroCtaVariantMeta = {
  id: string;
  index: number;
  name: string;
  inspiration: string;
  description: string;
  Component: ComponentType;
};

/** Hero CTA — scroll to on-page pricing, not the /pricing route. */
export const HERO_CTA_HREF = isWipSite() ? comingSoonHref : "/#pricing";
