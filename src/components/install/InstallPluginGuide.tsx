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
};

/** CoolPlugz MCP URL setup — web Connectors or Desktop JSON, then connect tools. */
export function InstallPluginGuide({ plugin, email, mcpUrl = null }: InstallPluginGuideProps) {
  const guide = COOLPLUGZ_GETTING_STARTED;
  const needsProvision = requiresProSubscription(plugin);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 rounded-2xl bg-accent-sage p-6">
        <h1 className="text-3xl md:text-4xl">
          <BrandWordmark className="text-[2rem] md:text-[2.25rem]" />
          <span className="ml-2 align-middle" aria-hidden>
            
          </span>
        </h1>
        <p className="mt-2 text-charcoal-muted">
          Access verified for {email} ✅
          <br />
          Add your unique MCP URL to Claude — one step, either web or desktop.
        </p>
      </div>

      <InstallMcpSetupBlock initialMcpUrl={mcpUrl} autoProvision={needsProvision} />

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

      <Button variant="outline" asChild>
        <Link href="/">← Back to home</Link>
      </Button>
    </div>
  );
}
