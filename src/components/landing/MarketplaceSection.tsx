import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wand2, ArrowRight } from "lucide-react";

/** Marketplace section — upload or create plugins and sell them. */
export function MarketplaceSection() {
  return (
    <section id="marketplace" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          Marketplace
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          Upload, create, or resell Claude plugins
        </h2>
        <p className="mt-4 max-w-2xl text-charcoal-muted">
          Whether you&apos;re an engineer, designer, or PM in the AI-first remote
          era — publish plugins your peers need and earn from every subscription.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Upload className="mb-2 h-8 w-8 text-charcoal" />
              <CardTitle>Upload your plugin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-charcoal-muted">
                Have a Claude plugin ready? Upload your manifest, README, and
                bundle with our clear file checklist. Set your price and publish.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-charcoal-muted">
                <li>• plugin.json / manifest required</li>
                <li>• README with install steps</li>
                <li>• Source or bundle .zip</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/app/upload">
                  Upload plugin <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Wand2 className="mb-2 h-8 w-8 text-charcoal" />
              <CardTitle>Create & sell in-app</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-charcoal-muted">
                Use our plugin builder to define prompts, commands, and
                integrations. Publish to the marketplace and earn — we take
                just 1% commission.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/app/create">
                  Start building <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
