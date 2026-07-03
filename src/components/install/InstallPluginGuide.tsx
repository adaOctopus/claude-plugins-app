"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInstallSteps } from "@/lib/install-guides";
import type { MarketplacePlugin } from "@/lib/marketplace-plugins";

type InstallPluginGuideProps = {
  plugin: MarketplacePlugin;
  email: string;
};

/** Step-by-step install guide with download for a verified plugin. */
export function InstallPluginGuide({ plugin, email }: InstallPluginGuideProps) {
  const steps = getInstallSteps(plugin.slug);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/install/download?slug=${encodeURIComponent(plugin.slug)}`);
      const data = (await res.json()) as { url?: string; name?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Download failed");
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 rounded-2xl bg-accent-sage p-6">
        <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-600" />
        <h1 className="font-serif text-3xl font-semibold text-charcoal md:text-4xl">
          {plugin.title} — install guide
        </h1>
        <p className="mt-2 text-charcoal-muted">
          Access verified for {email}. Follow the steps below to set up the plugin in Claude.
        </p>
        <Button
          className="mt-4 gap-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download className="h-4 w-4" />
          {downloading ? "Preparing..." : "Download plugin bundle"}
        </Button>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <Card key={step.title}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal text-sm text-cream">
                  {i + 1}
                </span>
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-charcoal-muted">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button variant="outline" asChild>
          <Link href="/install">All install guides</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
