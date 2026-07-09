import { brandWordmarkFont, BRAND_WORDMARK_FAMILY } from "@/lib/brand-font";
import { wordmarkFontVariableClass } from "@/lib/brand-wordmark-fonts";

/** Loads showcase fonts without affecting the main site layout. */
export default function WordmarkFontsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${wordmarkFontVariableClass} ${brandWordmarkFont.variable}`}>
      {children}
    </div>
  );
}
