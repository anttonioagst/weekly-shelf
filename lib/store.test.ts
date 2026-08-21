import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { applyPaidOrder } from "./apply";
import { emptyBoard, shelfRows } from "./fulfill";
import { loadBoard, resetStoreForTests, saveBoard } from "./store";
import { HOLD_MS } from "./types";
import { weekIdAt } from "./week";

function isolatedDir() {
  process.env.SHELF_DATA_DIR = mkdtempSync(path.join(tmpdir(), "shelf-"));
  resetStoreForTests();
}

describe("store + apply", () => {
  it("persists a paid move to #1", async () => {
    isolatedDir();
    const weekId = weekIdAt(new Date("2026-08-21T12:00:00.000Z"));
    const board = emptyBoard(weekId);
    board.checkouts.c1 = {
      polarCheckoutId: "c1",
      weekId,
      identityKey: "web:https://example.com",
      type: "site",
      url: "https://example.com",
      name: "Example",
      iconUrl: null,
      screenshotUrl: "https://example.com/og.png",
      quotedCents: 100,
      holdExpiresAt: "2026-08-21T12:30:00.000Z",
      status: "open",
    };
    saveBoard(board);

    const outcome = await applyPaidOrder({
      checkoutId: "c1",
      orderId: "o1",
      now: new Date("2026-08-21T12:01:00.000Z"),
    });
    assert.equal(outcome, "applied");
    const rows = shelfRows(loadBoard(weekId));
    assert.equal(rows[0].rank, 1);
    assert.equal(rows[0].name, "Example");
    assert.equal(loadBoard(weekId).moveCount, 1);
  });

  it("does not persist a late webhook as a move", async () => {
    isolatedDir();
    const now = new Date("2026-08-21T13:00:00.000Z");
    const weekId = weekIdAt(now);
    const board = emptyBoard(weekId);
    board.checkouts.c1 = {
      polarCheckoutId: "c1",
      weekId,
      identityKey: "web:https://late.example",
      type: "site",
      url: "https://late.example",
      name: "Late",
      iconUrl: null,
      screenshotUrl: null,
      quotedCents: 100,
      holdExpiresAt: new Date(now.getTime() - HOLD_MS).toISOString(),
      status: "open",
    };
    saveBoard(board);
    const outcome = await applyPaidOrder({
      checkoutId: "c1",
      orderId: "o-late",
      now,
    });
    assert.equal(outcome, "hold_expired");
    assert.equal(shelfRows(loadBoard(weekId)).length, 0);
    assert.equal(loadBoard(weekId).moveCount, 0);
  });
});
