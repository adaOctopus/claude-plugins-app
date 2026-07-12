import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyMcpUrlButton } from "@/components/install/CopyMcpUrlButton";
import {
  COOLPLUGZ_GETTING_STARTED,
  getCoolplugzMcpUrl,
} from "@/lib/install-guides";
import type { MarketplacePlugin } from "@/lib/marketplace-plugins";
import { requiresProSubscription } from "@/lib/marketplace-plugins";
import { LoginLink } from "@/components/auth/LoginLink";

type InstallPluginGuideProps = {
  plugin: MarketplacePlugin;
  email: string;
};

/** CoolPlugz MCP URL setup — paste in Claude, connect tools, start using commands. */
export function InstallPluginGuide({ plugin, email }: InstallPluginGuideProps) {
  const mcpUrl = getCoolplugzMcpUrl();
  const guide = COOLPLUGZ_GETTING_STARTED;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 rounded-2xl bg-accent-sage p-6">
        <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-600" />
        <h1 className="font-serif text-3xl font-semibold text-charcoal md:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-2 text-charcoal-muted">
          Access verified for {email}. Add your CoolPlugz MCP URL to Claude — that&apos;s all you
          need to get started.
        </p>
        {requiresProSubscription(plugin) && (
          <p className="mt-2 text-sm">
            <LoginLink className="text-charcoal underline" redirect="/app" />
          </p>
        )}
      </div>

      <Card className="mb-6 border-charcoal/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your CoolPlugz MCP URL</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-charcoal-muted">
            Paste this URL in Claude under Settings → MCP Servers → Add.
          </p>
          <CopyMcpUrlButton url={mcpUrl} />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{guide.setupTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-charcoal-muted">
            {guide.setupSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

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

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button variant="outline" asChild>
          <Link href="/install">All setup pages</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
