import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { allGuides } from "@/lib/guides/registry";
import { CANONICAL_SITE_URL, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Guides for Remote Developers",
  description:
    "Guides for remote developers — make money with Claude, automations, AI fatigue, context switching, and client-work freedom.",
  path: "/guides",
  siteUrl: CANONICAL_SITE_URL,
});

/** Guides index — SEO hub listing all evergreen reference pages. */
export default function GuidesIndexPage() {
  const pillars = allGuides.filter((g) => g.category === "pillar");
  const freedom = allGuides.filter((g) => g.category === "freedom");
  const guides = allGuides.filter((g) => g.category === "guide");
  const other = allGuides.filter((g) => g.category === "persona");

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 md:px-8 md:py-32">
      <Badge variant="secondary" className="mb-4">
        Guides
      </Badge>
      <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
        Guides for remote developers
      </h1>
      <p className="mt-4 max-w-2xl text-charcoal-muted">
        Make money with Claude, automate client work, AI fatigue, context switching — written
        honestly for developers who want monthly cash without living in Slack.
      </p>

      <GuideGroup title="Money, freedom & Claude automation" items={freedom} />
      <GuideGroup title="Start here — pillar guides" items={pillars} />
      <GuideGroup title="Topic guides" items={guides} />
      <GuideGroup title="Personas & categories" items={other} />

      <div className="mt-12 border-t border-border pt-8">
        <p className="text-sm font-semibold text-charcoal">Comparisons</p>
        <ul className="mt-3 space-y-2">
          <li>
            <Link href="/compare/coolplugz-vs-cursor" className="text-charcoal-muted hover:text-charcoal">
              coolplugz vs Cursor
            </Link>
          </li>
          <li>
            <Link
              href="/compare/coolplugz-vs-github-copilot"
              className="text-charcoal-muted hover:text-charcoal"
            >
              coolplugz vs GitHub Copilot
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

function GuideGroup({
  title,
  items,
}: {
  title: string;
  items: typeof allGuides;
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-charcoal">{title}</h2>
      <ul className="mt-4 space-y-4">
        {items.map((guide) => (
          <li key={guide.slug} className="rounded-xl border border-border bg-white p-4">
            <Link href={`/guides/${guide.slug}`} className="group block">
              <p className="font-medium text-charcoal group-hover:text-[#0D9488]">{guide.title}</p>
              <p className="mt-1 text-sm text-charcoal-muted">{guide.metaDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
