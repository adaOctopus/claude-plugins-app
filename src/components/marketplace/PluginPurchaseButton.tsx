"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PluginPurchaseButton({ pluginId }: { pluginId: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "addon", pluginId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        window.location.href = "/login";
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch {
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="lg" onClick={handlePurchase} disabled={loading}>
      {loading ? "Redirecting..." : "Add plugin subscription"}
    </Button>
  );
}
