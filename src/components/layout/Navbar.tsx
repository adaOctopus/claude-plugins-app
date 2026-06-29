"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#problem", label: "Problem" },
  { href: "/#dashboard", label: "Dashboard" },
  { href: "/#plugins", label: "Plugin" },
  { href: "/pricing", label: "Pricing" },
  { href: "/install", label: "Install" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:px-8">
      <nav className="pill-nav mx-auto flex max-w-5xl items-center justify-between rounded-full px-4 py-2 md:px-6">
        <Link href="/" className="font-serif text-lg text-charcoal">
          Project X
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-charcoal-muted transition-colors hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/pricing">Buy Plugin</Link>
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "pill-nav mx-auto mt-2 max-w-5xl rounded-2xl p-4 md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-charcoal-muted"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="outline" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/pricing">Buy Plugin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
