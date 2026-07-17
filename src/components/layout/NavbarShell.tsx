import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { isWipSite } from "@/lib/site-mode";

/** Navbar — login when signed out; manage account when signed in. */
export async function NavbarShell() {
  const session = await getSession();
  return <Navbar isLoggedIn={!!session} isWip={isWipSite()} />;
}
