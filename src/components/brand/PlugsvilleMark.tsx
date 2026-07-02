/** plugsville monogram — pv. in Playfair on a cream tile with border. */
export function PlugsvilleMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  const fontSize = Math.round(size * 0.38);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[9px] border border-border bg-cream font-serif font-bold leading-none text-charcoal shadow-[0_1px_2px_rgba(45,41,38,0.07)] ${className ?? ""}`}
      style={{ width: size, height: size, fontSize }}
      aria-hidden
    >
      <span className="[font-variant:small-caps] tracking-[-0.08em]">pv</span>
      <span>.</span>
    </span>
  );
}

/** Navbar lockup: monogram + wordmark. */
export function PlugsvilleLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <PlugsvilleMark size={28} />
      <span className="font-serif brand-lockup text-lg text-charcoal">plugsville</span>
    </span>
  );
}
