import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GuideBlock, GuideSection } from "@/lib/guides/types";
import { resolveProductHref } from "@/lib/site-mode";
import { cn } from "@/lib/utils";
import { dedupeRelatedLinks } from "@/lib/guides/registry";

function RenderBlock({ block }: { block: GuideBlock }) {
  if (block.type === "p") {
    return <p>{block.text}</p>;
  }
  if (block.type === "h3") {
    return <h3 className="mt-4 font-semibold text-charcoal">{block.text}</h3>;
  }
  return (
    <ul className="list-disc space-y-2 pl-5">
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function RenderSection({ section }: { section: GuideSection }) {
  return (
    <section>
      <h2 className="font-serif text-xl text-charcoal md:text-2xl">{section.title}</h2>
      <div className="mt-3 space-y-3 text-charcoal-muted">
        {section.blocks.map((block, index) => (
          <RenderBlock key={`${section.id}-${index}`} block={block} />
        ))}
      </div>
    </section>
  );
}

type GuideDocumentProps = {
  title: string;
  category?: string;
  directAnswer: string;
  sections: GuideSection[];
  productPitch: { title: string; paragraphs: string[] };
  relatedLinks: { href: string; label: string }[];
};

/** SEO guide layout — snippet-first structure with related links and CTA. */
export function GuideDocument({
  title,
  category,
  directAnswer,
  sections,
  productPitch,
  relatedLinks,
}: GuideDocumentProps) {
  const ctaHref = resolveProductHref("/pricing");
  const uniqueRelatedLinks = dedupeRelatedLinks(relatedLinks);

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 md:px-8 md:py-32">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-charcoal-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-charcoal">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/guides" className="hover:text-charcoal">
              Guides
            </Link>
          </li>
          {category ? (
            <>
              <li aria-hidden="true">/</li>
              <li className="capitalize text-charcoal">{category}</li>
            </>
          ) : null}
        </ol>
      </nav>

      {category ? (
        <Badge variant="secondary" className="mb-4 capitalize">
          {category}
        </Badge>
      ) : null}
      <h1 className="font-serif text-4xl text-charcoal md:text-5xl">{title}</h1>

      <div className="mt-6 rounded-2xl border border-[#7DD3C0]/35 bg-[#E8FAF6]/50 px-4 py-4 md:px-5">
        <p className="text-xs font-bold uppercase tracking-wide text-[#0D9488]">Direct answer</p>
        <p className="mt-2 text-[15px] leading-relaxed text-charcoal md:text-base">{directAnswer}</p>
      </div>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed md:text-base">
        {sections.map((section) => (
          <RenderSection key={section.id} section={section} />
        ))}

        <section className="rounded-2xl border border-border bg-cream-warm/60 p-5 md:p-6">
          <h2 className="font-serif text-xl text-charcoal md:text-2xl">{productPitch.title}</h2>
          <div className="mt-3 space-y-3 text-charcoal-muted">
            {productPitch.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <Button asChild className="mt-5 rounded-full">
            <Link href={ctaHref}>Get started with coolplugz</Link>
          </Button>
        </section>
      </div>

      {uniqueRelatedLinks.length > 0 ? (
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm font-semibold text-charcoal">Related reading</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {uniqueRelatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-sm text-charcoal-muted transition-colors hover:text-charcoal"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/guides" className="text-charcoal-muted hover:text-charcoal">
          All guides
        </Link>
        <Link href="/" className="text-charcoal-muted hover:text-charcoal">
          Back to home
        </Link>
      </div>
    </article>
  );
}

/** Inline link text for FAQ answers pointing to full guides. */
export function GuideReadMoreLink({ slug, label = "Read the full guide" }: { slug: string; label?: string }) {
  return (
    <Link href={`/guides/${slug}`} className="font-medium text-[#0D9488] underline underline-offset-2">
      {label} →
    </Link>
  );
}
