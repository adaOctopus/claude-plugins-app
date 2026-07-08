import type { CSSProperties } from "react";
import {
  Montserrat,
  Nunito,
  Plus_Jakarta_Sans,
  Outfit,
  DM_Sans,
  Sora,
  Quicksand,
  Varela_Round,
  Poppins,
} from "next/font/google";

const montserrat = Montserrat({
  variable: "--font-wordmark-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const nunito = Nunito({
  variable: "--font-wordmark-nunito",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-wordmark-plus-jakarta",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const outfit = Outfit({
  variable: "--font-wordmark-outfit",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-wordmark-dm-sans",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const sora = Sora({
  variable: "--font-wordmark-sora",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-wordmark-quicksand",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const varelaRound = Varela_Round({
  variable: "--font-wordmark-varela-round",
  subsets: ["latin"],
  weight: ["400"],
});

const poppins = Poppins({
  variable: "--font-wordmark-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export type WordmarkFontVariant = {
  id: string;
  name: string;
  description: string;
  cssVar: string;
  fontWeight: number;
  letterSpacing: string;
  isCurrent?: boolean;
};

export const WORDMARK_FONT_VARIANTS: WordmarkFontVariant[] = [
  {
    id: "current",
    name: "Current — Playfair Display",
    description: "Serif italic with text-stroke — what the brand uses today.",
    cssVar: "--font-display",
    fontWeight: 600,
    letterSpacing: "-0.04em",
    isCurrent: true,
  },
  {
    id: "montserrat",
    name: "Montserrat",
    description: "Geometric sans — clean, confident, widely used in tech.",
    cssVar: "--font-wordmark-montserrat",
    fontWeight: 600,
    letterSpacing: "-0.03em",
  },
  {
    id: "nunito",
    name: "Nunito",
    description: "Rounded terminals — soft and approachable.",
    cssVar: "--font-wordmark-nunito",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  {
    id: "plus-jakarta",
    name: "Plus Jakarta Sans",
    description: "Modern startup feel with subtle roundness.",
    cssVar: "--font-wordmark-plus-jakarta",
    fontWeight: 600,
    letterSpacing: "-0.03em",
  },
  {
    id: "outfit",
    name: "Outfit",
    description: "Geometric and neutral — sharp at small sizes.",
    cssVar: "--font-wordmark-outfit",
    fontWeight: 600,
    letterSpacing: "-0.025em",
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    description: "Humanist sans — pairs naturally with Geist body text.",
    cssVar: "--font-wordmark-dm-sans",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  {
    id: "sora",
    name: "Sora",
    description: "Tech-friendly with light geometric roundness.",
    cssVar: "--font-wordmark-sora",
    fontWeight: 600,
    letterSpacing: "-0.03em",
  },
  {
    id: "quicksand",
    name: "Quicksand",
    description: "Explicitly rounded — playful, friendly.",
    cssVar: "--font-wordmark-quicksand",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  {
    id: "varela-round",
    name: "Varela Round",
    description: "Fully rounded — softest, most casual option.",
    cssVar: "--font-wordmark-varela-round",
    fontWeight: 400,
    letterSpacing: "-0.01em",
  },
  {
    id: "poppins",
    name: "Poppins",
    description: "Geometric with open counters — popular for product brands.",
    cssVar: "--font-wordmark-poppins",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
];

/** Combined next/font variable classes for the dev showcase route. */
export const wordmarkFontVariableClass = [
  montserrat.variable,
  nunito.variable,
  plusJakarta.variable,
  outfit.variable,
  dmSans.variable,
  sora.variable,
  quicksand.variable,
  varelaRound.variable,
  poppins.variable,
].join(" ");

export function wordmarkFontStyle(variant: WordmarkFontVariant): CSSProperties {
  return {
    fontFamily: `var(${variant.cssVar}), system-ui, sans-serif`,
    fontWeight: variant.fontWeight,
    letterSpacing: variant.letterSpacing,
    fontStyle: variant.isCurrent ? "italic" : "normal",
    lineHeight: 1.15,
    ...(variant.isCurrent
      ? {
          WebkitTextStroke: "0.018em currentColor",
          paintOrder: "stroke fill",
        }
      : {}),
  };
}
