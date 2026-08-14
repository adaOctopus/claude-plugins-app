"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildClaudeCodeCliMcpCommand } from "@/lib/install-guides";

type ClaudeCodeCliTerminalProps = {
  mcpUrl?: string | null;
};

/** Dark terminal snippet — `claude mcp add` with the user's unique CoolPlugz URL. */
export function ClaudeCodeCliTerminal({ mcpUrl = null }: ClaudeCodeCliTerminalProps) {
  const [copied, setCopied] = useState(false);

  const command = mcpUrl
    ? buildClaudeCodeCliMcpCommand(mcpUrl)
    : "claude mcp add coolplugz --transport http YOUR_COOLPLUGZ_URL";

  async function handleCopy() {
    if (!mcpUrl) return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this command:", command);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-charcoal/20 bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="flex gap-1" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </span>
          <span className="font-mono text-[10px] text-[#a3a3a3] sm:text-[11px]">terminal</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 border-white/15 bg-white/5 px-2 text-[10px] text-[#d4d4d4] hover:bg-white/10 hover:text-white sm:text-xs"
          onClick={() => void handleCopy()}
          disabled={!mcpUrl}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-xs leading-relaxed text-[#d4d4d4] sm:px-4 sm:text-[13px]">
        <code>
          <span className="text-[#9ca3af]">$ </span>
          {command}
        </code>
      </pre>
    </div>
  );
}
