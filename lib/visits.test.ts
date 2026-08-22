import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { countVisitsLast12h, recordVisit, resetStoreForTests } from "./store";
import { touchVisit, visitorKey } from "./visits";

function isolatedDir() {
  process.env.SHELF_DATA_DIR = mkdtempSync(path.join(tmpdir(), "visits-"));
  resetStoreForTests();
}

describe("visits", () => {
  it("hashes the same visitor to one key", () => {
    assert.equal(visitorKey("1.1.1.1", "bot"), visitorKey("1.1.1.1", "bot"));
    assert.notEqual(visitorKey("1.1.1.1", "bot"), visitorKey("2.2.2.2", "bot"));
  });

  it("counts unique visitors in the last 12 hours", () => {
    isolatedDir();
    const now = new Date("2026-08-22T21:00:00.000Z");
    assert.equal(touchVisit("1.1.1.1", "a", now), 1);
    assert.equal(touchVisit("1.1.1.1", "a", now), 1);
    assert.equal(touchVisit("2.2.2.2", "b", now), 2);

    const stale = new Date(now.getTime() - 13 * 60 * 60 * 1000);
    recordVisit(visitorKey("3.3.3.3", "c"), stale);
    assert.equal(countVisitsLast12h(now), 2);
    assert.equal(touchVisit("4.4.4.4", "d", now), 3);
  });
});
