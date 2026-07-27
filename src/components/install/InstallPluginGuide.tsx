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
  accessMode?: "pro" | "daily";
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
  const isDailyPass = accessMode === "daily";
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
          {isDailyPass ? (
            <>
              <span className="font-medium text-charcoal">One Run</span> — your MCP URL is
              valid for 24 hours (1 task included).
            </>
          ) : (
            <>Add your unique MCP URL to Claude — one step, either web or desktop.</>
          )}
        </p>
        {isDailyPass && passEndLabel && (
          <p className="mt-2 rounded-lg border border-[#7DD3C0]/35 bg-white/80 px-3 py-2 text-sm text-[#0D9488]">
            Pass active until <span className="font-semibold">{passEndLabel}</span>. Upgrade to Pro
            for monthly included runs.
          </p>
        )}
      </div>

      <InstallMcpSetupBlock
        initialMcpUrl={mcpUrl}
        initialExpiresAt={passExpiresAt}
        autoProvision={needsProvision && !isDailyPass}
        provisionMode="subscription"
      />

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{guide.connectTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-charcoal-muted">{guide.connectIntro}</p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{guide.usageTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-charcoal-muted">{guide.usageIntro}</p>
          <ul className="space-y-3">
            {guide.commands.map((item) => (
              <li key={item.command} className="text-sm text-charcoal-muted">
                <span className="font-medium text-charcoal">&quot;{item.command}&quot;</span>
                {" — "}
                {item.description}
              </li>
            ))}
          </ul>
          <p className="text-sm text-charcoal-muted">{guide.usageFooter}</p>
        </CardContent>
      </Card>

      {isDailyPass && (
        <div className="mb-6 rounded-xl border border-border bg-cream-warm/60 p-4 text-sm text-charcoal-muted">
          When your One Run window ends, this MCP URL stops working.{" "}
          <Link href="/pricing" className="font-medium text-charcoal underline">
            Get Pro
          </Link>{" "}
          for 10 runs/month — far cheaper than buying One Run every day.
        </div>
      )}

      <Button variant="outline" asChild>
        <Link href="/">← Back to home</Link>
      </Button>
    </div>
  );
}
