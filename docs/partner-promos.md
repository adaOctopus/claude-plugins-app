# Partner promo codes (influencer revenue share)

Dynamic promo codes for YouTube / influencer partnerships: **25% off** for customers (configurable), tracked in **MongoDB** for revenue-share payouts.

## How it works

1. You create a promo via admin API → Stripe **Coupon** + **Promotion Code** + Mongo `PartnerPromo` record.
2. Influencer shares `https://www.coolplugz.com/?promo=THEIRCODE` (or user enters code on pricing).
3. Checkout applies the Stripe discount automatically.
4. Webhook records each payment in `PartnerPromoRedemption`:
   - **initial** — first subscription checkout
   - **renewal** — each `invoice.paid` while subscription keeps the partner link
5. `partnerShareAmount` = `netAmount × (revenueSharePercent / 100)` (default 25% of what the customer paid after discount).

## Stripe webhook

Add **`invoice.paid`** to your Stripe webhook events (Dashboard → Developers → Webhooks → your endpoint).

Existing events still required: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

## Create a promo (admin)

Set `PROMO_ADMIN_SECRET` on Vercel (or reuse `COOLPLUGZ_ADMIN_SECRET`).

```bash
curl -X POST https://www.coolplugz.com/api/admin/partner-promos \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "DEVALEX25",
    "partnerName": "Alex Codes",
    "partnerEmail": "alex@youtube.com",
    "discountPercent": 25,
    "revenueSharePercent": 25,
    "notes": "Q1 YouTube campaign"
  }'
```

## List promos + stats

```bash
curl https://www.coolplugz.com/api/admin/partner-promos \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

Response includes per-promo:

- `stats.redemptionCount`
- `stats.totalNetRevenue` — customer paid (after discount)
- `stats.totalPartnerShare` — what you owe the partner

## Deactivate a promo

```bash
curl -X PATCH https://www.coolplugz.com/api/admin/partner-promos \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{ "code": "DEVALEX25", "active": false }'
```

Existing subscribers keep their Stripe discount; renewals still accrue partner share until they cancel.

## Mongo collections

| Collection | Purpose |
|---|---|
| `partnerpromos` | Code, partner, discount %, revenue share %, Stripe IDs |
| `partnerpromoredemptions` | One row per checkout or renewal invoice |

## Influencer links

```
https://www.coolplugz.com/?promo=DEVALEX25#pricing
```

Code is validated, stored in session, and sent to Stripe on checkout.

## Dev self-serve referral program (homepage)

Developers generate their own code on the homepage **`/#make-money`** section — no admin API required.

| Setting | Default | Env override |
|---|---|---|
| Friend discount | 15% | `REFERRAL_DISCOUNT_PERCENT` |
| Partner revenue share | 20% | `REFERRAL_REVENUE_SHARE_PERCENT` |

### Generate a link

```bash
curl -X POST https://www.coolplugz.com/api/referral/generate \
  -H "Content-Type: application/json" \
  -d '{ "email": "dev@example.com" }'
```

Response includes `code`, `shareUrl`, and `stats` (redemptions, earnings).

One active code per email. Codes look like `COOLPLUGZTASOS4821` (prefix + email fragment + unique suffix).

### Lookup stats

```bash
curl "https://www.coolplugz.com/api/referral/stats?email=dev@example.com"
```

### Rules

- Self-referral blocked at checkout (same email as partner)
- Renewals accrue share while subscription stays linked
- Payouts are manual to `partnerEmail` (v1)

### Share URL format

```
https://www.coolplugz.com/?promo=COOLPLUGZTASOS4821#pricing
```

Promos are stored with `source: "dev_referral"` in MongoDB (admin-created promos use `source: "admin"`).
