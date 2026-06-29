"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Suspense } from "react";

function PricingContent() {
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") || "monthly";
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(plan: "monthly" | "annual") {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        window.location.href = `/login?redirect=/pricing?plan=${plan}`;
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch {
      alert("Checkout failed");
    } finally {
      setLoading(null);
    }
  }

  const plans = [
    {
      id: "monthly" as const,
      name: "Monthly",
      price: "€19",
      period: "/month",
      features: [
        "Context Engineer plugin",
        "Jira + Slack + GitHub",
        "In-Claude dashboard",
        "Install guide & updates",
      ],
    },
    {
      id: "annual" as const,
      name: "Annual",
      price: "€149",
      period: "/year",
      features: [
        "Everything in Monthly",
        "Save ~35%",
        "Priority support",
        "Early access to plugins",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-32 md:px-8">
      <h1 className="font-serif text-4xl font-semibold text-charcoal md:text-5xl">
        Choose your plan
      </h1>
      <p className="mt-4 text-charcoal-muted">
        Get the flagship Context Engineer plugin. Add marketplace plugins for
        €2.50/month each.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={defaultPlan === plan.id ? "border-charcoal shadow-lg" : ""}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="font-serif text-4xl">{plan.price}</span>
                <span className="text-charcoal-muted">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => checkout(plan.id)}
                disabled={loading === plan.id}
              >
                {loading === plan.id ? "Redirecting..." : `Subscribe ${plan.name.toLowerCase()}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-charcoal-muted">
        Need to sign in first?{" "}
        <Link href="/login" className="underline">
          Log in with magic link
        </Link>
      </p>
    </div>
  );
}

/** Pricing page — Stripe checkout entry for monthly/annual plans. */
export default function PricingPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
