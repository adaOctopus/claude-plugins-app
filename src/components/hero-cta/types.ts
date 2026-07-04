import type { ComponentType } from "react";

export type HeroCtaVariantMeta = {
  id: string;
  index: number;
  name: string;
  inspiration: string;
  description: string;
  Component: ComponentType;
};

export const HERO_CTA_HREF = "/pricing";
