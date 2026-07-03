"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketplacePlugin } from "@/lib/marketplace-plugins";

type InstallEmailGateProps = {
  plugin: MarketplacePlugin;
  kind: "free" | "pro";
  slug: string;
};

/** Email magic-link gate before showing an install guide. */
export function InstallEmailGate({ plugin, kind, slug }: InstallEmailGateProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          redirect: `/install/${slug}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const title =
    kind === "free"
      ? "Verify your email to continue"
      : "Verify your email to unlock the guide";

  const description =
    kind === "free"
      ? `Enter your email to access the ${plugin.title} install guide. We'll send a one-time link — no password needed.`
      : `Enter the email you used for your plugsville subscription. We'll verify your access and send a secure link to the ${plugin.title} install guide.`;

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-sm text-charcoal-muted">{description}</p>
      </CardHeader>
      <CardContent>
        {status === "sent" ? (
          <div className="rounded-xl bg-accent-sage p-4 text-sm text-charcoal">
            Check your inbox for the link. In dev mode, check the server console.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="install-email">Email</Label>
              <Input
                id="install-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            {status === "error" && (
              <p className="text-sm text-red-600">Could not send link. Please try again.</p>
            )}
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send magic link"}
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-charcoal-muted">
          <Link href="/install" className="hover:text-charcoal">
            ← All install guides
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
