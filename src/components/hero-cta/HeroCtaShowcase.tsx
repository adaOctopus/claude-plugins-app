import { heroCtaVariants } from "./registry";

/** Labeled stack of 10 hero CTA variants for visual comparison. */
export function HeroCtaShowcase() {
  return (
    <div className="max-w-md">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-charcoal-muted">
        Pick a CTA style
      </p>

      <ul className="flex flex-col gap-4">
        {heroCtaVariants.map(({ id, index, name, inspiration, description, Component }) => (
          <li
            key={id}
            className="rounded-xl border border-border/80 bg-white/50 p-4 backdrop-blur-sm"
          >
            <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-mono text-xs font-medium text-charcoal-muted">
                #{index}
              </span>
              <span className="text-sm font-semibold text-charcoal">{name}</span>
              <span className="text-xs text-charcoal-muted">· {inspiration}</span>
            </div>
            <p className="mb-3 text-xs text-charcoal-muted">{description}</p>
            <Component />
          </li>
        ))}
      </ul>
    </div>
  );
}
