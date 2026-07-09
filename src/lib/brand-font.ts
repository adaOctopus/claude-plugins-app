import localFont from "next/font/local";

/** Brand wordmark — Milk Peach Clean display font. */
export const brandWordmarkFont = localFont({
  src: "../../public/fonts/brand/milk-peach-clean.ttf",
  variable: "--font-brand-wordmark",
  display: "swap",
  weight: "400",
});

export const BRAND_WORDMARK_FAMILY = "Milk Peach Clean";
