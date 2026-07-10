import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wand2, ArrowRight } from "lucide-react";
import { resolveProductHref } from "@/lib/site-mode";

/** Marketplace section — future expansion for more plugins. */
export function MarketplaceSection() {
  return (
    <section id="marketplace" className="border-t border-border/60 px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          Make Money with Claude Plugins
        </Badge>
        <h2 className="font-serif text-3xl text-charcoal md:text-5xl">
          Publish your Claude plugins for <span style={{ fontStyle: "italic", fontWeight: "600" }}>extra income.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-charcoal-muted">
          Upload your existing plugins, or create your own. Fast and with no coding needed.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="opacity-90">
            <CardHeader>
              <Upload className="mb-2 h-8 w-8 text-charcoal" />
              <CardTitle>Upload your plugin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-charcoal-muted">
                Have a Claude plugin ready? Upload it and start selling.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href={resolveProductHref("/app/upload")}>
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
                Launch and sell your plugins with our in-app wizard — no coding needed. 
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href={resolveProductHref("/app/create")}>
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
