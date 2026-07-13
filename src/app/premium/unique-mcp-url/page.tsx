import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/entitlements";
import { getUserMcpUrl } from "@/lib/provision-coolplugz";
import { UNIQUE_MCP_URL_PATH } from "@/lib/mcp-setup-paths";
import { getMarketplacePluginBySlug } from "@/lib/marketplace-plugins.server";
import { InstallCheckoutFulfillShell } from "@/components/install/InstallCheckoutFulfillShell";
import { InstallPaywall } from "@/components/install/InstallPaywall";
import { InstallPluginGuide } from "@/components/install/InstallPluginGuide";
import { CANONICAL_SITE_URL, createPageMetadata } from "@/lib/seo";

const FLAGSHIP_SLUG = "context-engineer";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Your CoolPlugz MCP URL",
  description:
    "Your unique CoolPlugz MCP URL — paste it into Claude under Settings → MCP Servers and connect your tools.",
  path: UNIQUE_MCP_URL_PATH,
  siteUrl: CANONICAL_SITE_URL,
});

/** Post-purchase page — unique MCP URL + minimal getting started guide. */
export default async function UniqueMcpUrlPage({ searchParams }: PageProps) {
  const { session_id: checkoutSessionId } = await searchParams;
  const plugin = await getMarketplacePluginBySlug(FLAGSHIP_SLUG);
  if (!plugin) notFound();

  if (checkoutSessionId) {
    return (
      <div className="px-4 py-32 md:px-8">
        <InstallCheckoutFulfillShell />
      </div>
    );
  }

  const session = await getSession();
  if (!session) {
    redirect(`/login?redirect=${encodeURIComponent(UNIQUE_MCP_URL_PATH)}`);
  }

  const subscribed = await hasActiveSubscription(session.id);
  if (!subscribed) {
    return (
      <div className="px-4 py-32 md:px-8">
        <InstallPaywall plugin={plugin} email={session.email} />
      </div>
    );
  }

  const mcpUrl = await getUserMcpUrl(session.id);

  return (
    <div className="px-4 py-32 md:px-8">
      <InstallPluginGuide plugin={plugin} email={session.email} mcpUrl={mcpUrl} />
    </div>
  );
}
