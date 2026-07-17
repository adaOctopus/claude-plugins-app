"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CoolplugzLogo } from "@/components/brand/CoolplugzMark";
import { MarketplaceNotifyTrigger } from "@/components/waitlist/MarketplaceNotifyDialog";
import { cn } from "@/lib/utils";

const navButtonClassName =
  "inline-flex items-center rounded-full border border-charcoal/25 bg-transparent px-4 py-2 text-sm font-normal text-charcoal-muted transition-colors hover:border-charcoal/40 hover:text-charcoal";

export function Navbar({
  isLoggedIn = false,
  isWip = true,
}: {
  isLoggedIn?: boolean;
  /** From server — WIP shows waitlist popup; LIVE sends to /login. */
  isWip?: boolean;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isAccountPage = pathname === "/app" || pathname.startsWith("/app/");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        {isLoggedIn && !isAccountPage && (
          <Link href="/app" className={navButtonClassName}>
            Manage Account
          </Link>
        )}
        {!isLoggedIn &&
          !isLoginPage &&
          (isWip ? (
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
          ))}
      </nav>
    </header>
  );
}
