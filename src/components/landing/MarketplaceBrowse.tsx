"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  MessageSquare,
  Search,
  Sparkles,
  Ticket,
} from "lucide-react";
import { NotionMark } from "@/components/icons/NotionMark";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MARKETPLACE_FILTERS,
  formatPluginPrice,
  type MarketplaceFilterId,
  type MarketplacePlugin,
} from "@/lib/marketplace-plugins";
import { cn } from "@/lib/utils";

const DISPLAY_LIMIT = 6;

const SLUG_ICONS: Record<string, typeof Sparkles> = {
  "context-engineer": Sparkles,
  "slack-fetch": MessageSquare,
  "notion-fetch": GitBranch,
  "jira-fetch": Ticket,
};

/** Search + filter grid for published marketplace plugins. */
export function MarketplaceBrowse({ plugins }: { plugins: MarketplacePlugin[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MarketplaceFilterId>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return plugins
      .filter((plugin) => {
        if (filter === "free") {
          return plugin.priceMonthly === 0 && !plugin.isFlagship;
        }
        if (filter !== "all" && plugin.category !== filter) return false;
        if (!q) return true;
        return (
          plugin.title.toLowerCase().includes(q) ||
          plugin.description.toLowerCase().includes(q) ||
          plugin.category.toLowerCase().includes(q)
        );
      })
      .slice(0, DISPLAY_LIMIT);
  }, [plugins, query, filter]);

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
          <Input
            type="search"
            placeholder="Search plugins…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 rounded-full border-border bg-white pl-9 pr-4 shadow-sm"
            aria-label="Search plugins"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MARKETPLACE_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                filter === id
                  ? "bg-charcoal text-cream"
                  : "border border-border bg-white text-charcoal-muted hover:border-charcoal/20 hover:text-charcoal"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-cream-warm/60 px-6 py-12 text-center">
          <p className="text-sm text-charcoal-muted">No plugins match your search.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plugin) => (
            <PluginCard key={plugin.slug} plugin={plugin} />
          ))}
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-3  pt-5 sm:flex-row sm:items-center">
        <p className="text-xs text-charcoal-muted">
          Showing {filtered.length} of {plugins.length} published — no login to browse
        </p>
        <Link
          href="/plugins"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0D9488] hover:underline"
        >
          View all plugins
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function PluginCard({ plugin }: { plugin: MarketplacePlugin }) {
  const Icon = SLUG_ICONS[plugin.slug] ?? Sparkles;
  const isNotion = plugin.slug === "notion-fetch";

  return (
    <Link
      href={`/plugins/${plugin.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-white p-4 shadow-sm transition-all hover:border-[#7DD3C0]/50 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            plugin.isFlagship
              ? "bg-[#E8FAF6] text-[#0D9488]"
              : "bg-cream-warm text-charcoal"
          )}
        >
          {isNotion ? (
            <NotionMark className="h-4 w-4 text-charcoal" />
          ) : (
            <Icon className="h-4 w-4" strokeWidth={2} />
          )}
        </span>
        <Badge
          variant={plugin.isFlagship ? "default" : "secondary"}
          className={cn(
            "shrink-0 text-[10px]",
            plugin.isFlagship && "bg-[#0D9488] hover:bg-[#0D9488]"
          )}
        >
          {formatPluginPrice(plugin)}
        </Badge>
      </div>

      <h3 className="font-serif text-lg leading-tight text-charcoal group-hover:text-[#0D9488]">
        {plugin.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-charcoal-muted">
        {plugin.description}
      </p>

      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0D9488] opacity-0 transition-opacity group-hover:opacity-100">
        View plugin
        <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}
