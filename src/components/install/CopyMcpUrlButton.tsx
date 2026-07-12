"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Copy-to-clipboard for the CoolPlugz MCP server URL. */
export function CopyMcpUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your CoolPlugz MCP URL:", url);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <code className="flex-1 break-all rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal">
        {url}
      </code>
      <Button type="button" variant="outline" className="shrink-0 gap-2" onClick={handleCopy}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy URL"}
      </Button>
    </div>
  );
}
