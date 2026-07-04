import type { HeroCtaVariantMeta } from "./types";
import { CtaAnthropicQuiet } from "./variants/CtaAnthropicQuiet";
import { CtaCursorDev } from "./variants/CtaCursorDev";
import { CtaMonoBadge } from "./variants/CtaMonoBadge";

/** Registry of all hero CTA variants for the showcase picker. */
export const heroCtaVariants: HeroCtaVariantMeta[] = [
  {
    id: "anthropic-quiet",
    index: 1,
    name: "Anthropic Quiet",
    inspiration: "Anthropic",
    description: "Sentence case, font-normal, plug icon",
    Component: CtaAnthropicQuiet,
  },
  {
    id: "cursor-dev",
    index: 2,
    name: "Cursor Dev",
    inspiration: "Cursor",
    description: "Install in Claude + mono sub-line",
    Component: CtaCursorDev,
  },
  {
    id: "mono-badge",
    index: 3,
    name: "Mono Badge",
    inspiration: "Dev tools",
    description: "Geist Mono, uppercase tracking",
    Component: CtaMonoBadge,
  },
];
