import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDailyPassStatus } from "@/lib/daily-pass";
import { getFreeTrialStatus } from "@/lib/free-trial";
import { canAccessMcp } from "@/lib/free-trial";
import { hasActiveSubscription, getUserSubscription } from "@/lib/entitlements";
import { fulfillDailyPassSession } from "@/lib/fulfill-daily-pass";
import {
  getUserMcpUrl,
  isUserOnDailyPass,
} from "@/lib/provision-coolplugz";
import { ensureUsageSyncedToMcp } from "@/lib/usage";
import { UNIQUE_MCP_URL_PATH } from "@/lib/mcp-setup-paths";
import { getMarketplacePluginBySlug } from "@/lib/marketplace-plugins.server";
import { InstallCheckoutFulfillShell } from "@/components/install/InstallCheckoutFulfillShell";
import { InstallPaywall } from "@/components/install/InstallPaywall";
import { InstallPluginGuide } from "@/components/install/InstallPluginGuide";
import { CANONICAL_SITE_URL, createPageMetadata } from "@/lib/seo";

const FLAGSHIP_SLUG = "context-engineer";

type PageProps = {
  searchParams: Promise<{ session_id?: string; daily?: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Your MCP URL",
  description:
    "Your unique CoolPlugz MCP URL — paste it into Claude under Settings → MCP Servers and connect your tools.",
  path: UNIQUE_MCP_URL_PATH,
  siteUrl: CANONICAL_SITE_URL,
});

/** Post-purchase or daily-pass page — unique MCP URL + minimal getting started guide. */
export default async function UniqueMcpUrlPage({ searchParams }: PageProps) {
  const { session_id: checkoutSessionId, daily } = await searchParams;
  const plugin = await getMarketplacePluginBySlug(FLAGSHIP_SLUG);
  if (!plugin) notFound();

  if (checkoutSessionId && !daily) {
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

  if (daily === "success" && checkoutSessionId) {
    await fulfillDailyPassSession(checkoutSessionId);
    redirect(UNIQUE_MCP_URL_PATH);
  }

  const hasAccess = await canAccessMcp(session.id);
  if (!hasAccess) {
    const dailyStatus = await getDailyPassStatus(session.id);
    const trialStatus = await getFreeTrialStatus(session.id);
    const passExpired =
      (dailyStatus.startedAt && !dailyStatus.active) ||
      (trialStatus.used && !trialStatus.active);

    return (
      <div className="px-4 py-32 md:px-8">
        <InstallPaywall
          plugin={plugin}
          email={session.email}
          passExpired={passExpired}
        />
      </div>
    );
  }

  const mcpUrl = await getUserMcpUrl(session.id);
  const subscribed = await hasActiveSubscription(session.id);
  const onDailyPass = await isUserOnDailyPass(session.id);
  const dailyStatus = onDailyPass ? await getDailyPassStatus(session.id) : null;

  if (subscribed) {
    const subscription = await getUserSubscription(session.id);
    if (subscription) {
      await ensureUsageSyncedToMcp(session.id, {
        subscriptionPeriodEnd: subscription.currentPeriodEnd,
      });
    }
  } else if (dailyStatus?.active && dailyStatus.expiresAt) {
    await ensureUsageSyncedToMcp(session.id, {
      dailyPassEnd: new Date(dailyStatus.expiresAt),
    });
  } else {
    const trialStatus = await getFreeTrialStatus(session.id);
    if (trialStatus?.active && trialStatus.endsAt) {
      await ensureUsageSyncedToMcp(session.id, { trialEnd: new Date(trialStatus.endsAt) });
    }
  }

  return (
    <div className="px-4 py-32 md:px-8">
      <InstallPluginGuide
        plugin={plugin}
        email={session.email}
        mcpUrl={mcpUrl}
        accessMode={subscribed ? "pro" : "daily"}
        passExpiresAt={dailyStatus?.expiresAt?.toISOString() ?? null}
      />
    </div>
  );
}
