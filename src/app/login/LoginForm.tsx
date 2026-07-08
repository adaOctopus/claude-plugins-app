"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in to coolplugz</CardTitle>
        <p className="text-sm text-charcoal-muted">
          We&apos;ll email you a magic link — no password needed.
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
          <div className="rounded-xl bg-accent-sage p-4 text-sm text-charcoal">
            Check your email for the sign-in link. In dev mode, check the server
            console.
          </div>
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
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send magic link"}
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
