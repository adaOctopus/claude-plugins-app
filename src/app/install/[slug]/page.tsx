import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getInstallAccessState } from "@/lib/install-access";
import { getUserMcpUrl } from "@/lib/provision-coolplugz";
import { UNIQUE_MCP_URL_PATH } from "@/lib/mcp-setup-paths";
import { getMarketplacePluginBySlug } from "@/lib/marketplace-plugins.server";
import { requiresProSubscription } from "@/lib/marketplace-plugins";
import { InstallEmailGate } from "@/components/install/InstallEmailGate";
import { InstallPaywall } from "@/components/install/InstallPaywall";
import { InstallPluginGuide } from "@/components/install/InstallPluginGuide";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const plugin = await getMarketplacePluginBySlug(slug);
  if (!plugin) {
    return { title: "Setup not found" };
  }
  return {
    title: `${plugin.title} — Getting Started`,
    description: `Add your CoolPlugz MCP URL to Claude and connect Jira, GitHub, Notion, and Slack.`,
  };
}

/** Per-plugin MCP setup — email or subscription gate, then CoolPlugz URL + quick start. */
export default async function InstallPluginPage({ params }: PageProps) {
  const { slug } = await params;
  const plugin = await getMarketplacePluginBySlug(slug);
  if (!plugin) notFound();

  if (requiresProSubscription(plugin)) {
    redirect(UNIQUE_MCP_URL_PATH);
  }

  const session = await getSession();
  const access = await getInstallAccessState(
    session?.id ?? null,
    session?.email ?? null,
    slug
  );

  if (access.status === "not_found") {
    notFound();
  }

  const mcpUrl =
    session?.id && access.status === "granted"
      ? await getUserMcpUrl(session.id)
      : null;

  return (
    <div className="px-4 py-32 md:px-8">
      {access.status === "gate" && (
        <InstallEmailGate plugin={access.plugin} kind={access.kind} slug={slug} />
      )}

      {access.status === "paywall" && (
        <InstallPaywall plugin={access.plugin} email={access.email} />
      )}

      {access.status === "granted" && (
        <InstallPluginGuide
          plugin={access.plugin}
          email={access.email}
          mcpUrl={mcpUrl}
        />
      )}
    </div>
  );
}
