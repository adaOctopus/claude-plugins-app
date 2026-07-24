"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildDesktopMcpConfig,
  CLAUDE_DESKTOP_EDIT_CONFIG_IMAGE,
  CLAUDE_WEB_CONNECTOR_IMAGE,
  COOLPLUGZ_GETTING_STARTED,
} from "@/lib/install-guides";

type InstallSetupMethodsProps = {
  mcpUrl?: string | null;
};

/** Web Connectors UI vs Desktop JSON — one URL, two one-step paths. */
export function InstallSetupMethods({ mcpUrl }: InstallSetupMethodsProps) {
  const guide = COOLPLUGZ_GETTING_STARTED;
  const [copied, setCopied] = useState(false);
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
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this config:", configSnippet);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-charcoal">{guide.setupHeadline}</h3>
        {guide.setupSubline ? (
          <p className="mt-1 text-sm text-charcoal-muted">{guide.setupSubline}</p>
        ) : null}
      </div>

      <div
        className="rounded-xl border border-[#7DD3C0]/40 bg-[#E8FAF6]/90 px-4 py-3 sm:px-5"
        role="note"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0D9488]">
          {guide.companyAccountNote.title}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
          {guide.companyAccountNote.body}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="border-b border-border bg-accent-sand/40 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base">{guide.web.emoji}</span>
            <h4 className="font-medium text-charcoal">{guide.web.title}</h4>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              {guide.web.badge}
            </span>
          </div>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-charcoal-muted">
            {guide.web.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="bg-charcoal/5 p-3 sm:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLAUDE_WEB_CONNECTOR_IMAGE}
            alt="Claude.ai Connectors — Add custom connector with name and Remote MCP server URL"
            className="w-full rounded-xl border border-border shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="border-b border-border bg-accent-sand/40 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-base">{guide.desktop.emoji}</span>
            <h4 className="font-medium text-charcoal">{guide.desktop.title}</h4>
          </div>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-charcoal-muted">
            {guide.desktop.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="mt-4 space-y-2 text-sm">
            <p className="font-medium text-charcoal">📁 File location</p>
            <p className="text-charcoal-muted">
              <span className="font-medium text-charcoal">🍎 Mac:</span>{" "}
              <code className="text-xs">{guide.desktop.macPath}</code>
            </p>
            <p className="text-charcoal-muted">
              <span className="font-medium text-charcoal">🪟 Windows:</span>{" "}
              <code className="text-xs">{guide.desktop.windowsPath}</code>
            </p>
          </div>
        </div>
        <div className="bg-charcoal/5 p-3 sm:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLAUDE_DESKTOP_EDIT_CONFIG_IMAGE}
            alt="Claude Desktop Settings — Developer → Edit Config to open claude_desktop_config.json"
            className="w-full rounded-xl border border-border shadow-sm"
          />
        </div>
        <div className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
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
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy JSON"}
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border bg-[#1e1e1e] p-4 text-xs leading-relaxed text-[#d4d4d4]">
            <code>{configSnippet}</code>
          </pre>
          {!mcpUrl && (
            <p className="mt-2 text-xs text-charcoal-muted">
              Your URL will appear above - then copy this JSON with one click.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
