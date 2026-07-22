"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Building2, Loader2, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type EnterpriseContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Modal form for enterprise pricing — email + needs description → /api/sales/inquiry. */
export function EnterpriseContactDialog({ open, onOpenChange }: EnterpriseContactDialogProps) {
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setMessage("");
    }
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/sales/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          description,
          source: "enterprise-pricing",
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setMessage("Thank you 🙏 we'll reach out shortly.");
      setEmail("");
      setDescription("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enterprise-contact-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent-sage via-cream to-white shadow-[0_16px_48px_rgba(45,41,38,0.18)]">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-1.5 text-charcoal-muted transition-colors hover:bg-white/60 hover:text-charcoal"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 py-8 md:px-8 md:py-10">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white/80">
            <Building2 className="h-5 w-5 text-charcoal" aria-hidden />
          </div>
          <h2
            id="enterprise-contact-title"
            className="mt-4 text-center font-serif text-xl text-charcoal md:text-2xl"
          >
            Enterprise for engineering teams
          </h2>
          <p className="mt-2 text-center text-sm text-charcoal-muted">
            Tell us about your team size, stack, and what you want to optimize. We&apos;ll follow up
            with a tailored plan.
          </p>

          {status === "success" ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-5 py-6 text-center text-sm text-emerald-800">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-border/80 bg-white/90 px-5 py-6 shadow-sm">
              <div className="space-y-2">
                <Label htmlFor="enterprise-email">Work email</Label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted"
                    aria-hidden
                  />
                  <Input
                    id="enterprise-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={status === "loading"}
                    className="h-11 rounded-xl border-border bg-white pl-10 pr-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enterprise-description">What does your team need?</Label>
                <Textarea
                  id="enterprise-description"
                  name="description"
                  required
                  minLength={10}
                  maxLength={2000}
                  placeholder="e.g. 25 dev seats, GitHub Actions + Jira, pipeline optimization for monorepo…"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={status === "loading"}
                  className="min-h-[120px] rounded-xl"
                />
              </div>

              {status === "error" && message ? (
                <p className="text-sm text-red-600">{message}</p>
              ) : null}

              <Button type="submit" className="h-11 w-full rounded-xl" disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
