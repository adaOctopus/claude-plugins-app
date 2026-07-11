"use client";

import { ArrowRight } from "lucide-react";
import { MarketplaceNotifyTrigger } from "@/components/waitlist/MarketplaceNotifyDialog";

/** Publish-your-own CTA — opens marketplace notify popup (v2). */
export function PublishYourOwnLink() {
  return (
    <MarketplaceNotifyTrigger
      source="browse-publish"
      className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-charcoal-muted hover:text-charcoal"
    >
      Publish your own
      <ArrowRight className="h-3.5 w-3.5" />
    </MarketplaceNotifyTrigger>
  );
}
