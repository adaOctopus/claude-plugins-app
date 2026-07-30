import { brandWordmarkFont } from "@/lib/brand-font";
import { cn } from "@/lib/utils";

const COOLPLUGZ_MARK = "/coolplugz-mark.png";

const wordmarkStyles = cn(brandWordmarkFont.className, "brand-wordmark");

/** Brand mark — icon tile for navbar/footer lockups. */
export function CoolplugzMark({
  className,
  size = 40,
  framed = false,
}: {
  className?: string;
  size?: number;
  /** Rounded tile + border — used next to the wordmark. */
  framed?: boolean;
}) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={COOLPLUGZ_MARK}
      alt=""
      width={size}
      height={size}
      className={cn("block h-full w-full object-contain", className)}
    />
  );

  if (!framed) return image;

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-[0_1px_2px_rgba(45,41,38,0.08)]"
      style={{ width: size, height: size }}
    >
      {image}
    </span>
  );
}

/** Small mark for Claude chat mocks — padded so the logo is not clipped. */
export function CoolplugzChatAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-white p-1 shadow-sm",
        className ?? "h-6 w-6"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={COOLPLUGZ_MARK} alt="" className="h-full w-full object-contain" />
    </span>
  );
}

/** Inline brand wordmark — Milk Peach Clean lockup text. */
export function BrandWordmark({ className }: { className?: string }) {
  return <span className={cn(wordmarkStyles, className)}>coolplugz</span>;
}

/** Navbar/footer lockup: framed mark + wordmark. */
export function CoolplugzLogo({
  className,
  markSize = 40,
  wordmarkClassName,
}: {
  className?: string;
  markSize?: number;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <CoolplugzMark size={markSize} framed />
      <span className={cn(wordmarkStyles, wordmarkClassName ?? "text-[22px]")}>coolplugz</span>
    </span>
  );
}
