import type { ReactNode } from "react";
import Link from "next/link";
import { LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";

type LegalDocumentProps = {
  title: string;
  children: ReactNode;
};

/** Shared layout for Privacy Policy and Terms of Service pages. */
export function LegalDocument({ title, children }: LegalDocumentProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-24 md:px-8 md:py-32">
      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-muted">
        {LEGAL_ENTITY}
      </p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal md:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-charcoal-muted">Last updated: {LEGAL_LAST_UPDATED}</p>

      <div className="legal-prose mt-10 space-y-8 text-[15px] leading-relaxed text-charcoal md:text-base">
        {children}
      </div>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8 text-sm">
        <Link href="/privacy" className="text-charcoal-muted hover:text-charcoal">
          Privacy Policy
        </Link>
        <Link href="/terms" className="text-charcoal-muted hover:text-charcoal">
          Terms of Service
        </Link>
        <Link href="/" className="text-charcoal-muted hover:text-charcoal">
          Back to home
        </Link>
      </div>
    </article>
  );
}

/** Section heading for legal documents. */
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl text-charcoal md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-charcoal-muted [&_strong]:font-medium [&_strong]:text-charcoal [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
