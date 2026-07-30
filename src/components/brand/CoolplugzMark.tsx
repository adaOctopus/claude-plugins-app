import { brandWordmarkFont } from "@/lib/brand-font";
import { cn } from "@/lib/utils";

/** Navbar / footer lockup — pre-sized asset with padding baked in. */
const APP_LOGO = "/app-logo.png";

/** Chat mock avatars. */
const CHAT_AVATAR_MARK = "/cooldog.png";

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
      src={APP_LOGO}
      alt=""
      width={size}
      height={size}
      className={cn("block h-full w-full object-contain", className)}
    />
  );

  if (!framed) return image;

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-0.5 shadow-[0_1px_2px_rgba(45,41,38,0.08)]"
      style={{ width: size, height: size }}
    >
      {image}
    </span>
  );
}

/** Small mark for Claude chat mocks — full dog visible, never clipped. */
export function CoolplugzChatAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-white p-0.5 shadow-sm",
        className ?? "h-7 w-7"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={CHAT_AVATAR_MARK} alt="" className="h-full w-full object-contain" />
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
