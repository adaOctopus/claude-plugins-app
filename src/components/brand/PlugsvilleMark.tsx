import { cn } from "@/lib/utils";

const PLUGSVILLE_MARK = "/plugsville-mark.jpg";

/** plugsville plug mark — icon tile for navbar/footer lockups. */
export function PlugsvilleMark({
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
      src={PLUGSVILLE_MARK}
      alt=""
      width={size}
      height={size}
      className={cn("block h-full w-full object-contain p-0.5", className)}
    />
  );

  if (!framed) return image;

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-cream shadow-[0_1px_2px_rgba(45,41,38,0.08)]"
      style={{ width: size, height: size }}
    >
      {image}
    </span>
  );
}

/** Navbar/footer lockup: framed mark + wordmark. */
export function PlugsvilleLogo({
  className,
  markSize = 40,
}: {
  className?: string;
  markSize?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PlugsvilleMark size={markSize} framed />
      <span className="font-serif brand-lockup text-lg text-charcoal">plugsville</span>
    </span>
  );
}
