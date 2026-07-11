import Link from "next/link";

type MagicLinkSentMessageProps = {
  devLink?: string;
  className?: string;
};

/** Shown after requesting a magic link — email in prod, clickable link in dev. */
export function MagicLinkSentMessage({ devLink, className }: MagicLinkSentMessageProps) {
  if (devLink) {
    return (
      <div className={className ?? "rounded-xl bg-accent-sage p-4 text-sm text-charcoal"}>
        <p className="font-medium">Dev mode — no email provider configured.</p>
        <p className="mt-2 text-charcoal-muted">
          Click the link below to continue (also logged in the server console):
        </p>
        <Link
          href={devLink}
          className="mt-3 block break-all font-medium text-charcoal underline underline-offset-2 hover:text-charcoal-muted"
        >
          {devLink}
        </Link>
      </div>
    );
  }

  return (
    <div className={className ?? "rounded-xl bg-accent-sage p-4 text-sm text-charcoal"}>
      Check your inbox for the link. It expires in 15 minutes.
    </div>
  );
}
