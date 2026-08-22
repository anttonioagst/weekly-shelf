import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  emptyBoard,
  fulfillOrder,
  recentActivity,
  refundOrder,
  shelfRows,
  type WeekBoard,
} from "./fulfill";
import type { CheckoutHold } from "./types";
import { HOLD_MS } from "./types";
import { priceDollars } from "./week";

function hold(
  overrides: Partial<CheckoutHold> & Pick<CheckoutHold, "polarCheckoutId">,
): CheckoutHold {
  return {
    weekId: "2026-08-17",
    identityKey: "web:https://example.com",
    type: "site",
    url: "https://example.com",
    name: "Example",
    iconUrl: null,
    screenshotUrl: "https://example.com/og.png",
    quotedCents: 100,
    holdExpiresAt: "2026-08-21T12:30:00.000Z",
    status: "open",
    ...overrides,
  };
}

function boardWith(checkouts: CheckoutHold[]): WeekBoard {
  const board = emptyBoard("2026-08-17");
  for (const checkout of checkouts) {
    board.checkouts[checkout.polarCheckoutId] = checkout;
  }
  return board;
}

describe("fulfillOrder", () => {
  it("latest paid move wins and increments N", () => {
    let board = boardWith([
      hold({ polarCheckoutId: "c1", quotedCents: 100, identityKey: "web:https://a.com", url: "https://a.com", name: "A" }),
      hold({ polarCheckoutId: "c2", quotedCents: 200, identityKey: "web:https://b.com", url: "https://b.com", name: "B" }),
    ]);

    const first = fulfillOrder(board, {
      orderId: "o1",
      checkoutId: "c1",
      paidAt: new Date("2026-08-21T12:01:00.000Z"),
      now: new Date("2026-08-21T12:01:00.000Z"),
    });
    assert.equal(first.result.ok, true);
    board = first.board;
    assert.equal(priceDollars(board.moveCount), 2);

    const second = fulfillOrder(board, {
      orderId: "o2",
      checkoutId: "c2",
      paidAt: new Date("2026-08-21T12:02:00.000Z"),
      now: new Date("2026-08-21T12:02:00.000Z"),
    });
    board = second.board;
    const rows = shelfRows(board);
    assert.equal(rows[0].name, "B");
    assert.equal(rows[0].rank, 1);
    assert.equal(rows[1].name, "A");
    assert.equal(priceDollars(board.moveCount), 3);

    const activity = recentActivity(board);
    assert.equal(activity[0].name, "B");
    assert.equal(activity[0].rank, 1);
    assert.equal(activity[0].amountCents, 200);
    assert.equal(activity[1].name, "A");
  });

  it("same identity is one listing, moved back to #1", () => {
    let board = boardWith([
      hold({ polarCheckoutId: "c1", quotedCents: 100 }),
      hold({ polarCheckoutId: "c2", quotedCents: 200, identityKey: "web:https://other.com", url: "https://other.com", name: "Other" }),
      hold({ polarCheckoutId: "c3", quotedCents: 300 }),
    ]);

    board = fulfillOrder(board, {
      orderId: "o1",
      checkoutId: "c1",
      paidAt: new Date("2026-08-21T12:01:00.000Z"),
      now: new Date("2026-08-21T12:01:00.000Z"),
    }).board;
    board = fulfillOrder(board, {
      orderId: "o2",
      checkoutId: "c2",
      paidAt: new Date("2026-08-21T12:02:00.000Z"),
      now: new Date("2026-08-21T12:02:00.000Z"),
    }).board;
    board = fulfillOrder(board, {
      orderId: "o3",
      checkoutId: "c3",
      paidAt: new Date("2026-08-21T12:03:00.000Z"),
      now: new Date("2026-08-21T12:03:00.000Z"),
    }).board;

    const rows = shelfRows(board);
    assert.equal(rows.length, 2);
    assert.equal(rows[0].identityKey, "web:https://example.com");
    assert.equal(rows[0].lastAmountCents, 300);
    assert.equal(board.moveCount, 3);
  });

  it("late webhook after hold expiry does not move the shelf", () => {
    const started = new Date("2026-08-21T12:00:00.000Z");
    const board = boardWith([
      hold({
        polarCheckoutId: "c1",
        holdExpiresAt: new Date(started.getTime() + HOLD_MS).toISOString(),
      }),
    ]);
    const late = fulfillOrder(board, {
      orderId: "o1",
      checkoutId: "c1",
      paidAt: new Date(started.getTime() + HOLD_MS + 1000),
      now: new Date(started.getTime() + HOLD_MS + 1000),
    });
    assert.deepEqual(late.result, { ok: false, reason: "hold_expired" });
    assert.equal(late.board.moveCount, 0);
    assert.equal(shelfRows(late.board).length, 0);
    assert.equal(late.board.checkouts.c1.status, "expired_ignored");
  });

  it("overlapping holds: both complete, latest #1, N += 2", () => {
    let board = boardWith([
      hold({ polarCheckoutId: "c1", quotedCents: 100, identityKey: "web:https://a.com", url: "https://a.com", name: "A" }),
      hold({ polarCheckoutId: "c2", quotedCents: 100, identityKey: "web:https://b.com", url: "https://b.com", name: "B" }),
    ]);
    board = fulfillOrder(board, {
      orderId: "o1",
      checkoutId: "c1",
      paidAt: new Date("2026-08-21T12:01:00.000Z"),
      now: new Date("2026-08-21T12:01:00.000Z"),
    }).board;
    board = fulfillOrder(board, {
      orderId: "o2",
      checkoutId: "c2",
      paidAt: new Date("2026-08-21T12:02:00.000Z"),
      now: new Date("2026-08-21T12:02:00.000Z"),
    }).board;
    assert.equal(board.moveCount, 2);
    assert.equal(priceDollars(board.moveCount), 3);
    assert.equal(shelfRows(board)[0].name, "B");
  });

  it("refund removes rank and does not lower price", () => {
    let board = boardWith([
      hold({ polarCheckoutId: "c1", quotedCents: 100 }),
    ]);
    board = fulfillOrder(board, {
      orderId: "o1",
      checkoutId: "c1",
      paidAt: new Date("2026-08-21T12:01:00.000Z"),
      now: new Date("2026-08-21T12:01:00.000Z"),
    }).board;
    board = refundOrder(board, "o1");
    assert.equal(shelfRows(board).length, 0);
    assert.equal(board.moveCount, 1);
    assert.equal(priceDollars(board.moveCount), 2);
  });

  it("is idempotent when the checkout is already fulfilled", () => {
    let board = boardWith([hold({ polarCheckoutId: "c1" })]);
    board = fulfillOrder(board, {
      orderId: "o1",
      checkoutId: "c1",
      paidAt: new Date("2026-08-21T12:01:00.000Z"),
      now: new Date("2026-08-21T12:01:00.000Z"),
    }).board;
    const again = fulfillOrder(board, {
      orderId: "o-other",
      checkoutId: "c1",
      paidAt: new Date("2026-08-21T12:02:00.000Z"),
      now: new Date("2026-08-21T12:02:00.000Z"),
    });
    assert.deepEqual(again.result, { ok: true, reason: "already" });
    assert.equal(again.board.moveCount, 1);
  });

  it("Monday week mismatch does not apply", () => {
    const board = boardWith([hold({ polarCheckoutId: "c1", weekId: "2026-08-17" })]);
    const result = fulfillOrder(board, {
      orderId: "o1",
      checkoutId: "c1",
      paidAt: new Date("2026-08-24T00:00:01.000Z"),
      now: new Date("2026-08-24T00:00:01.000Z"),
    });
    assert.deepEqual(result.result, { ok: false, reason: "wrong_week" });
    assert.equal(result.board.moveCount, 0);
  });
});
