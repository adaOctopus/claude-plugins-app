"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STEPS = ["Metadata", "Commands", "Preview", "Publish"];

/** Plugin builder wizard — create and publish plugins in-app. */
export default function CreatePluginPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("engineering");
  const [integrations, setIntegrations] = useState("Jira, Slack, GitHub");
  const [commandName, setCommandName] = useState("");
  const [commandDesc, setCommandDesc] = useState("");
  const [commandPrompt, setCommandPrompt] = useState("");
  const [commands, setCommands] = useState<
    { name: string; description: string; prompt: string }[]
  >([]);
  const [priceMonthly, setPriceMonthly] = useState("2.5");

  async function createDraft() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/plugins/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          title,
          description,
          category,
          integrations: integrations.split(",").map((s) => s.trim()),
          commands,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) throw new Error(data.error);
      setDraftId(data.draftId);
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  function addCommand() {
    if (!commandName || !commandPrompt) return;
    setCommands([
      ...commands,
      { name: commandName, description: commandDesc, prompt: commandPrompt },
    ]);
    setCommandName("");
    setCommandDesc("");
    setCommandPrompt("");
  }

  async function publish() {
    if (!draftId) return;
    setLoading(true);
    setError("");
    try {
      await fetch("/api/plugins/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          draftId,
          title,
          description,
          category,
          integrations: integrations.split(",").map((s) => s.trim()),
          commands,
        }),
      });

      const res = await fetch("/api/plugins/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish",
          draftId,
          priceMonthly: parseFloat(priceMonthly),
        }),
      });
      const data = await res.json();
      if (res.status === 403) {
        setError("Active subscription required to publish and sell plugins.");
        return;
      }
      if (!res.ok) throw new Error(data.error);
      router.push(`/plugins/${data.plugin.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-32 md:px-8">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">
        Create your plugin
      </h1>
      <p className="mt-2 text-charcoal-muted">
        Build a Claude plugin and publish to the marketplace. You keep 99% of sales.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <Badge key={s} variant={i === step ? "default" : "secondary"}>
            {i + 1}. {s}
          </Badge>
        ))}
      </div>

      {step === 0 && (
        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="title">Plugin name</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="integrations">Integrations (comma-separated)</Label>
            <Input id="integrations" value={integrations} onChange={(e) => setIntegrations(e.target.value)} className="mt-2" />
          </div>
          <Button onClick={createDraft} disabled={loading || !title || !description}>
            {loading ? "Creating..." : "Next: Commands"}
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-8 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add command</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Command name" value={commandName} onChange={(e) => setCommandName(e.target.value)} />
              <Input placeholder="Description" value={commandDesc} onChange={(e) => setCommandDesc(e.target.value)} />
              <Textarea placeholder="Prompt template" value={commandPrompt} onChange={(e) => setCommandPrompt(e.target.value)} />
              <Button type="button" variant="outline" onClick={addCommand}>
                Add command
              </Button>
            </CardContent>
          </Card>
          {commands.length > 0 && (
            <ul className="space-y-2 text-sm">
              {commands.map((cmd) => (
                <li key={cmd.name} className="rounded-xl border border-border p-3">
                  <strong>{cmd.name}</strong> — {cmd.description}
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-4">
            <Button onClick={() => setStep(2)} disabled={commands.length === 0}>
              Next: Preview
            </Button>
            <Button variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{description}</p>
              <p className="text-charcoal-muted">Category: {category}</p>
              <p className="text-charcoal-muted">Integrations: {integrations}</p>
              <p className="font-medium">{commands.length} command(s)</p>
            </CardContent>
          </Card>
          <div className="mt-6 flex gap-4">
            <Button onClick={() => setStep(3)}>Next: Publish</Button>
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="price">Monthly price (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.5"
              min="2"
              max="10"
              value={priceMonthly}
              onChange={(e) => setPriceMonthly(e.target.value)}
              className="mt-2"
            />
            <p className="mt-2 text-xs text-charcoal-muted">
              Platform fee: 1%. You receive 99% of each sale (manual payout).
            </p>
          </div>
          <Button onClick={publish} disabled={loading}>
            {loading ? "Publishing..." : "Publish to marketplace"}
          </Button>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <Button variant="ghost" className="mt-8" asChild>
        <Link href="/app">← Back to dashboard</Link>
      </Button>
    </div>
  );
}
