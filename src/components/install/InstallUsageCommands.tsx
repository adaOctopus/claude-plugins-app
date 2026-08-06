import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COOLPLUGZ_GETTING_STARTED } from "@/lib/install-guides";

/** Commands to try in Claude after MCP setup — shown in the quick-start section. */
export function InstallUsageCommands() {
  const guide = COOLPLUGZ_GETTING_STARTED;

  return (
    <Card className="border-[#7DD3C0]/25 bg-gradient-to-br from-white to-[#E8FAF6]/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{guide.usageTitle}</CardTitle>
        <p className="text-sm text-charcoal-muted">{guide.usageIntro}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="space-y-3">
          {guide.commands.map((item, index) => (
            <li key={item.command} className="flex gap-3 text-sm leading-relaxed">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8FAF6] text-xs font-semibold text-[#0D9488]">
                {index + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="italic text-charcoal">&quot;{item.command}&quot;</p>
                <p className="mt-0.5 text-charcoal-muted">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-sm text-charcoal-muted">{guide.usageFooter}</p>
      </CardContent>
    </Card>
  );
}
