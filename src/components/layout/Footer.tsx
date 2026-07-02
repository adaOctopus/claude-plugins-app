import Link from "next/link";
import { PlugsvilleLogo } from "@/components/brand/PlugsvilleMark";

const footerLinks = {
  Product: [
    { href: "/plugins", label: "The Plugin" },
    { href: "/pricing", label: "Pricing" },
    { href: "/install", label: "Install Guide" },
  ],
  Creators: [
    { href: "/app/upload", label: "Upload Plugin" },
    { href: "/app/create", label: "Create Plugin" },
  ],
  Company: [
    { href: "/#faq", label: "FAQ" },
    { href: "mailto:hello@plugsville.dev", label: "Contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream-warm px-4 py-16 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="inline-block text-charcoal">
            <PlugsvilleLogo />
          </Link>
          <p className="mt-3 text-sm text-charcoal-muted">
            Runs the full pipeline in the background. You only Approve &amp; submit
            or Reject &amp; redo — human in the loop at the last step only.
          </p>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h3 className="mb-4 text-sm font-semibold text-charcoal">{title}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal-muted transition-colors hover:text-charcoal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-charcoal-muted md:flex-row">
        <p suppressHydrationWarning>
          &copy; {new Date().getFullYear()} plugsville. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-charcoal">
            Privacy
          </Link>
          <Link href="#" className="hover:text-charcoal">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
