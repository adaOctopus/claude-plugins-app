"use client";

import Link from "next/link";
import { MarketplaceNotifyTrigger } from "@/components/waitlist/MarketplaceNotifyDialog";
import { footerGuideLinks } from "@/lib/guides/registry";
import { resolveProductHref } from "@/lib/site-mode";

type FooterLinkItem = {
  label: string;
  href?: string;
  notify?: boolean;
  source?: string;
};

const productLinks: FooterLinkItem[] = [
  // { label: "The Plugins", notify: true, source: "footer-plugins" },
  { href: resolveProductHref("/pricing"), label: "Pricing" },
  { href: resolveProductHref("/install"), label: "Getting started" },
];

const companyLinks: FooterLinkItem[] = [
  { href: "/#faq", label: "FAQ" },
  { href: "/login", label: "Log in" },
  { href: "mailto:hello@coolplugz.dev", label: "Contact" },
];

const linkClass =
  "text-sm text-charcoal-muted transition-colors hover:text-charcoal text-left";

function FooterLinkList({ links }: { links: FooterLinkItem[] }) {
  return (
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
  );
}

/** Footer link columns — Product, Guides, Company. */
export function FooterNav() {
  return (
    <>
      <div>
        <h3 className="mb-4 text-sm font-semibold text-charcoal">Product</h3>
        <FooterLinkList links={productLinks} />
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-charcoal">Resources</h3>
        <ul className="space-y-2">
          {footerGuideLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-charcoal">Company</h3>
        <FooterLinkList links={companyLinks} />
      </div>
    </>
  );
}
