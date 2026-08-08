"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildDesktopMcpConfig, COOLPLUGZ_GETTING_STARTED } from "@/lib/install-guides";

type InstallLegacyDesktopSetupProps = {
  mcpUrl?: string | null;
};

/** Legacy Claude Desktop config-file setup — shown after the main quick-start flow. */
export function InstallLegacyDesktopSetup({ mcpUrl = null }: InstallLegacyDesktopSetupProps) {
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

  return (
    <Card className="mt-4 border-border border-dashed bg-accent-sand/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden>
            {guide.quickDesktopLegacy.emoji}
          </span>
          <CardTitle className="text-lg">{guide.quickDesktopLegacy.title}</CardTitle>
        </div>
        <p className="text-sm text-charcoal-muted">{guide.quickDesktopLegacy.hint}</p>
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
                  {guide.desktopLegacy.macPath}
                </code>
              </dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-medium text-charcoal">🪟 Windows</dt>
              <dd>
                <code className="break-all rounded-md bg-white/80 px-2 py-1 text-xs text-charcoal">
                  {guide.desktopLegacy.windowsPath}
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
          <p className="text-xs text-charcoal-muted">
            Your URL will appear above — then copy this JSON in one click.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
