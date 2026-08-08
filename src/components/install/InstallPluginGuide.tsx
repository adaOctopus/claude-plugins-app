import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandWordmark } from "@/components/brand/CoolplugzMark";
import { InstallMcpSetupBlock } from "@/components/install/InstallMcpSetupBlock";
import { COOLPLUGZ_GETTING_STARTED } from "@/lib/install-guides";
import type { MarketplacePlugin } from "@/lib/marketplace-plugins";
import { requiresProSubscription } from "@/lib/marketplace-plugins";

type InstallPluginGuideProps = {
  plugin: MarketplacePlugin;
  email: string;
  mcpUrl?: string | null;
  accessMode?: "pro" | "trial" | "daily";
  passExpiresAt?: string | null;
};

/** CoolPlugz MCP URL setup — web Connectors or Desktop JSON, then connect tools. */
export function InstallPluginGuide({
  plugin,
  email,
  mcpUrl = null,
  accessMode = "pro",
  passExpiresAt = null,
}: InstallPluginGuideProps) {
  const guide = COOLPLUGZ_GETTING_STARTED;
  const needsProvision = requiresProSubscription(plugin);
  const isTrial = accessMode === "trial";
  const isLegacyDaily = accessMode === "daily";
  const passEndLabel = passExpiresAt
    ? new Date(passExpiresAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 rounded-2xl bg-accent-sage p-6">
        <h1 className="text-3xl md:text-4xl">
          <BrandWordmark className="text-[2rem] md:text-[2.25rem]" />
        </h1>
        <p className="mt-2 text-charcoal-muted">
          Access verified for {email} ✅
          <br />
          {isTrial ? (
            <>
              <span className="font-medium text-charcoal">Free trial</span> — your MCP URL is valid
              for 7 days.
            </>
          ) : isLegacyDaily ? (
            <>
              <span className="font-medium text-charcoal">Legacy access</span> — your MCP URL is
              valid until expiry.
            </>
          ) : (
            <>Copy your URL for Claude.ai or Claude Desktop Connectors — quick setup below.</>
          )}
        </p>
        {(isTrial || isLegacyDaily) && passEndLabel && (
          <p className="mt-2 rounded-lg border border-[#7DD3C0]/35 bg-white/80 px-3 py-2 text-sm text-[#0D9488]">
            Access active until <span className="font-semibold">{passEndLabel}</span>. Upgrade to
            Pro for unlimited usage.
          </p>
        )}
      </div>

      <InstallMcpSetupBlock
        initialMcpUrl={mcpUrl}
        initialExpiresAt={passExpiresAt}
        autoProvision={needsProvision && accessMode === "pro"}
        provisionMode="subscription"
      />

      {/* <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{guide.connectTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-charcoal-muted">{guide.connectIntro}</p>
        </CardContent>
      </Card> */}

      {(isTrial || isLegacyDaily) && (
        <div className="mb-6 rounded-xl border border-border bg-cream-warm/60 p-4 text-sm text-charcoal-muted">
          When your access ends, this MCP URL stops working.{" "}
          <Link href="/pricing" className="font-medium text-charcoal underline">
            Get Pro
          </Link>{" "}
          for unlimited usage and multi-repo tasks.
        </div>
      )}
      
      <div className="h-4"></div>

      <Button variant="outline" asChild>
        <Link href="/">← Back to home</Link>
      </Button>
    </div>
  );
}
