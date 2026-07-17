"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MagicLinkSentMessage } from "@/components/auth/MagicLinkSentMessage";
import { BrandWordmark } from "@/components/brand/CoolplugzMark";

function safeRedirect(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/app";
  return path;
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const redirect = safeRedirect(searchParams.get("redirect"));
  const [email, setEmail] = useState("");
  const [devLink, setDevLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setDevLink(null);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirect }),
      });
      const data = (await res.json()) as { devLink?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      setDevLink(data.devLink ?? null);
      setStatus("sent");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not send link. Please try again."
      );
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          Welcome to{" "}
          <BrandWordmark className="text-[1.3em] align-baseline" />👋
        </CardTitle>
        <p className="text-sm text-charcoal-muted">
          Login with the magic link✨
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error === "invalid_token"
              ? "This link has expired or was already used."
              : "Something went wrong. Please try again."}
          </p>
        )}
        {status === "sent" ? (
          <MagicLinkSentMessage devLink={devLink ?? undefined} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            {status === "error" && errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Continue"}
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-charcoal-muted">
          <Link href="/" className="hover:text-charcoal">
            ← Back to home
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
