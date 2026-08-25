import { fulfillOrder, type WeekBoard } from "./fulfill";
import type { CheckoutHold } from "./types";

export const FOUNDING_URL = "https://wiip.club";
export const FOUNDING_CHECKOUT_PREFIX = "founding:";
export const FOUNDING_ORDER_PREFIX = "founding-order:";

export const FOUNDING_LISTING = {
  identityKey: "web:https://wiip.club",
  type: "site" as const,
  url: FOUNDING_URL,
  name: "wiip.club",
  blurb:
    "Crie e descubra comunidades pagas no Brasil: feed, encontros, classroom e assinatura recorrente.",
  iconUrl: "https://wiip.club/apple-icon.png",
  screenshotUrl: "https://wiip.club/og.png",
};

export function foundingCheckoutId(weekId: string): string {
  return `${FOUNDING_CHECKOUT_PREFIX}${weekId}`;
}

export function foundingOrderId(weekId: string): string {
  return `${FOUNDING_ORDER_PREFIX}${weekId}`;
}

export function withFoundingListing(board: WeekBoard, now: Date): WeekBoard {
  if (Object.keys(board.listings).length > 0) return board;

  const checkoutId = foundingCheckoutId(board.weekId);
  const hold: CheckoutHold = {
    checkoutId,
    weekId: board.weekId,
    identityKey: FOUNDING_LISTING.identityKey,
    type: FOUNDING_LISTING.type,
    url: FOUNDING_LISTING.url,
    name: FOUNDING_LISTING.name,
    blurb: FOUNDING_LISTING.blurb,
    iconUrl: FOUNDING_LISTING.iconUrl,
    screenshotUrl: FOUNDING_LISTING.screenshotUrl,
    quotedCents: 100,
    holdExpiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    status: "open",
  };

  const { board: next, result } = fulfillOrder(
    {
      ...board,
      checkouts: { ...board.checkouts, [checkoutId]: hold },
    },
    {
      orderId: foundingOrderId(board.weekId),
      checkoutId,
      paidAt: now,
      now,
    },
  );

  return result.ok ? next : board;
}
