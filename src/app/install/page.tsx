import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Install Guide — Claude Plugin Setup",
  description:
    "Step-by-step guide to install the plugsville Context Engineer Claude plugin. Connect Jira, Slack, and GitHub in minutes.",
};

const steps = [
  {
    title: "Download the plugin bundle",
    description:
      "After subscribing, download the Context Engineer plugin .zip from your dashboard.",
  },
  {
    title: "Open Claude Desktop settings",
    description:
      "Go to Settings → Developer → Edit Config. This opens your claude_desktop_config.json file.",
  },
  {
    title: "Add the plugin to your config",
    description:
      'Add the plugin path to the "plugins" array in your config. Point to the extracted plugin folder.',
  },
  {
    title: "Configure MCP integrations",
    description:
      "Set environment variables for Jira, Slack, and GitHub tokens in the plugin's .env file.",
  },
  {
    title: "Restart Claude Desktop",
    description:
      "Restart Claude to load the plugin. You'll see the Context Engineer dashboard in your sidebar.",
  },
  {
    title: "Run your first command",
    description:
      'Try "/context-gather" on an open Jira ticket to see full context assembled automatically.',
  },
];

/** Install guide — post-purchase Claude plugin setup instructions. */
export default function InstallPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 md:px-8">
      <div className="mb-8 rounded-2xl bg-accent-sage p-6">
        <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-600" />
        <h1 className="font-serif text-3xl font-semibold text-charcoal md:text-4xl">
          Install your Claude plugin
        </h1>
        <p className="mt-2 text-charcoal-muted">
          Follow these steps to get Context Engineer running in Claude Desktop.
          Total setup time: about 5 minutes.
        </p>
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
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
