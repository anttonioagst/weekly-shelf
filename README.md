# weekly-shelf

Weekly $1 shelf: latest paid move wins. Apps + sites. Polar. Monday 00:00 UTC reset.

Whoever pays the current price (`$1 + N`) goes to #1. The next move costs $1 more. The shelf empties Monday 00:00 UTC. One field: App Store, Play Store, or website URL. No login. No visitor metrics. No guaranteed clicks, SEO, or installs.

## Polar (gate)

One honest SKU: **Weekly #1 shelf listing** — one-time USD, quoted each move.

If Polar refuses, flags, or asks to recast this as advertising: **stop**. Do not add Stripe, Lemon, crypto, or invoices.

Sandbox first. Do not test with live cards. Live customer money waits on a Polar non-refusal.

```bash
cp .env.example .env.local
# set POLAR_ACCESS_TOKEN from a Polar sandbox org
npm install
npm run setup:polar   # prints POLAR_PRODUCT_ID
npm test
npm run dev
```

Webhook (when Polar can reach you): `POST /api/webhook/polar`. Local debug also confirms via `/?checkout_id=…` after Polar redirects.

## Rules (product)

See `/rules`. Checkout holds the quoted price for 30 minutes. A late confirmation does not move the shelf. Same store-id / normalized URL is the same listing. Refunds remove rank; the week price never goes backwards.
