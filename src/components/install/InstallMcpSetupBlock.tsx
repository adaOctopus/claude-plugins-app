"use client";

import { useCallback, useEffect, useState } from "react";
import { CopyMcpUrlButton } from "@/components/install/CopyMcpUrlButton";
import { InstallSetupMethods } from "@/components/install/InstallSetupMethods";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GENERIC_TRY_AGAIN_MESSAGE } from "@/lib/user-facing-errors";

type InstallMcpSetupBlockProps = {
  initialMcpUrl?: string | null;
  initialExpiresAt?: string | null;
  autoProvision?: boolean;
  provisionMode?: "subscription" | "free-trial";
};

function formatExpiresAt(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Unique MCP URL + web/desktop setup paths in one block. */
export function InstallMcpSetupBlock({
  initialMcpUrl = null,
  initialExpiresAt = null,
  autoProvision = true,
  provisionMode = "subscription",
}: InstallMcpSetupBlockProps) {
  const provisionEndpoint =
    provisionMode === "free-trial"
      ? "/api/provision-coolplugz/free-trial"
      : "/api/provision-coolplugz";

  const [mcpUrl, setMcpUrl] = useState(initialMcpUrl);
  const [expiresAt, setExpiresAt] = useState<string | null>(initialExpiresAt);
  const [status, setStatus] = useState<"idle" | "loading" | "error">(
    initialMcpUrl ? "idle" : autoProvision ? "loading" : "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const provision = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(provisionEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as {
        mcpUrl?: string;
        expiresAt?: string;
        error?: string;
      };
      if (!res.ok || !data.mcpUrl) {
        setStatus("error");
        setError(data.error || GENERIC_TRY_AGAIN_MESSAGE);
        return;
      }
      setMcpUrl(data.mcpUrl);
      if (data.expiresAt) setExpiresAt(data.expiresAt);
      setStatus("idle");
    } catch {
      setStatus("error");
      setError(GENERIC_TRY_AGAIN_MESSAGE);
    }
  }, [provisionEndpoint]);

  useEffect(() => {
    if (initialMcpUrl) {
      setMcpUrl(initialMcpUrl);
      setStatus("idle");
    }
    if (initialExpiresAt) {
      setExpiresAt(initialExpiresAt);
    }
    if (initialMcpUrl) return;
    if (autoProvision) {
      void provision();
    }
  }, [initialMcpUrl, initialExpiresAt, autoProvision, provision]);

  return (
    <>
      <Card className="mb-6 border-charcoal/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your MCP URL 🔗</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-charcoal-muted">
            Copy this once - use it in claude.ai or Claude Desktop below.
          </p>
          {status === "loading" && (
            <p className="text-sm text-charcoal-muted">
              Generating your unique CoolPlugz MCP URL…
            </p>
          )}
          {status !== "loading" && mcpUrl && (
            <div className="space-y-3">
              <CopyMcpUrlButton url={mcpUrl} />
              {provisionMode === "free-trial" && expiresAt && (
                <p className="text-sm text-[#0D9488]">
                  Expires: <span className="font-semibold">{formatExpiresAt(expiresAt)}</span>
                </p>
              )}
            </div>
          )}
          {status !== "loading" && !mcpUrl && (
            <div className="space-y-3">
              <p className="text-sm text-charcoal-muted">
                {error ||
                  (provisionMode === "free-trial"
                    ? GENERIC_TRY_AGAIN_MESSAGE
                    : "Your unique MCP URL is not ready yet. This usually takes a few seconds after payment.")}
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
