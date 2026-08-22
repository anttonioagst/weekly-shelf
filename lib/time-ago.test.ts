import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { timeAgo } from "./time-ago";

describe("timeAgo", () => {
  const now = new Date("2026-08-22T16:00:00.000Z");

  it("formats recent, hourly, and daily deltas", () => {
    assert.equal(timeAgo("2026-08-22T15:59:30.000Z", now), "just now");
    assert.equal(timeAgo("2026-08-22T15:10:00.000Z", now), "50 minutes ago");
    assert.equal(timeAgo("2026-08-22T14:00:00.000Z", now), "2 hr ago");
    assert.equal(timeAgo("2026-08-21T16:00:00.000Z", now), "yesterday");
    assert.equal(timeAgo("2026-08-19T16:00:00.000Z", now), "3 days ago");
  });
});
