import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getInstallAccessState } from "@/lib/install-access";
import { getMarketplacePluginBySlug } from "@/lib/marketplace-plugins.server";
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
    return { title: "Install guide not found" };
  }
  return {
    title: `${plugin.title} — Install Guide`,
    description: `Step-by-step setup for ${plugin.title} in Claude Desktop.`,
  };
}

/** Per-plugin install guide with free (magic link) or Pro (subscription) access gates. */
export default async function InstallPluginPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await getSession();
  const access = await getInstallAccessState(
    session?.id ?? null,
    session?.email ?? null,
    slug
  );

  if (access.status === "not_found") {
    notFound();
  }

  return (
    <div className="px-4 py-32 md:px-8">
      {access.status === "gate" && (
        <InstallEmailGate plugin={access.plugin} kind={access.kind} slug={slug} />
      )}

      {access.status === "paywall" && (
        <InstallPaywall plugin={access.plugin} email={access.email} />
      )}

      {access.status === "granted" && (
        <InstallPluginGuide plugin={access.plugin} email={access.email} />
      )}
    </div>
  );
}
