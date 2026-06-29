"use client";

import { useEffect, useState } from "react";

/** Renders children only after mount — avoids SSR/client mismatches (charts, etc.). */
export function ClientOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback ?? null;
  }

  return children;
}
