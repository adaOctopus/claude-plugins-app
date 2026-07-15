import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { RotatingTagHeadline } from "@/components/landing/RotatingTagHeadline";
import { ClaudeMark } from "../icons/ClaudeMark";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

type TagCommand = {
  tag: string;
  emoji: string;
  title: string;
  blurb: string;
  result: string;
  accent: string;
  glow: string;
};

const tagCommands: TagCommand[] = [
  {
    tag: "@rebase",
    emoji: "🔀",
    title: "Rebase",
    blurb: "Type it. Branch rebased. Conflicts handled.",
    result: "Interactive rebase done · main synced",
    accent: "from-[#E8F4FF] to-[#D6EBFF]",
    glow: "shadow-[0_8px_24px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(255,255,255,0.95)]",
  },
  {
    tag: "@FullRun",
    emoji: "🚀",
    title: "Full Run",
    blurb: "Commits, push, PR opened & description included.",
    result: "PR #847 opened · CI green · reviewers tagged",
    accent: "from-[#E8FAF6] to-[#D1F4EE]",
    glow: "shadow-[0_8px_24px_rgba(13,148,136,0.14),inset_0_1px_0_rgba(255,255,255,0.95)]",
  },
  {
    tag: "@WTF",
    emoji: "😂",
    title: "WTF",
    blurb: "AI fucked up? Fresh run. No shame.",
    result: "New run started · rolling back bad diff",
    accent: "from-[#FFF4E8] to-[#FFE8D6]",
    glow: "shadow-[0_8px_24px_rgba(245,158,11,0.12),inset_0_1px_0_rgba(255,255,255,0.95)]",
  },
  {
    tag: "@Slack",
    emoji: "💬",
    title: "Slack",
    blurb: "Drafts team updates. You approve. Send.",
    result: "Draft ready · tone-matched to #backend",
    accent: "from-[#F3EEFF] to-[#E8DEFF]",
    glow: "shadow-[0_8px_24px_rgba(139,92,246,0.12),inset_0_1px_0_rgba(255,255,255,0.95)]",
  },
];

