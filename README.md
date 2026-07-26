# coolplugz — Claude Plugin Marketplace

A Next.js 15 platform for selling, uploading, and creating Claude plugins. Features an SEO-optimized landing page, Stripe subscriptions, MongoDB persistence, and email magic-link authentication.

## Product overview

**coolplugz** helps remote engineers work less by gathering context from Jira, Slack, and GitHub into Claude plugins. The platform includes:

- **Landing page** — earthy cream design, problem/solution sections, dashboard mockups, integrations bento grid
- **Marketplace** — browse, buy, upload, or create plugins
- **Stripe billing** — $47/month or $397/year Pro plan (10 runs/mo included); one-time credit top-ups; $2.50/month per extra plugin
- **Creator economy** — publish plugins, earn 99% (1% platform fee, manual payouts at launch)

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Framer Motion |
| Charts | Recharts |
| Database | MongoDB + Mongoose |
| Auth | Email magic link (JWT session cookie) |
| Payments | Stripe Checkout + Customer Portal + Webhooks |
| Email | Resend |
| File storage | Vercel Blob |

## Project structure

```
claude-plugins/
├── docs/ui-reference/       # UI design reference images
├── public/                  # Static assets
├── scripts/
│   └── seed.ts              # Seed flagship plugin
├── src/
│   ├── app/
│   │   ├── api/             # Auth, Stripe, plugin APIs
│   │   ├── app/             # Authenticated dashboard, upload, create
│   │   ├── install/         # Post-purchase install guide
│   │   ├── login/           # Magic link sign-in
│   │   ├── plugins/         # Marketplace browse + detail
│   │   ├── pricing/         # Subscription checkout
│   │   ├── privacy/         # Privacy Policy (CoolPlugz Inc.)
│   │   ├── terms/           # Terms of Service (CoolPlugz Inc.)
│   │   ├── layout.tsx       # Root layout + SEO
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── landing/         # Hero, Problem, Solution, Dashboard, etc.
│   │   ├── layout/          # Navbar, Footer
│   │   ├── marketplace/     # Purchase buttons, dashboard actions
│   │   ├── seo/             # JSON-LD structured data
│   │   └── ui/              # shadcn/ui components
│   ├── lib/                 # db, auth, stripe, email, entitlements
│   └── models/              # Mongoose models
├── .env.example
└── README.md
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

### 3. Start MongoDB

Use MongoDB Atlas or local MongoDB. Set `MONGODB_URI` in `.env.local`.

### 4. Seed flagship plugin

```bash
MONGODB_URI=your_uri npx tsx scripts/seed.ts
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Site mode (WIP / LIVE)

The launch flag lives in `NEXT_PUBLIC_SITE_MODE`:

| Value | Behavior |
|---|---|
| `WIP` (default) | Navbar shows **WIP** badge. Payments, `/plugins`, `/pricing`, `/install`, and creator upload routes redirect to `/#coming-soon` on the landing page. |
| `LIVE` | Full marketplace, Stripe checkout, and install flows are enabled. |

To go live, set in Vercel (and `.env.local`):

```bash
NEXT_PUBLIC_SITE_MODE=LIVE
```

Flag logic: `src/lib/site-mode.ts`. Coming-soon UI: `src/components/landing/ComingSoonSection.tsx`.

### Waitlist → Google Sheets

While in WIP mode, emails from the coming-soon form POST to `/api/waitlist`. Signups are **saved to MongoDB** first; if `GOOGLE_SHEETS_WEBHOOK_URL` is set, they are also appended to your Google Sheet.

Enterprise **Contact us** submissions from pricing POST to `/api/sales/inquiry` and append to a **`SALES`** tab in the same spreadsheet (`submittedAt` | `email` | `description` | `source`).

1. Create a Google Sheet with headers on the active tab: `submittedAt` | `email` | `source`
2. **Extensions → Apps Script** — paste `scripts/google-apps-script-waitlist.js` into **Code.gs** → **Save**
3. Toolbar function dropdown → select **`doGet`** → **Run** → authorize when Google prompts
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (not “Only myself”)
4. Copy the URL ending in **`/exec`** — e.g. `https://script.google.com/macros/s/AKfycb…/exec`
   - Do **not** use the script editor URL (`…/macros/edit?…`) or the Sheet URL — those cause “Access Denied”
