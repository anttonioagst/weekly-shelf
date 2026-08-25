import Stripe from "stripe";
import { PRODUCT_NAME } from "./types";

/** Dashboard label for this hosted Checkout flow (8-letter suffix). */
export const STRIPE_INTEGRATION_ID = "weekly-shelf-kqmtrwab";

export const CHECKOUT_PRODUCT_BLURB =
  "The #1 row, a link out, and a screenshot. No clicks, SEO, or installs guaranteed.";

export function stripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set. Use a restricted Stripe key (rk_test_… / rk_live_…).");
  }
  return new Stripe(key);
}

export function stripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
  }
  return secret;
}

export function listingMetadata(input: {
  weekId: string;
  identityKey: string;
  listingType: string;
  listingUrl: string;
  quotedCents: number;
  holdExpiresAt: string;
}): Stripe.MetadataParam {
  return {
    sku: PRODUCT_NAME,
    week_id: input.weekId,
    identity_key: input.identityKey,
    listing_type: input.listingType,
    listing_url: input.listingUrl,
    quoted_cents: String(input.quotedCents),
    hold_expires_at: input.holdExpiresAt,
  };
}

export function stripeObjectId(
  ref: string | { id: string } | null | undefined,
): string | null {
  if (!ref) return null;
  if (typeof ref === "string") return ref;
  return ref.id || null;
}

export function orderIdFromSession(session: Stripe.Checkout.Session): string | null {
  return stripeObjectId(session.payment_intent) ?? session.id;
}

export function isSessionPaid(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === "paid";
}
