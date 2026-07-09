/** Custom downloaded brand wordmark fonts — served from /public/fonts/brand/. */
export type CustomBrandFont = {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  /** Navbar lockup size — display fonts often need a bump. */
  navSize: string;
  heroSize: string;
  letterSpacing?: string;
};

export const CUSTOM_BRAND_FONTS: CustomBrandFont[] = [
  {
    id: "milk-peach-clean",
    name: "Milk Peach Clean",
    description: "Soft rounded display — clean outlines, friendly and legible.",
    fontFamily: "Milk Peach Clean",
    navSize: "23px",
    heroSize: "2.75rem",
    letterSpacing: "-0.015em",
  },
  {
    id: "milk-peach",
    name: "Milk Peach",
    description: "Original Milk Peach — slightly more texture and character.",
    fontFamily: "Milk Peach",
    navSize: "23px",
    heroSize: "2.75rem",
    letterSpacing: "-0.015em",
  },
  {
    id: "quirk-chick",
    name: "Quirk Chick",
    description: "Playful rounded display — thick, hand-crafted personality.",
    fontFamily: "Quirk Chick",
    navSize: "22px",
    heroSize: "2.75rem",
    letterSpacing: "-0.01em",
  },
  {
    id: "creamy-chocolate",
    name: "Creamy Chocolate",
    description: "Soft rounded script-sans hybrid — smooth and modern.",
    fontFamily: "Creamy Chocolate",
    navSize: "20px",
    heroSize: "2.5rem",
    letterSpacing: "0",
  },
  {
    id: "clipper",
    name: "Clipper",
    description: "Bold display cut — strong curves, logo-ready weight.",
    fontFamily: "Clipper",
    navSize: "21px",
    heroSize: "2.65rem",
    letterSpacing: "-0.02em",
  },
  {
    id: "clever-couple",
    name: "Clever Couple",
    description: "Calligraphic display sans — flowing but still thick.",
    fontFamily: "Clever Couple",
    navSize: "20px",
    heroSize: "2.5rem",
    letterSpacing: "-0.015em",
  },
];
