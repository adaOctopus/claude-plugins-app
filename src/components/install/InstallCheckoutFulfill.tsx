"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** After Stripe Checkout, fulfill session and redirect to MCP setup. */
export function InstallCheckoutFulfill() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const mountedRef = useRef(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function fulfill() {
      try {
        const res = await fetch("/api/install/fulfill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = (await res.json()) as {
          redirect?: string;
          error?: string;
          email?: string;
        };
        if (cancelled || !mountedRef.current) return;

        if (res.ok && data.redirect) {
          try {
            await fetch("/api/provision-coolplugz", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({}),
            });
          } catch {
            // Setup page can retry provisioning if this fails.
          }
          router.replace(data.redirect);
          return;
        }

        setMessage(
          data.error || "Could not confirm checkout. Try opening your setup page again."
        );
      } catch {
        if (!cancelled && mountedRef.current) {
          setMessage("Could not confirm checkout. Try opening your setup page again.");
        }
      }
    }

    void fulfill();
    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  if (!sessionId) return null;

  return (
    <div className="mb-8 rounded-2xl border border-border bg-white p-6 text-center text-sm text-charcoal-muted">
      {message ?? "Confirming your subscription…"}
    </div>
  );
}
