"use client";

import { CopyMcpUrlButton } from "@/components/install/CopyMcpUrlButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COOLPLUGZ_GETTING_STARTED } from "@/lib/install-guides";
import { GENERIC_TRY_AGAIN_MESSAGE } from "@/lib/user-facing-errors";

type InstallQuickSetupProps = {
  mcpUrl?: string | null;
  expiresAt?: string | null;
  status: "idle" | "loading" | "error";
  error?: string | null;
  provisionMode?: "subscription" | "free-trial";
  onRetry?: () => void;
};

function formatExpiresAt(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Compact copy-paste blocks — Claude.ai and Claude Desktop Connectors. */
export function InstallQuickSetup({
  mcpUrl = null,
  expiresAt = null,
  status,
  error = null,
  provisionMode = "subscription",
  onRetry,
}: InstallQuickSetupProps) {
  const guide = COOLPLUGZ_GETTING_STARTED;

  const waitingMessage =
    error ||
    (provisionMode === "free-trial"
      ? GENERIC_TRY_AGAIN_MESSAGE
      : "Your unique MCP URL is not ready yet. This usually takes a few seconds after payment.");

  return (
    <div className="space-y-4">
      <Card className="border-[#7DD3C0]/35 bg-gradient-to-br from-[#E8FAF6]/50 to-white">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg" aria-hidden>
              {guide.quickWeb.emoji}
            </span>
            <CardTitle className="text-lg">{guide.quickWeb.title}</CardTitle>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              {guide.quickWeb.badge}
            </span>
          </div>
          <p className="text-sm text-charcoal-muted">{guide.quickWeb.hint}</p>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <p className="text-sm text-charcoal-muted">Generating your unique CoolPlugz MCP URL…</p>
          )}
          {status !== "loading" && mcpUrl && (
            <div className="space-y-3">
              <CopyMcpUrlButton url={mcpUrl} />
              {expiresAt && (
                <p className="text-sm text-[#0D9488]">
                  Expires: <span className="font-semibold">{formatExpiresAt(expiresAt)}</span>
                </p>
              )}
            </div>
          )}
          {status !== "loading" && !mcpUrl && (
            <div className="space-y-3">
              <p className="text-sm text-charcoal-muted">{waitingMessage}</p>
              {onRetry ? (
                <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                  Generate my URL
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg" aria-hidden>
              {guide.quickDesktopConnectors.emoji}
            </span>
            <CardTitle className="text-lg">{guide.quickDesktopConnectors.title}</CardTitle>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              {guide.quickDesktopConnectors.badge}
            </span>
          </div>
          <p className="text-sm text-charcoal-muted">{guide.quickDesktopConnectors.hint}</p>
        </CardHeader>
        <CardContent>
          {mcpUrl ? (
            <p className="text-sm italic text-charcoal-muted">
              Use the same CoolPlugz URL from the Claude.ai section above.
            </p>
          ) : (
            <p className="text-sm text-charcoal-muted">
              Your URL will appear in the Claude.ai section above — paste it into Connectors on
              Desktop the same way.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
