import { InputError } from "@/lib/identity";
import { previewListing } from "@/lib/preview";
import { currentWeekSnapshot } from "@/lib/shelf";
import {
  CHECKOUT_PRODUCT_BLURB,
  listingMetadata,
  STRIPE_INTEGRATION_ID,
  stripeClient,
} from "@/lib/stripe";
import { saveBoard, withLockedWeek } from "@/lib/store";
import { HOLD_MS, PRODUCT_NAME, type CheckoutHold } from "@/lib/types";
import { priceCents, weekIdAt } from "@/lib/week";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function appUrl(request: Request): string {
  return (
    process.env.APP_URL ??
    request.headers.get("origin") ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { url?: string } | null;
  const url = body?.url ?? "";

  let preview;
  try {
    preview = await previewListing(url);
  } catch (error) {
    const message =
      error instanceof InputError
        ? error.message
        : "Need a live App Store, Play Store, or website URL.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const now = new Date();
  const weekId = weekIdAt(now);
  const quotedCents = priceCents(currentWeekSnapshot(now).moveCount);
  const holdExpiresAt = new Date(now.getTime() + HOLD_MS).toISOString();
  const origin = appUrl(request);
  const metadata = listingMetadata({
    weekId,
    identityKey: preview.identityKey,
    listingType: preview.type,
    listingUrl: preview.url,
    quotedCents,
    holdExpiresAt,
  });

  let checkout: { id: string; url: string };
  try {
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      integration_identifier: STRIPE_INTEGRATION_ID,
      success_url: `${origin}/?checkout_id={CHECKOUT_SESSION_ID}`,
      cancel_url: origin,
      expires_at: Math.floor((now.getTime() + HOLD_MS + 2000) / 1000),
      allow_promotion_codes: false,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: quotedCents,
            product_data: {
              name: PRODUCT_NAME,
              description: CHECKOUT_PRODUCT_BLURB,
            },
          },
        },
      ],
      metadata,
      payment_intent_data: { metadata },
    });
    if (!session.id || !session.url) {
      throw new Error("Stripe Checkout did not return a URL.");
    }
    checkout = { id: session.id, url: session.url };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe checkout failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const hold: CheckoutHold = {
    checkoutId: checkout.id,
    weekId,
    identityKey: preview.identityKey,
    type: preview.type,
    url: preview.url,
    name: preview.name,
    blurb: preview.blurb,
    iconUrl: preview.iconUrl,
    screenshotUrl: preview.screenshotUrl,
    quotedCents,
    holdExpiresAt,
    status: "open",
  };

  await withLockedWeek(weekId, (board) => {
    saveBoard({
      ...board,
      checkouts: { ...board.checkouts, [hold.checkoutId]: hold },
    });
  });

  return NextResponse.json({
    checkoutUrl: checkout.url,
    quotedCents,
    holdExpiresAt,
    checkoutId: checkout.id,
  });
}
