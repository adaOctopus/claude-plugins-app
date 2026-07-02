import Image from "next/image";
import { cn } from "@/lib/utils";
import plugsvilleMark from "@/assets/plugsville-mark.png";

/** plugsville carrot-plug mark — brand icon from logo asset. */
export function PlugsvilleMark({
  className,
  size = 48,
  framed = false,
}: {
  className?: string;
  size?: number;
  /** Rounded tile + border — used in navbar/footer lockup. */
  framed?: boolean;
}) {
  const image = (
    <Image
      src={plugsvilleMark}
      alt="plugsville"
      width={size}
      height={size}
      className={cn("h-full w-full object-contain", !framed && "shrink-0", className)}
      priority
    />
  );

  if (!framed) return image;

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-border bg-cream shadow-[0_1px_2px_rgba(45,41,38,0.07)]"
      style={{ width: size, height: size }}
    >
      {image}
    </span>
  );
}

/** Navbar lockup: framed mark + wordmark. */
export function PlugsvilleLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <PlugsvilleMark size={48} framed />
      <span className="font-serif brand-lockup text-lg text-charcoal">plugsville</span>
    </span>
  );
}
