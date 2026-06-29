# Project X — Claude Plugin Marketplace

A Next.js 15 platform for selling, uploading, and creating Claude plugins. Features an SEO-optimized landing page, Stripe subscriptions, MongoDB persistence, and email magic-link authentication.

## Product overview

**Project X** helps remote engineers work less by gathering context from Jira, Slack, and GitHub into Claude plugins. The platform includes:

- **Landing page** — earthy cream design, problem/solution sections, dashboard mockups, integrations bento grid
- **Marketplace** — browse, buy, upload, or create plugins
- **Stripe billing** — €19/month or €149/year base plan; €2.50/month per extra plugin
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
| `/login` | Magic link sign-in |
| `/plugins` | Marketplace browse |
| `/plugins/[slug]` | Plugin detail |
| `/install` | Claude plugin install guide |
| `/app` | User dashboard |
| `/app/upload` | Upload plugin form |
| `/app/create` | Plugin builder wizard |

## API routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/send-link` | POST | Send magic link email |
| `/api/auth/verify` | GET | Verify token, create session |
| `/api/auth/logout` | POST | Clear session |
| `/api/stripe/checkout` | POST | Create Checkout Session |
| `/api/stripe/portal` | POST | Customer Portal URL |
| `/api/stripe/webhook` | POST | Stripe event handler |
| `/api/plugins` | GET/POST | List / upload plugins |
| `/api/plugins/builder` | POST | Create/publish builder drafts |
| `/api/plugins/[id]/download` | GET | Download with entitlement check |

## Pricing

- **Monthly**: €19/mo — includes flagship Context Engineer plugin
- **Annual**: €149/yr — ~35% savings
- **Add-ons**: €2.50/mo per extra marketplace plugin
- **Creator fee**: 1% platform commission (manual payouts)

## Deployment

Recommended: [Vercel](https://vercel.com)

1. Push to GitHub
2. Import project in Vercel
3. Add all env vars from `.env.example`
4. Configure Stripe webhook to production URL
5. Verify Resend domain for email delivery

## License

Private — Project X
