"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const requiredFiles = [
  "plugin.json or manifest file",
  "README with install steps",
  "Source or bundle (.zip)",
  "Icon (optional)",
];

/** Upload plugin page — form with file checklist and drag-drop. */
export default function UploadPluginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/plugins", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.status === 403) {
        setError("Active subscription required to upload plugins.");
        setStatus("error");
        return;
      }
      if (!res.ok) throw new Error(data.error);

      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-32 md:px-8">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">Upload plugin</h1>
      <p className="mt-2 text-charcoal-muted">
        Submit your Claude plugin for review. Requires an active subscription.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Required files</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-charcoal-muted">
            {requiredFiles.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <Label htmlFor="title">Plugin name</Label>
          <Input id="title" name="title" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="slug">URL slug (optional)</Label>
          <Input id="slug" name="slug" placeholder="my-plugin" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required className="mt-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" defaultValue="engineering" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="priceMonthly">Price ($/month)</Label>
            <Input
              id="priceMonthly"
              name="priceMonthly"
              type="number"
              step="0.5"
              min="2"
              max="10"
              defaultValue="2.5"
              className="mt-2"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="files">Plugin files</Label>
          <Input
            id="files"
            name="files"
            type="file"
            multiple
            required
            className="mt-2"
            accept=".zip,.json,.md,.png,.jpg"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Uploading..." : "Submit for review"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/app">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