5. Open the `/exec` URL in a browser — you should see `{"ok":true,"message":"coolplugz waitlist + sales ready"}`
6. Set `GOOGLE_SHEETS_WEBHOOK_URL` in Vercel to that `/exec` URL

**After updating the Apps Script** (e.g. adding SALES support): paste the new script, **Save**, then **Deploy → Manage deployments → Edit → New version → Deploy** so the live `/exec` URL picks up changes. The script auto-creates a **`SALES`** tab if it does not exist.

**Troubleshooting Google ("Unauthorized" / "does not exist")**

| Symptom | Fix |
|---|---|
| Unauthorized in browser | Select **`doGet`** in Apps Script → **Run** → authorize, then redeploy Web app |
| Does not exist after login | URL is stale or wrong ID — **Deploy → Manage deployments → copy fresh `/exec` URL** |
| Access Denied HTML | Access is not **Anyone**, or you copied the script editor link |
| Works logged in, not in incognito | Redeploy with **Who has access: Anyone** (test in incognito) |

**Skip Google for now:** if `MONGODB_URI` is set in Vercel, emails save to MongoDB even when Sheets fails. You can remove `GOOGLE_SHEETS_WEBHOOK_URL` temporarily and fix Sheets later.

### 6. Stripe webhook (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/pricing` | Subscription plans |
| `/app` | User dashboard (after email login) |
| `/login` | Email login |
| `/plugins` | Marketplace browse |
| `/plugins/[slug]` | Plugin detail |
| `/install` | Claude plugin install guide |
| `/privacy` | Privacy Policy — CoolPlugz Inc. |
| `/terms` | Terms of Service — CoolPlugz Inc. |
| `/guides` | SEO guides hub |
| `/guides/[slug]` | Topic guides (AI fatigue, context switching, etc.) |
| `/compare/[slug]` | Product comparisons (Cursor, Copilot) |
| `/app/upload` | Upload plugin form |
| `/app/create` | Plugin builder wizard |

## API routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/send-link` | POST | Send magic link email |
| `/api/auth/verify` | POST | Verify token, create session (GET redirects to `/login/verify` without consuming token) |
| `/login/verify` | Page | Magic link landing — verifies via POST (safe from email prefetch) |
| `/api/auth/logout` | POST | Clear session |
| `/api/stripe/checkout` | POST | Create Checkout Session |
| `/api/stripe/credit-checkout` | POST | One-time credit top-up checkout (active Pro only) |
| `/api/stripe/cancel-subscription` | POST | Cancel subscription at period end |
| `/api/stripe/portal` | POST | Customer Portal URL |
| `/api/stripe/webhook` | POST | Stripe event handler |
| `/api/referral/generate` | POST | Self-serve dev referral link (email → promo code) |
| `/api/referral/stats` | GET | Referral earnings stats by partner email |
| `/api/promo/validate` | GET | Validate partner promo code |
| `/api/admin/partner-promos` | GET/POST/PATCH | Create/list/deactivate influencer promos (admin) |
| `/api/plugins` | GET/POST | List / upload plugins |
| `/api/plugins/builder` | POST | Create/publish builder drafts |
| `/api/provision-coolplugz` | POST | Mint MCP URL (paid subscribers) |
| `/api/provision-coolplugz/free-trial` | POST | Card-free 7-day trial MCP URL |
| `/api/usage` | GET | Run quota summary for logged-in user |
| `/api/usage/consume` | POST | MCP server decrements one run (Bearer `COOLPLUGZ_ADMIN_SECRET`) |
| `/api/waitlist` | POST | Waitlist email capture |
| `/api/sales/inquiry` | POST | Enterprise contact form → Mongo + Google Sheets SALES tab |

## Pricing

- **Free 7-day trial**: $0, no credit card — 3 included runs via unique MCP URL (7-day TTL on CoolPlugz server)
- **Pro monthly**: $47/mo — 10 full task runs per month included; top-up credits from Manage Account
- **Pro annual**: $397/yr — ~30% savings
- **Credit top-ups** (one-time, active Pro only): $10 → 5 runs, $20 → 10 runs ($2/run server budget cap)
- **Enterprise**: custom pricing — multi-seat teams, pipeline optimization; **Contact us** form on pricing
- **Premium** (legacy Stripe tier): grandfathered subscribers only
- **Add-ons**: $2.50/mo per extra marketplace plugin
- **Creator fee**: 1% platform commission (manual payouts)
- **Partner promos**: influencer codes (admin API) + **dev self-serve referrals** on homepage `#make-money` (15% friend discount, 20% revenue share) — see `docs/partner-promos.md`

