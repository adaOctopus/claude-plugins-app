import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { canAccessMcp, getFreeTrialStatus } from "@/lib/free-trial";
import { hasActiveSubscription } from "@/lib/entitlements";
import {
  getUserMcpUrl,
  isUserOnFreeTrial,
  provisionFreeTrialForUser,
} from "@/lib/provision-coolplugz";
import {
  UNIQUE_MCP_URL_PATH,
  freeTrialLoginRedirect,
} from "@/lib/mcp-setup-paths";
import { getMarketplacePluginBySlug } from "@/lib/marketplace-plugins.server";
import { InstallCheckoutFulfillShell } from "@/components/install/InstallCheckoutFulfillShell";
import { InstallPaywall } from "@/components/install/InstallPaywall";
import { InstallPluginGuide } from "@/components/install/InstallPluginGuide";
import { CANONICAL_SITE_URL, createPageMetadata } from "@/lib/seo";
import { toUserFacingProvisionError } from "@/lib/user-facing-errors";

const FLAGSHIP_SLUG = "context-engineer";

type PageProps = {
  searchParams: Promise<{ session_id?: string; start?: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Your MCP URL",
  description:
    "Your unique CoolPlugz MCP URL — paste it into Claude under Settings → MCP Servers and connect your tools.",
  path: UNIQUE_MCP_URL_PATH,
  siteUrl: CANONICAL_SITE_URL,
});

/** Post-purchase or free-trial page — unique MCP URL + minimal getting started guide. */
export default async function UniqueMcpUrlPage({ searchParams }: PageProps) {
  const { session_id: checkoutSessionId, start } = await searchParams;
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
  const wantsFreeTrial = start === "trial";

  if (!session) {
    redirect(wantsFreeTrial ? freeTrialLoginRedirect() : `/login?redirect=${encodeURIComponent(UNIQUE_MCP_URL_PATH)}`);
  }

  if (wantsFreeTrial) {
    let provisionError: string | null = null;
    try {
      await provisionFreeTrialForUser(session.id);
    } catch (error) {
      provisionError = toUserFacingProvisionError(error, "free-trial-page");
    }

    if (!provisionError) {
      redirect(UNIQUE_MCP_URL_PATH);
    }

    const trialStatus = await getFreeTrialStatus(session.id);
    return (
      <div className="px-4 py-32 md:px-8">
        <InstallPaywall
          plugin={plugin}
          email={session.email}
          trialExpired={trialStatus.used && !trialStatus.active}
          errorMessage={provisionError}
        />
      </div>
    );
  }

  const hasAccess = await canAccessMcp(session.id);
  if (!hasAccess) {
    const trialStatus = await getFreeTrialStatus(session.id);
    return (
      <div className="px-4 py-32 md:px-8">
        <InstallPaywall
          plugin={plugin}
          email={session.email}
          trialExpired={trialStatus.used && !trialStatus.active}
        />
      </div>
    );
  }

  const mcpUrl = await getUserMcpUrl(session.id);
  const onFreeTrial = await isUserOnFreeTrial(session.id);
  const subscribed = await hasActiveSubscription(session.id);
  const trialStatus = onFreeTrial ? await getFreeTrialStatus(session.id) : null;

  return (
    <div className="px-4 py-32 md:px-8">
      <InstallPluginGuide
        plugin={plugin}
        email={session.email}
        mcpUrl={mcpUrl}
        accessMode={subscribed ? "pro" : "free-trial"}
        freeTrialEndsAt={trialStatus?.endsAt?.toISOString() ?? null}
      />
    </div>
  );
}
