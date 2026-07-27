import { connectDB } from "@/lib/db";
import { resolveMaxCostPerRunUsd, getUserUsage, markUsageSynced } from "@/lib/usage";
import { User } from "@/models/User";
import { UserUsage } from "@/models/UserUsage";

function getCoolplugzApiConfig() {
  const rawBase = process.env.COOLPLUGZ_API_URL?.trim();
  const adminSecret = process.env.COOLPLUGZ_ADMIN_SECRET;
  if (!rawBase || !adminSecret) {
    return null;
  }
  const baseUrl = /^https?:\/\//i.test(rawBase)
    ? rawBase.replace(/\/$/, "")
    : `https://${rawBase.replace(/\/$/, "")}`;
  return { baseUrl, adminSecret };
}

function buildLimitsUrl(baseUrl: string): string {
  const configured = process.env.COOLPLUGZ_LIMITS_PATH?.trim();
  if (configured) {
    if (configured.startsWith("http://") || configured.startsWith("https://")) {
      return configured.replace(/\/$/, "");
    }
    const path = configured.startsWith("/") ? configured : `/${configured}`;
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/admin/keys/limits`;
}

/** Push remaining run quotas to the CoolPlugz MCP server (best-effort stub). */
export async function syncUsageToCoolplugz(userId: string): Promise<void> {
  const config = getCoolplugzApiConfig();
  if (!config) {
    return;
  }

  await connectDB();
  const user = await User.findById(userId).select("email");
  const usageDoc = await UserUsage.findOne({ userId });
  if (!user?.email || !usageDoc) {
    return;
  }

  const summary = await getUserUsage(userId);
  if (!summary) return;

  const maxCostPerRunUsd = await resolveMaxCostPerRunUsd(userId);

  const payload = {
    email: user.email.toLowerCase().trim(),
    includedRunsLimit: summary.includedRunsLimit,
    includedRunsUsed: summary.includedRunsUsed,
    includedRunsRemaining: summary.includedRunsRemaining,
    bonusRunsRemaining: summary.bonusRunsRemaining,
    totalRunsRemaining: summary.totalRunsRemaining,
    maxCostPerRunUsd,
    periodEnd: summary.periodEnd,
  };

  try {
    const res = await fetch(buildLimitsUrl(config.baseUrl), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminSecret}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn("[CoolPlugz] Usage limits sync failed:", res.status, await res.text());
      return;
    }

    await markUsageSynced(userId);
  } catch (error) {
    console.warn("[CoolPlugz] Usage limits sync error:", error);
  }
}
