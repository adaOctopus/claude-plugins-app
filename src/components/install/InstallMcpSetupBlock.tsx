"use client";

import { useCallback, useEffect, useState } from "react";
import { CopyMcpUrlButton } from "@/components/install/CopyMcpUrlButton";
import { InstallSetupMethods } from "@/components/install/InstallSetupMethods";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InstallMcpSetupBlockProps = {
  initialMcpUrl?: string | null;
  autoProvision?: boolean;
};

/** Unique MCP URL + web/desktop setup paths in one block. */
export function InstallMcpSetupBlock({
  initialMcpUrl = null,
  autoProvision = true,
}: InstallMcpSetupBlockProps) {
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

  return (
    <>
      <Card className="mb-6 border-charcoal/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your CoolPlugz MCP URL 🔗</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-charcoal-muted">
            Copy this once — use it in claude.ai or Claude Desktop below.
          </p>
          {status === "loading" && (
            <p className="text-sm text-charcoal-muted">
              Generating your unique CoolPlugz MCP URL…
            </p>
          )}
          {status !== "loading" && mcpUrl && <CopyMcpUrlButton url={mcpUrl} />}
          {status !== "loading" && !mcpUrl && (
            <div className="space-y-3">
              <p className="text-sm text-charcoal-muted">
                {error ||
                  "Your unique MCP URL is not ready yet. This usually takes a few seconds after payment."}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={() => void provision()}>
                Generate my URL
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Easy setup 👍</CardTitle>
        </CardHeader>
        <CardContent>
          <InstallSetupMethods mcpUrl={mcpUrl} />
        </CardContent>
      </Card>
    </>
  );
}
