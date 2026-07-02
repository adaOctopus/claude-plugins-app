import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wand2, ArrowRight } from "lucide-react";

/** Marketplace section — future expansion for more plugins. */
export function MarketplaceSection() {
  return (
    <section id="marketplace" className="border-t border-border/60 px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          Make Money with Claude
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          Publish your Claude plugins for extra income.
        </h2>
        <p className="mt-4 max-w-2xl text-charcoal-muted">
          Upload your existing plugins, or create your own. Fast and no coding needed.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="opacity-90">
            <CardHeader>
              <Upload className="mb-2 h-8 w-8 text-charcoal" />
              <CardTitle>Upload your plugin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-charcoal-muted">
                Have a Claude plugin ready? Upload your manifest, README, and
                bundle. Set your price and publish to the marketplace.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/app/upload">
                  Publish now<ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="opacity-90">
            <CardHeader>
              <Wand2 className="mb-2 h-8 w-8 text-charcoal" />
              <CardTitle>Create & sell in-app</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-charcoal-muted">
                Build plugins with our in-app wizard — define prompts, commands,
                and integrations. Publish and earn when the marketplace launches.
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
