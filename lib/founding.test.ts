import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyBoard, shelfRows } from "./fulfill";
import {
  FOUNDING_LISTING,
  foundingOrderId,
  withFoundingListing,
} from "./founding";
import { priceDollars } from "./week";

describe("founding listing", () => {
  it("places wiip.club at #1 on an empty week and raises the next price", () => {
    const now = new Date("2026-08-25T12:00:00.000Z");
    const board = withFoundingListing(emptyBoard("2026-08-24"), now);
    const rows = shelfRows(board);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].url, FOUNDING_LISTING.url);
    assert.equal(rows[0].rank, 1);
    assert.equal(board.moveCount, 1);
    assert.equal(priceDollars(board.moveCount), 2);
    assert.equal(board.moves[foundingOrderId("2026-08-24")]?.amountCents, 100);
  });

  it("does not replace an occupied shelf", () => {
    const now = new Date("2026-08-25T12:00:00.000Z");
    let board = withFoundingListing(emptyBoard("2026-08-24"), now);
    board = {
      ...board,
      listings: {
        "web:https://other.example": {
          identityKey: "web:https://other.example",
          type: "site",
          url: "https://other.example",
          name: "Other",
          iconUrl: null,
          screenshotUrl: null,
          lastPaidAt: now.toISOString(),
          lastAmountCents: 200,
        },
      },
    };
    const again = withFoundingListing(board, now);
    assert.equal(shelfRows(again)[0].url, "https://other.example");
  });
});
