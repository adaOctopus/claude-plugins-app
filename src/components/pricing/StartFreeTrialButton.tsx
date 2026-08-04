"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { freeTrialLoginRedirect, UNIQUE_MCP_URL_PATH } from "@/lib/mcp-setup-paths";
import { cn } from "@/lib/utils";

type StartFreeTrialButtonProps = {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
};

/** Starts the 7-day free trial — provisions MCP URL and redirects to setup. */
export function StartFreeTrialButton({
  className,
  variant = "outline",
  size = "default",
  children,
}: StartFreeTrialButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/provision-coolplugz/free-trial", { method: "POST" });
      const data = (await res.json()) as { mcpUrl?: string; error?: string };

      if (res.status === 401) {
        window.location.href = freeTrialLoginRedirect();
        return;
      }

      if (!res.ok || !data.mcpUrl) {
        throw new Error(data.error || "Could not start free trial");
      }

      window.location.href = UNIQUE_MCP_URL_PATH;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Could not start free trial");
    }
  }

  return (
    <div className="w-full">
      <Button
        type="button"
        className={cn("w-full", className)}
        variant={variant}
        size={size}
        disabled={loading}
        onClick={() => void handleClick()}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Starting trial…
          </>
        ) : (
          children
        )}
      </Button>
      {error ? <p className="mt-2 text-center text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
