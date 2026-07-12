import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { isWipSite } from "@/lib/site-mode";

/** Navbar — site mode + session; hides manage CTA only on /app when signed in. */
export async function NavbarShell() {
  const session = await getSession();
  return <Navbar isLoggedIn={!!session} isWip={isWipSite()} />;
}
