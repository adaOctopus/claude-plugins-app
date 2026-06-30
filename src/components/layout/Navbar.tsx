"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent px-4 pt-6 md:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="font-serif brand-lockup text-lg text-charcoal">
          plugsville
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/login">LOGIN</Link>
          </Button>
          {/* <Button asChild>
            <Link href="/pricing">GET STARTED</Link>
          </Button> */}
        </div>
      </nav>
    </header>
  );
}
