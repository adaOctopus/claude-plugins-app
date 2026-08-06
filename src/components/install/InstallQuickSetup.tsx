"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { CopyMcpUrlButton } from "@/components/install/CopyMcpUrlButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildDesktopMcpConfig,
  COOLPLUGZ_GETTING_STARTED,
} from "@/lib/install-guides";
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

/** Compact copy-paste blocks — Claude.ai URL first, Claude Desktop JSON right below. */
export function InstallQuickSetup({
  mcpUrl = null,
  expiresAt = null,
  status,
  error = null,
  provisionMode = "subscription",
  onRetry,
}: InstallQuickSetupProps) {
  const guide = COOLPLUGZ_GETTING_STARTED;
  const [copiedJson, setCopiedJson] = useState(false);

  const configSnippet = mcpUrl
    ? buildDesktopMcpConfig(mcpUrl)
    : `{
  "mcpServers": {
    "coolplugz": {
      "url": "YOUR_COOLPLUGZ_URL",
      "transport": "http"
    }
  }
}`;

  async function copyConfig() {
    if (!mcpUrl) return;
    try {
      await navigator.clipboard.writeText(configSnippet);
      setCopiedJson(true);
      window.setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      window.prompt("Copy this config:", configSnippet);
    }
  }

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
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden>
              {guide.quickDesktop.emoji}
            </span>
            <CardTitle className="text-lg">{guide.quickDesktop.title}</CardTitle>
          </div>
          <p className="text-sm text-charcoal-muted">{guide.quickDesktop.hint}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border/80 bg-accent-sand/30 px-4 py-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal">
              {guide.quickDesktopConfigFile.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
              {guide.quickDesktopConfigFile.missingFile}
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="shrink-0 font-medium text-charcoal">🍎 Mac</dt>
                <dd>
                  <code className="break-all rounded-md bg-white/80 px-2 py-1 text-xs text-charcoal">
                    {guide.desktop.macPath}
                  </code>
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="shrink-0 font-medium text-charcoal">🪟 Windows</dt>
                <dd>
                  <code className="break-all rounded-md bg-white/80 px-2 py-1 text-xs text-charcoal">
                    {guide.desktop.windowsPath}
                  </code>
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal-muted">
              claude_desktop_config.json
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => void copyConfig()}
              disabled={!mcpUrl}
            >
              {copiedJson ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedJson ? "Copied" : "Copy JSON"}
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border bg-[#1e1e1e] p-4 text-xs leading-relaxed text-[#d4d4d4]">
            <code>{configSnippet}</code>
          </pre>
          {!mcpUrl && (
            <p className="mt-2 text-xs text-charcoal-muted">
              Your URL will appear above — then copy this JSON in one click.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
