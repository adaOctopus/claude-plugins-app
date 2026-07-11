"use client";

import Link from "next/link";
import { MarketplaceNotifyTrigger } from "@/components/waitlist/MarketplaceNotifyDialog";
import { resolveProductHref } from "@/lib/site-mode";

type FooterLinkItem = {
  label: string;
  href?: string;
  notify?: boolean;
  source?: string;
};

const footerLinks: Record<string, FooterLinkItem[]> = {
  Product: [
    { label: "The Plugins", notify: true, source: "footer-plugins" },
    { href: resolveProductHref("/pricing"), label: "Pricing" },
    { href: resolveProductHref("/install"), label: "Install Guide" },
  ],
  Creators: [
    { label: "Upload Plugin", notify: true, source: "footer-upload" },
    { label: "Create Plugin", notify: true, source: "footer-create" },
  ],
  Company: [
    { href: "/#faq", label: "FAQ" },
    { href: "/login", label: "Log in" },
    { href: "mailto:hello@coolplugz.dev", label: "Contact" },
  ],
};

const linkClass =
  "text-sm text-charcoal-muted transition-colors hover:text-charcoal text-left";

/** Footer link columns — marketplace items open notify popup (v2). */
export function FooterNav() {
  return (
    <>
      {Object.entries(footerLinks).map(([title, links]) => (
        <div key={title}>
          <h3 className="mb-4 text-sm font-semibold text-charcoal">{title}</h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.label}>
                {link.notify ? (
                  <MarketplaceNotifyTrigger
                    source={link.source ?? "footer-marketplace"}
                    className={linkClass}
                  >
                    {link.label}
                  </MarketplaceNotifyTrigger>
                ) : (
                  <Link href={link.href!} className={linkClass}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
