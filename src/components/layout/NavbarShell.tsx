import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";

/** Navbar with server-side session — hides login CTA when already signed in. */
export async function NavbarShell() {
  const session = await getSession();
  return <Navbar isLoggedIn={!!session} />;
}
