import { InputError } from "@/lib/identity";
import { isPolarRefusal, polarClient, productId } from "@/lib/polar";
import { previewListing } from "@/lib/preview";
import { currentWeekSnapshot } from "@/lib/shelf";
import { saveBoard, withLockedWeek } from "@/lib/store";
import { HOLD_MS, type CheckoutHold } from "@/lib/types";
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
  const successUrl = `${appUrl(request)}/?checkout_id={CHECKOUT_ID}`;

  let polarCheckout: { id: string; url: string };
  try {
    const polar = polarClient();
    const sku = productId();
    const checkout = await polar.checkouts.create({
      products: [sku],
      prices: {
        [sku]: [
          {
            amountType: "fixed",
            priceAmount: quotedCents,
            priceCurrency: "usd",
          },
        ],
      },
      successUrl,
      returnUrl: appUrl(request),
      allowDiscountCodes: false,
      customerIpAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        undefined,
      metadata: {
        sku: "Weekly #1 shelf listing",
        week_id: weekId,
        identity_key: preview.identityKey,
        listing_type: preview.type,
        listing_url: preview.url,
        quoted_cents: String(quotedCents),
        hold_expires_at: holdExpiresAt,
      },
    });
    if (!checkout.id || !checkout.url) {
      throw new Error("Polar checkout did not return a URL.");
    }
    polarCheckout = { id: checkout.id, url: checkout.url };
  } catch (error) {
    if (isPolarRefusal(error)) {
      return NextResponse.json(
        {
          error:
            "STOP: Polar refused or flagged this SKU. No second payment provider. Report and wait.",
          polar: error instanceof Error ? error.message : String(error),
        },
        { status: 503 },
      );
    }
    const message = error instanceof Error ? error.message : "Polar checkout failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const hold: CheckoutHold = {
    polarCheckoutId: polarCheckout.id,
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
      checkouts: { ...board.checkouts, [hold.polarCheckoutId]: hold },
    });
  });

  return NextResponse.json({
    checkoutUrl: polarCheckout.url,
    quotedCents,
    holdExpiresAt,
    checkoutId: polarCheckout.id,
  });
}
