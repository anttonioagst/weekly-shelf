import type {
  ActivityItem,
  CheckoutHold,
  ListingType,
  PaidMove,
  ShelfRow,
} from "./types";
import { isHoldValid, weekIdAt } from "./week";

export type ListingRecord = {
  identityKey: string;
  type: ListingType;
  url: string;
  name: string;
  blurb?: string | null;
  iconUrl: string | null;
  screenshotUrl: string | null;
  lastPaidAt: string;
  lastAmountCents: number;
};

export type WeekBoard = {
  weekId: string;
  moveCount: number;
  listings: Record<string, ListingRecord>;
  moves: Record<string, PaidMove>;
  checkouts: Record<string, CheckoutHold>;
};

export function emptyBoard(weekId: string): WeekBoard {
  return { weekId, moveCount: 0, listings: {}, moves: {}, checkouts: {} };
}

export type FulfillInput = {
  orderId: string;
  checkoutId: string;
  paidAt: Date;
  now: Date;
};

export type FulfillResult =
  | { ok: true; reason: "applied" | "already" }
  | { ok: false; reason: "hold_expired" | "unknown_checkout" | "wrong_week" };

export function fulfillOrder(board: WeekBoard, input: FulfillInput): {
  board: WeekBoard;
  result: FulfillResult;
} {
  if (board.moves[input.orderId] && !board.moves[input.orderId].refunded) {
    return { board, result: { ok: true, reason: "already" } };
  }

  const checkout = board.checkouts[input.checkoutId];
  if (!checkout) {
    return { board, result: { ok: false, reason: "unknown_checkout" } };
  }
  if (checkout.status === "fulfilled") {
    return { board, result: { ok: true, reason: "already" } };
  }

  const currentWeek = weekIdAt(input.now);
  if (checkout.weekId !== currentWeek || checkout.weekId !== board.weekId) {
    return { board, result: { ok: false, reason: "wrong_week" } };
  }

  if (!isHoldValid(new Date(checkout.holdExpiresAt), input.now)) {
    const next = cloneBoard(board);
    next.checkouts[checkout.checkoutId] = {
      ...checkout,
      status: "expired_ignored",
    };
    return { board: next, result: { ok: false, reason: "hold_expired" } };
  }

  const next = cloneBoard(board);
  const move: PaidMove = {
    orderId: input.orderId,
    checkoutId: checkout.checkoutId,
    weekId: checkout.weekId,
    identityKey: checkout.identityKey,
    amountCents: checkout.quotedCents,
    paidAt: input.paidAt.toISOString(),
    refunded: false,
  };
  next.moves[input.orderId] = move;
  next.moveCount += 1;
  next.checkouts[checkout.checkoutId] = { ...checkout, status: "fulfilled" };
  next.listings[checkout.identityKey] = {
    identityKey: checkout.identityKey,
    type: checkout.type,
    url: checkout.url,
    name: checkout.name,
    blurb: checkout.blurb ?? null,
    iconUrl: checkout.iconUrl,
    screenshotUrl: checkout.screenshotUrl,
    lastPaidAt: move.paidAt,
    lastAmountCents: move.amountCents,
  };
  return { board: next, result: { ok: true, reason: "applied" } };
}

export function refundOrder(
  board: WeekBoard,
  orderId: string,
): WeekBoard {
  const move = board.moves[orderId];
  if (!move || move.refunded) return board;

  const next = cloneBoard(board);
  next.moves[orderId] = { ...move, refunded: true };
  // Price never goes backwards.
  const remaining = Object.values(next.moves)
    .filter((m) => m.identityKey === move.identityKey && !m.refunded)
    .sort((a, b) => b.paidAt.localeCompare(a.paidAt));

  if (remaining.length === 0) {
    delete next.listings[move.identityKey];
    return next;
  }

  const latest = remaining[0];
  const listing = next.listings[move.identityKey];
  if (listing) {
    next.listings[move.identityKey] = {
      ...listing,
      lastPaidAt: latest.paidAt,
      lastAmountCents: latest.amountCents,
    };
  }
  return next;
}

export function recentActivity(board: WeekBoard, limit = 8): ActivityItem[] {
  const ranks = new Map(
    shelfRows(board).map((row) => [row.identityKey, row] as const),
  );
  return Object.values(board.moves)
    .filter((move) => !move.refunded)
    .sort((a, b) => b.paidAt.localeCompare(a.paidAt))
    .slice(0, limit)
    .flatMap((move) => {
      const row = ranks.get(move.identityKey);
      const listing = board.listings[move.identityKey];
      if (!row || !listing) return [];
      return [
        {
          identityKey: move.identityKey,
          name: listing.name,
          url: listing.url,
          iconUrl: listing.iconUrl,
          type: listing.type,
          rank: row.rank,
          amountCents: move.amountCents,
          paidAt: move.paidAt,
        },
      ];
    });
}

export function shelfRows(board: WeekBoard): ShelfRow[] {
  return Object.values(board.listings)
    .sort((a, b) => b.lastPaidAt.localeCompare(a.lastPaidAt))
    .map((listing, index) => ({
      rank: index + 1,
      identityKey: listing.identityKey,
      type: listing.type,
      url: listing.url,
      name: listing.name,
      blurb: listing.blurb ?? null,
      iconUrl: listing.iconUrl,
      screenshotUrl: listing.screenshotUrl,
      lastPaidAt: listing.lastPaidAt,
      lastAmountCents: listing.lastAmountCents,
    }));
}

function cloneBoard(board: WeekBoard): WeekBoard {
  return {
    weekId: board.weekId,
    moveCount: board.moveCount,
    listings: { ...board.listings },
    moves: { ...board.moves },
    checkouts: { ...board.checkouts },
  };
}
