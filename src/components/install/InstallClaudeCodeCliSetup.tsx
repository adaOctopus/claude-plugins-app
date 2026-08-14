"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClaudeCodeCliTerminal } from "@/components/install/ClaudeCodeCliTerminal";
import { COOLPLUGZ_GETTING_STARTED } from "@/lib/install-guides";
import { GENERIC_TRY_AGAIN_MESSAGE } from "@/lib/user-facing-errors";

type InstallClaudeCodeCliSetupProps = {
  mcpUrl?: string | null;
  status: "idle" | "loading" | "error";
  error?: string | null;
  provisionMode?: "subscription" | "free-trial";
  onRetry?: () => void;
};

/** Claude Code CLI — one terminal command with the user's unique MCP key. */
export function InstallClaudeCodeCliSetup({
  mcpUrl = null,
  status,
  error = null,
  provisionMode = "subscription",
  onRetry,
}: InstallClaudeCodeCliSetupProps) {
  const guide = COOLPLUGZ_GETTING_STARTED;

  const waitingMessage =
    error ||
    (provisionMode === "free-trial"
      ? GENERIC_TRY_AGAIN_MESSAGE
      : "Your unique MCP URL is not ready yet. This usually takes a few seconds after payment.");

  return (
    <Card className="border-2 border-[#7DD3C0]/45 bg-gradient-to-br from-[#E8FAF6]/70 to-white shadow-[0_8px_24px_rgba(13,148,136,0.08)]">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg" aria-hidden>
            {guide.quickClaudeCodeCli.emoji}
          </span>
          <CardTitle className="text-lg">{guide.quickClaudeCodeCli.title}</CardTitle>
          <span className="rounded-full bg-charcoal px-2.5 py-0.5 text-xs font-medium text-cream">
            {guide.quickClaudeCodeCli.badge}
          </span>
        </div>
        <p className="text-sm text-charcoal-muted">{guide.quickClaudeCodeCli.hint}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {status === "loading" && (
          <p className="text-sm text-charcoal-muted">Generating your unique CoolPlugz MCP URL…</p>
        )}
        {status !== "loading" && (
          <>
            <ClaudeCodeCliTerminal mcpUrl={mcpUrl} />
            {!mcpUrl && (
              <div className="space-y-2">
                <p className="text-sm text-charcoal-muted">{waitingMessage}</p>
                {onRetry ? (
                  <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                    Generate my URL
                  </Button>
                ) : null}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