/** Neo-skeu tag pill — glossy icon tile + command copy. */
function SkeuTagCard({ tag, emoji, title, blurb, result, accent, glow }: TagCommand) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-b p-4 transition-transform duration-200 hover:-translate-y-0.5 sm:p-5",
        accent,
        glow
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-gradient-to-b from-white to-white/60 text-xl shadow-[0_2px_6px_rgba(45,41,38,0.08),inset_0_1px_0_rgba(255,255,255,1)]"
          aria-hidden
        >
          {emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-charcoal">{tag}</span>
            <span className="text-xs font-medium text-charcoal-muted">{title}</span>
          </div>
          <p className="mt-1 text-sm leading-snug text-charcoal">{blurb}</p>
          <p className="mt-2 rounded-lg border border-white/60 bg-white/50 px-2.5 py-1.5 font-mono text-[10px] leading-relaxed text-[#0D9488] sm:text-[11px]">
            → {result}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Mini chat bubble for the phone mock. */
function ChatBubble({
  role,
  children,
  className,
}: {
  role: "user" | "assistant";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start", className)}>
      <div
        className={cn(
          "max-w-[92%] rounded-2xl px-3 py-2 text-[11px] leading-snug sm:text-xs",
          role === "user"
            ? "rounded-tr-sm bg-charcoal text-cream"
            : "rounded-tl-sm border border-border/80 bg-white text-charcoal shadow-sm"
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Phone frame with Claude chat — @ commands from mobile. */
function PhoneChatMock() {
  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-xs">
      <div
        className="overflow-hidden rounded-[2rem] border-[3px] border-charcoal/90 bg-charcoal/90 p-1.5 shadow-[0_20px_50px_rgba(45,41,38,0.18),inset_0_1px_0_rgba(255,255,255,0.15)]"
        aria-hidden
      >
        <div className="overflow-hidden rounded-[1.6rem] bg-[#FAFAF8]">
          <div className="flex items-center justify-between border-b border-border/60 bg-white px-3 py-2">
            <div className="flex items-center gap-1.5">
              <ClaudeMark className="h-4 w-4" />
              <span className="text-[10px] font-semibold text-charcoal">Claude</span>
            </div>
            <span className="rounded-full bg-[#E8FAF6] px-2 py-0.5 text-[8px] font-bold text-[#0D9488]">
              coolplugz
            </span>
          </div>

          <div className="space-y-2.5 p-3">
            <ChatBubble role="user">
              <span className="font-mono font-semibold">@PRready</span> 🚀
            </ChatBubble>
            <ChatBubble role="assistant">
              <span className="flex items-center gap-1 font-semibold text-[#0D9488]">
                <Sparkles className="h-3 w-3" />
                Done in 1m 47s
              </span>
              <span className="mt-1 block text-charcoal-muted">
                Committed · pushed · PR #847 with description. Approve?
              </span>
            </ChatBubble>
            <ChatBubble role="user">
              <span className="font-mono font-semibold">@Slack</span> 💬
            </ChatBubble>
            <ChatBubble role="assistant">
              <span className="text-charcoal-muted">Slack draft · #backend</span>
              <div className="mt-1.5 rounded-lg border border-[#E8DEFF]/80 bg-gradient-to-b from-[#FAF8FF] to-white px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <p className="text-[11px] leading-snug text-charcoal sm:text-xs">
                  Fix is done, included in PR — review please?
                </p>
                <div className="mt-2 flex gap-1.5">
                  <span className="rounded-md bg-[#0D9488] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">
                    Send
                  </span>
                  <span className="rounded-md border border-border bg-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-charcoal-muted">
                    Edit
                  </span>
                </div>
              </div>
            </ChatBubble>
          </div>

          <div className="border-t border-border/60 bg-white px-3 py-2">
            <div className="flex items-center gap-2 rounded-full border border-border bg-cream-warm/80 px-3 py-1.5">
              <span className="text-[10px] text-charcoal-muted">Message Claude…</span>
              <span className="ml-auto font-mono text-[10px] font-bold text-[#0D9488]">@</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 top-8 hidden rotate-6 rounded-xl border border-white/70 bg-gradient-to-b from-white to-[#FFF4E8] px-2.5 py-1.5 shadow-lg sm:block">
        <span className="text-lg">⚡</span>
      </div>
      <div className="absolute -left-3 bottom-16 hidden -rotate-6 rounded-xl border border-white/70 bg-gradient-to-b from-white to-[#E8FAF6] px-2.5 py-1.5 shadow-lg sm:block">
        <span className="text-lg">📱</span>
      </div>
    </div>
  );
}

/** @-tag commands section — speed, ease, phone-first dev workflow. */
export function ChatTagsSection() {
  return (
    <section
      id="tags"
      className="border-t border-border/60 bg-gradient-to-b from-cream-warm/50 to-cream px-4 py-20 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          Complete Tasks With Just Keywords
        </Badge>
        <RotatingTagHeadline />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal-muted md:text-base">
          Complete tasks, draft Slack msgs, rebase, open PRs — with just one keyword.
          {/* No context switching.{" "} */}
          <strong className="font-semibold text-charcoal">
            <br />You can literally do the work from your phone.
          </strong>
        </p>

        {/* <div className="mt-10 flex items-center gap-2 rounded-2xl border border-[#7DD3C0]/30 bg-gradient-to-r from-[#E8FAF6]/80 to-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:inline-flex sm:gap-3 sm:px-5 sm:py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white text-lg shadow-sm">
            📱
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-charcoal">
              <Smartphone className="h-3.5 w-3.5 text-[#0D9488]" />
              If too lazy do it from your phone
            </p>
            <p className="text-xs text-charcoal-muted sm:text-sm">
              Same Claude session just one keyword.
            </p>
          </div>
          <span className="ml-auto hidden items-center gap-1 rounded-full bg-[#0D9488] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:flex">
            <Zap className="h-3 w-3" />
            ~60s runs
          </span>
        </div> */}

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          <div className="order-2 lg:order-1">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-charcoal-muted">
              @ commands in Claude
            </p>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {tagCommands.map((cmd) => (
                <SkeuTagCard key={cmd.tag} {...cmd} />
              ))}
            </div>
          </div>

          <div className="order-1 flex flex-col items-center lg:order-2 lg:items-end">
            <PhoneChatMock />
            <p className="mt-4 max-w-[280px] text-center text-xs text-charcoal-muted lg:text-right">
              Initiate runs, send Slack, approve PRs — all from chat. Tags do the heavy lifting.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {[
            { label: "Rebase", emoji: "🔀" },
            { label: "PR", emoji: "🚀" },
            { label: "WTF", emoji: "😂" },
            { label: "Slack", emoji: "💬" },
          ].map(({ label, emoji }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-gradient-to-b from-white to-cream-warm px-3 py-1.5 text-xs font-medium text-charcoal shadow-[0_2px_8px_rgba(45,41,38,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]"
            >
              <span className="text-sm">{emoji}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
