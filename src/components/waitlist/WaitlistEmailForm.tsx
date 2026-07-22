"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type WaitlistEmailFormProps = {
  source?: string;
  className?: string;
  compact?: boolean;
};

/** Email capture form — posts to /api/waitlist (Google Sheets). */
export function WaitlistEmailForm({
  source = "coming-soon",
  className,
  compact = false,
}: WaitlistEmailFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setMessage("You're on the list 🥳 we'll email you in a couple of weeks.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800",
          className
        )}
      >
        <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col gap-2 sm:flex-row sm:items-center",
          compact ? "sm:gap-2" : "sm:gap-3"
        )}
      >
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted"
            aria-hidden
          />
          <Input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={status === "loading"}
            className={cn(
              "h-11 rounded-full border-border bg-white pl-10 pr-4 shadow-sm",
              compact && "h-10 text-sm"
            )}
            aria-label="Email address"
          />
        </div>
        <Button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "h-11 shrink-0 rounded-full px-6 shadow-sm",
            compact && "h-10 px-5 text-sm"
          )}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Joining…
            </>
          ) : (
            "Notify me"
          )}
        </Button>
      </div>
      {status === "error" && message ? (
        <p className="mt-2 text-center text-xs text-red-600 sm:text-left">{message}</p>
      ) : (
        <p className="mt-2 text-center text-[11px] text-charcoal-muted sm:text-left">
          No spam. One email when coolplugz goes live.
        </p>
      )}
    </form>
  );
}
