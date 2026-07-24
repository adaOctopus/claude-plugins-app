"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CoolplugzLogo } from "@/components/brand/CoolplugzMark";
import { MarketplaceNotifyTrigger } from "@/components/waitlist/MarketplaceNotifyDialog";
import { isAccountRoute, isLoginRoute } from "@/lib/nav-routes";
import { cn } from "@/lib/utils";

const navButtonClassName =
  "inline-flex items-center rounded-full border border-charcoal/25 bg-transparent px-4 py-2 text-sm font-normal text-charcoal-muted transition-colors hover:border-charcoal/40 hover:text-charcoal";

async function fetchAuthenticated() {
  try {
    const res = await fetch("/api/auth/session", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { authenticated?: boolean };
    return !!data.authenticated;
  } catch {
    return false;
  }
}

export function Navbar({
  isLoggedIn = false,
  isWip = true,
}: {
  isLoggedIn?: boolean;
  /** From server — WIP shows waitlist popup; LIVE sends to /login. */
  isWip?: boolean;
}) {
  const pathname = usePathname();
  const onAccountPage = isAccountRoute(pathname);
  const onLoginPage = isLoginRoute(pathname);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function syncAuth() {
      const authenticated = await fetchAuthenticated();
      if (!cancelled) setLoggedIn(authenticated);
    }

    void syncAuth();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showManageAccount = loggedIn && !onAccountPage && !onLoginPage;
  const showLogin = !loggedIn && !onLoginPage && !onAccountPage;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 pt-6 transition-[background-color,box-shadow,border-color] duration-200 md:px-8",
        scrolled
          ? "border-b border-border/80 bg-cream pb-4 shadow-[0_1px_0_rgba(45,41,38,0.04)]"
          : "bg-transparent pb-0"
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-charcoal">
          <CoolplugzLogo markSize={46} wordmarkClassName="text-[32px]" />
        </Link>
        {showManageAccount ? (
          <Link href="/app" className={navButtonClassName}>
            Manage Account
          </Link>
        ) : showLogin ? (
          isWip ? (
            <MarketplaceNotifyTrigger
              source="navbar-manage-plugins"
              className={navButtonClassName}
            >
              LOGIN
            </MarketplaceNotifyTrigger>
          ) : (
            <Link href="/login" className={navButtonClassName}>
              LOGIN
            </Link>
          )
        ) : null}
      </nav>
    </header>
  );
}
