import { cn } from "@/lib/utils";

const COOLPLUGZ_MARK = "/coolplugz-mark.png";

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
      className={cn("block h-full w-full object-cover", className)}
    />
  );

  if (!framed) return image;

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-[#FFF4E8] shadow-[0_1px_2px_rgba(45,41,38,0.08)]"
      style={{ width: size, height: size }}
    >
      {image}
    </span>
  );
}

/** Inline brand wordmark — same style as navbar/footer lockup text. */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-serif brand-lockup text-charcoal", className)}>
      coolplugz
    </span>
  );
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
      <span
        className={cn(
          "font-serif brand-lockup text-charcoal",
          wordmarkClassName ?? "text-lg"
        )}
      >
        coolplugz
      </span>
    </span>
  );
}
