import { brandWordmarkFont } from "@/lib/brand-font";
import "../wordmark-fonts/custom-fonts.css";

/** Loads custom @font-face + live brand variable for compare page. */
export default function WordmarkCompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={brandWordmarkFont.variable}>{children}</div>;
}
