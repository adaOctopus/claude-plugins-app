"use client";

import { Suspense } from "react";
import { InstallCheckoutFulfill } from "@/components/install/InstallCheckoutFulfill";

export function InstallCheckoutFulfillShell() {
  return (
    <Suspense fallback={null}>
      <InstallCheckoutFulfill />
    </Suspense>
  );
}
