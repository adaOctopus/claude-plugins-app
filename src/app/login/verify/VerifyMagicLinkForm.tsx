"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const verifyAttempts = new Set<string>();

function safeRedirect(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/app";
  return path;
}

/** Confirms magic link via POST — email prefetchers only GET this page and cannot burn the token. */
export function VerifyMagicLinkForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const redirect = safeRedirect(searchParams.get("redirect"));

    if (!token) {
      setStatus("error");
      setErrorMessage("This sign-in link is missing a token. Request a new magic link.");
      return;
    }

    if (verifyAttempts.has(token)) return;
    verifyAttempts.add(token);

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            token,
            email: email ?? undefined,
            redirect,
          }),
        });
        const data = (await res.json()) as { redirect?: string; error?: string };

        if (!res.ok) {
          setStatus("error");
          setErrorMessage(
            data.error === "invalid_token"
              ? "This link has expired or was already used. Request a fresh magic link below."
              : "We could not sign you in. Please request a new magic link."
          );
          return;
        }

        router.replace(data.redirect ?? redirect);
      } catch {
        setStatus("error");
        setErrorMessage("We could not sign you in. Please request a new magic link.");
      }
    }

    void verify();
  }, [router, searchParams]);

  if (status === "verifying") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Signing you in…</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-charcoal-muted">One moment while we verify your magic link.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Link not valid</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-charcoal-muted">{errorMessage}</p>
        <Button asChild className="w-full">
          <Link href="/login">Request a new magic link</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
