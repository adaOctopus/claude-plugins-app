"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CoolplugzLogo } from "@/components/brand/CoolplugzMark";
import { SiteModeBadge } from "@/components/waitlist/SiteModeBadge";
import { cn } from "@/lib/utils";

export function Navbar() {
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
        {/* <SiteModeBadge /> */}
      </nav>
    </header>
  );
}
