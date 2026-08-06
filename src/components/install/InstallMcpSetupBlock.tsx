"use client";

import { useCallback, useEffect, useState } from "react";
import { InstallQuickSetup } from "@/components/install/InstallQuickSetup";
import { InstallSetupMethods } from "@/components/install/InstallSetupMethods";
import { InstallUsageCommands } from "@/components/install/InstallUsageCommands";
import { COOLPLUGZ_GETTING_STARTED } from "@/lib/install-guides";
import { GENERIC_TRY_AGAIN_MESSAGE } from "@/lib/user-facing-errors";

type InstallMcpSetupBlockProps = {
  initialMcpUrl?: string | null;
  initialExpiresAt?: string | null;
  autoProvision?: boolean;
  provisionMode?: "subscription" | "free-trial";
};

/** Quick Claude.ai + Desktop setup up top; detailed screenshot guide below. */
export function InstallMcpSetupBlock({
  initialMcpUrl = null,
  initialExpiresAt = null,
  autoProvision = true,
  provisionMode = "subscription",
}: InstallMcpSetupBlockProps) {
  const guide = COOLPLUGZ_GETTING_STARTED;
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
      <InstallQuickSetup
        mcpUrl={mcpUrl}
        expiresAt={expiresAt}
        status={status}
        error={error}
        provisionMode={provisionMode}
        onRetry={() => void provision()}
      />

      <div className="mt-4">
        <InstallUsageCommands />
      </div>

      <div className="mt-12 border-t border-border pt-10">
        <h2 className="font-serif text-xl text-charcoal md:text-2xl">{guide.detailedGuideTitle}</h2>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-charcoal-muted">
          {guide.detailedGuideSubline}
        </p>
        <div className="mt-6">
          <InstallSetupMethods mcpUrl={mcpUrl} />
        </div>
      </div>
    </>
  );
}
