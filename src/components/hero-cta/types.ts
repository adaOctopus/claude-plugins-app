import type { ComponentType } from "react";
import { resolveProductHref } from "@/lib/site-mode";

export type HeroCtaVariantMeta = {
  id: string;
  index: number;
  name: string;
  inspiration: string;
  description: string;
  Component: ComponentType;
};

export const HERO_CTA_HREF = resolveProductHref("/pricing");
