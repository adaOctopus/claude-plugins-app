"use client";

import { useCallback, useEffect, useState } from "react";
import { CopyMcpUrlButton } from "@/components/install/CopyMcpUrlButton";
import { Button } from "@/components/ui/button";

type InstallMcpUrlPanelProps = {
  initialMcpUrl?: string | null;
  /** When true, auto-request provisioning if URL is missing (paid subscribers). */
  autoProvision?: boolean;
};

/** Shows the user's unique MCP URL — provisions on demand if missing. */
export function InstallMcpUrlPanel({
  initialMcpUrl = null,
  autoProvision = true,
}: InstallMcpUrlPanelProps) {
  const [mcpUrl, setMcpUrl] = useState(initialMcpUrl);
  const [status, setStatus] = useState<"idle" | "loading" | "error">(
    initialMcpUrl ? "idle" : autoProvision ? "loading" : "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const provision = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/provision-coolplugz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as { mcpUrl?: string; error?: string };
      if (!res.ok || !data.mcpUrl) {
        throw new Error(data.error || "Could not generate your MCP URL");
      }
      setMcpUrl(data.mcpUrl);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not generate your MCP URL");
    }
  }, []);

  useEffect(() => {
    if (initialMcpUrl) {
      setMcpUrl(initialMcpUrl);
      setStatus("idle");
      return;
    }
    if (autoProvision) {
      void provision();
    }
  }, [initialMcpUrl, autoProvision, provision]);

  if (status === "loading") {
    return (
      <p className="text-sm text-charcoal-muted">
        Generating your unique CoolPlugz MCP URL…
      </p>
    );
  }

  if (mcpUrl) {
    return <CopyMcpUrlButton url={mcpUrl} />;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-charcoal-muted">
        {error ||
          "Your unique MCP URL is not ready yet. This usually takes a few seconds after payment."}
      </p>
      <Button type="button" variant="outline" size="sm" onClick={() => void provision()}>
        Generate my URL
      </Button>
    </div>
  );
}
