"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DownloadButton({ pluginId }: { pluginId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/plugins/${pluginId}/download`);
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
      else alert(data.error || "Download failed");
    } catch {
      alert("Download failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" onClick={handleDownload} disabled={loading}>
      {loading ? "..." : "Download"}
    </Button>
  );
}

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Failed");
    } catch {
      alert("Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="mt-2"
      onClick={handlePortal}
      disabled={loading}
    >
      {loading ? "Loading..." : "Manage billing"}
    </Button>
  );
}

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <Button type="button" variant="ghost" onClick={handleLogout}>
      Sign out
    </Button>
  );
}
