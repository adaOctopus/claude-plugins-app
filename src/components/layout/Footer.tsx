import Link from "next/link";
import { CoolplugzLogo } from "@/components/brand/CoolplugzMark";
import { FooterNav } from "@/components/layout/FooterNav";

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream-warm px-4 py-16 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="inline-block text-charcoal">
            <CoolplugzLogo markSize={44} wordmarkClassName="text-[22px]" />
          </Link>
          <p className="mt-3 text-sm text-charcoal-muted">
            Ship merge-ready code faster and stop switching between tools.
          </p>
        </div>

        <FooterNav />
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-charcoal-muted md:flex-row">
        <p suppressHydrationWarning>
          &copy; {new Date().getFullYear()} CoolPlugz Inc. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-charcoal">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-charcoal">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
