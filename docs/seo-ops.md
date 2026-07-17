# coolplugz SEO — Ops Checklist

Manual steps that cannot be fully automated in the repo. Work through these after deploying the `/guides/` and `/compare/` pages.

## Google Search Console

1. Verify `www.coolplugz.com` at [Google Search Console](https://search.google.com/search-console) (DNS TXT recommended).
2. Submit sitemap: `https://www.coolplugz.com/sitemap.xml`
3. Request indexing for high-priority URLs:
   - `/guides/developer-freedom-with-claude`
   - `/guides/make-money-with-claude-as-a-developer`
   - `/guides/best-claude-plugins-for-developers`
   - `/guides/claude-code-after-tutorial`
   - `/guides/multiple-clients-parallel-claude`
4. Validate homepage FAQ rich results: [Rich Results Test](https://search.google.com/test/rich-results)

## Weekly measurement (first 8 weeks)

In Search Console → **Performance** → filter by query. Track:

- `how to make money with claude`
- `make money with claude`
- `best claude plugins`
- `best claude skills`
- `best claude connectors`
- `claude automation`
- `context switching remote work`
- `slack anxiety remote work`
- `LLM spirals`
- `claude plugin for developers`

Also track landing page paths under `/guides/*` and `/compare/*`.

## YouTube vs Google intent (Claude searches)

YouTube autocomplete for "Claude" / "Claude Code" skews **learning**: best practices, tutorial, code tutorial, code agents, beginners. Do **not** try to outrank YouTube on those terms with video — we win the **second search** on Google.

| Platform | Typical autocomplete | Intent | Our page |
|---|---|---|---|
| YouTube | claude tutorial, claude code tutorial | Learn UI, watch demos | — (distribution only) |
| YouTube | claude best practices, claude code agents | Learn patterns | Bridge → `/guides/claude-code-after-tutorial` |
| Google | best claude plugins/skills/connectors | Pick tools | `/guides/best-claude-plugins-for-developers` |
| Google | how to make money with claude | Monetize workflow | `/guides/make-money-with-claude-as-a-developer` |
| Google | claude code best practices, claude MCP | Post-tutorial setup | `/guides/claude-code-after-tutorial` |

Track in Search Console (add to weekly list):

- `claude best practices`
- `claude code best practices`
- `claude code agents`
- `claude code tutorial` (expect low CTR — bridge copy should say "after the tutorial")

Optional Phase 5: dev.to or YouTube description links back to `/guides/claude-code-after-tutorial` with `rel=canonical` on the written guide.

## Analytics (Google Analytics 4 — free)

1. Go to [Google Analytics](https://analytics.google.com/) → Admin → Create property for `coolplugz.com`.
2. Add a **Web** data stream for `https://www.coolplugz.com`.
3. Copy the **Measurement ID** (format `G-XXXXXXXXXX`).
4. In Vercel → Project → Settings → Environment Variables, add:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

5. Redeploy. Traffic from `/guides/*` and the homepage will show in GA4 → Reports → Engagement → Pages.

No paid tools required. Search Console (also free) covers search queries; GA4 covers on-site page views and referrals.

## Domain redirects (Vercel)

Confirm in Vercel → Project → Domains:

- `www.coolplugz.com` is primary
- `coolplugz.com` redirects to www (also configured in `next.config.ts`)

## MCP directory backlinks (Phase 4)

Submit coolplugz to:

| Directory | URL |
|---|---|
| MCP Servers org | https://mcpservers.org/submit |
| awesome-mcp-servers (punkpeye) | https://github.com/punkpeye/awesome-mcp-servers |
| awesome-mcp-servers (wong2) | https://github.com/wong2/awesome-mcp-servers |
| Official MCP servers repo | https://github.com/modelcontextprotocol/servers |
| Glama | https://glama.ai/mcp/servers |
| mcp.so | https://mcp.so |

**Listing copy (use honestly):**

- Name: coolplugz
- URL: https://www.coolplugz.com
- Description: Claude MCP plugin for remote engineers — gathers Jira, Slack, GitHub, and Notion context, engineers prompts, ships merge-ready code with CI checked, drafts Slack replies and standups. Approve/reject inside Claude.

**PR template for awesome-mcp-servers:**

```markdown
## coolplugz

- **URL:** https://www.coolplugz.com
- **MCP:** HTTP transport, unique URL per user
- **Integrations:** Jira, GitHub, Notion, Slack
- **Audience:** Remote software engineers — context switching, CI loops, Slack drafts
```

## Distribution (Phase 5)

- dev.to: technical post on Slack session integration (canonical → coolplugz.com)
- Cross-post guides with `rel=canonical` pointing to `/guides/[slug]`
- Reddit (r/ClaudeAI, r/ExperiencedDevs): build stories only, no direct pitch — check sub rules

## Before expecting conversion SEO

Set `NEXT_PUBLIC_SITE_MODE=LIVE` so `/pricing` and `/install` are not redirected to the waitlist.
