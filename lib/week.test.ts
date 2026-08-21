import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isHoldValid,
  nextMondayUtc,
  priceCents,
  priceDollars,
  weekIdAt,
} from "./week";

describe("week", () => {
  it("starts Monday 00:00 UTC", () => {
    assert.equal(weekIdAt(new Date("2026-08-21T17:00:00.000Z")), "2026-08-17");
    assert.equal(weekIdAt(new Date("2026-08-17T00:00:00.000Z")), "2026-08-17");
    assert.equal(weekIdAt(new Date("2026-08-16T23:59:59.000Z")), "2026-08-10");
  });

  it("counts down to next Monday 00:00 UTC", () => {
    const next = nextMondayUtc(new Date("2026-08-21T12:00:00.000Z"));
    assert.equal(next.toISOString(), "2026-08-24T00:00:00.000Z");
  });

  it("prices as $1 + N", () => {
    assert.equal(priceDollars(0), 1);
    assert.equal(priceDollars(8), 9);
    assert.equal(priceCents(0), 100);
    assert.equal(priceCents(1), 200);
  });

  it("holds the quoted price for 30 minutes inclusive", () => {
    const start = new Date("2026-08-21T12:00:00.000Z");
    const expiry = new Date(start.getTime() + 30 * 60 * 1000);
    assert.equal(isHoldValid(expiry, expiry), true);
    assert.equal(
      isHoldValid(expiry, new Date(expiry.getTime() + 1)),
      false,
    );
  });
});
