# weekly-shelf

Weekly $1 shelf: latest paid move wins. Apps + sites. Stripe. Monday 00:00 UTC reset.

Whoever pays the current price (`$1 + N`) goes to #1. The next move costs $1 more. The shelf empties Monday 00:00 UTC. One field: App Store, Play Store, or website URL. No login. No guaranteed clicks, SEO, or installs.

## Stripe

One honest SKU: **Weekly #1 shelf listing** — one-time USD, quoted each move. Hosted Checkout Session. Do not pass `payment_method_types`; enable Pix and cards in the Stripe Dashboard.

```bash
cp .env.example .env.local
# set STRIPE_SECRET_KEY (prefer a restricted rk_test_ key)
npm install
npm test
npm run dev
```

Webhook: `POST /api/webhook/stripe` (`checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`). Local return also confirms via `/?checkout_id=…` after Stripe redirects.

## Rules (product)

See `/rules`. Checkout holds the quoted price for 30 minutes. A late confirmation does not move the shelf. Same store-id / normalized URL is the same listing. Refunds remove rank; the week price never goes backwards.
