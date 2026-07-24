import { Suspense } from "react";
import { VerifyMagicLinkForm } from "./VerifyMagicLinkForm";

/** Magic link landing — verifies via POST so email scanners cannot consume the token on GET. */
export default function VerifyMagicLinkPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-24">
      <Suspense fallback={<VerifyMagicLinkFallback />}>
        <VerifyMagicLinkForm />
      </Suspense>
    </div>
  );
}

function VerifyMagicLinkFallback() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center">
      <p className="text-sm text-charcoal-muted">Signing you in…</p>
    </div>
  );
}