**Stripe env for credit packs:** `STRIPE_CREDIT_PACK_5`, `STRIPE_CREDIT_PACK_10` (one-time prices in Stripe Dashboard).

Free trial flow: pricing → magic-link login → `/premium/unique-mcp-url?start=trial` → `POST /api/provision-coolplugz/free-trial` → CoolPlugz admin API with `tier: "trial"` and `ttlHours: 168`.

### CoolPlugz MCP provisioning (external API)

Set on Vercel / `.env.local` when your server is ready:

```bash
COOLPLUGZ_API_URL=https://api.coolplugz.com
COOLPLUGZ_ADMIN_SECRET=your_admin_secret_here
```

**Paid subscription** — `POST /api/provision-coolplugz` (this app, session auth) calls your MCP server:

```http
POST ${COOLPLUGZ_API_URL}/admin/keys
Authorization: Bearer ${COOLPLUGZ_ADMIN_SECRET}
Content-Type: application/json

{ "email": "user@example.com", "tier": "pro" }
```

Override the path with `COOLPLUGZ_PROVISION_PATH` if your server uses a different route (default: `/admin/keys`).

**Free 7-day trial** — same external endpoint with:

```json
{ "email": "user@example.com", "tier": "trial", "ttlHours": 168 }
```

Response expected: `{ "mcpUrl": "https://..." }` or `{ "key": "..." }` (website builds `https://{api-host}/mcp/{key}` if only a key is returned).

Optional: `COOLPLUGZ_MCP_URL_TEMPLATE=https://mcp.example.com/{key}` when your server returns a key slug instead of a full URL.

Optional: set `COOLPLUGZ_ADMIN_SECRET` to send `Authorization: Bearer …` if your server requires it.

### Usage limits sync (external API — MCP server)

After subscription checkout, renewal, credit top-up, or trial provision, the website pushes run quotas to your MCP server (best-effort; website ledger is source of truth until MCP enforces limits):

```http
PATCH ${COOLPLUGZ_API_URL}/admin/keys/limits
Authorization: Bearer ${COOLPLUGZ_ADMIN_SECRET}
Content-Type: application/json

{
  "email": "user@example.com",
  "includedRunsRemaining": 12,
  "bonusRunsRemaining": 5,
  "maxCostPerRunUsd": 2,
  "periodEnd": "2026-08-15T00:00:00.000Z"
}
```

Override the path with `COOLPLUGZ_LIMITS_PATH` if your server uses a different route.

**Consumption order:** included runs first, then bonus runs. Included runs reset each billing period; bonus runs persist until used.

### MCP → website (consume a run)

When a task run **starts** on the MCP server, call the website to decrement the ledger (Manage Account stays in sync):

```http
POST https://www.coolplugz.com/api/usage/consume
Authorization: Bearer ${COOLPLUGZ_ADMIN_SECRET}
Content-Type: application/json

{ "email": "user@example.com" }
```

**Success (200):**

```json
{
  "success": true,
  "usage": {
    "includedRunsLimit": 3,
    "includedRunsUsed": 1,
    "includedRunsRemaining": 2,
    "bonusRunsRemaining": 0,
    "totalRunsRemaining": 2,
    "periodEnd": "2026-08-01T12:00:00.000Z",
    "maxCostPerRunUsd": 2
  }
}
```

**No runs left (402):** `{ "success": false, "error": "no_runs_remaining" }` — block the run on MCP and tell the user to top up or upgrade.

**No usage record (404):** user never provisioned / trial not started.

Use the same `COOLPLUGZ_ADMIN_SECRET` on both sides. Call consume **once per task run**, before spending LLM/compute budget (enforce `maxCostPerRunUsd: 2` locally on MCP).

## Deployment

Recommended: [Vercel](https://vercel.com)

1. Push to GitHub
2. Import project in Vercel
3. Add all env vars from `.env.example`
4. Configure Stripe webhook to production URL
5. Verify Resend domain for email delivery

## SEO

Organic SEO content lives under `/guides/` (problem-aware articles) and `/compare/` (bottom-funnel comparisons). See [docs/seo-ops.md](docs/seo-ops.md) for Search Console, analytics, and MCP directory submission checklists.

Optional analytics env var: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Google Analytics 4 — free).

## License

Private — coolplugz
