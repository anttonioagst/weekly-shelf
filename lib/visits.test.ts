import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import {
  countOnline,
  countVisitorsAll,
  countVisitsLast12h,
  recordVisit,
  resetStoreForTests,
} from "./store";
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

  it("counts online, last 12h, and recorded visitors", () => {
    isolatedDir();
    const now = new Date("2026-08-23T17:00:00.000Z");
    assert.equal(touchVisit("1.1.1.1", "a", now).online, 1);
    assert.equal(touchVisit("1.1.1.1", "a", now).last12h, 1);
    assert.equal(touchVisit("2.2.2.2", "b", now).last12h, 2);

    const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000);
    recordVisit(visitorKey("3.3.3.3", "c"), tenMinAgo);
    assert.equal(countOnline(now), 2);
    assert.equal(countVisitsLast12h(now), 3);

    const stale = new Date(now.getTime() - 13 * 60 * 60 * 1000);
    recordVisit(visitorKey("4.4.4.4", "d"), stale);
    assert.equal(countVisitsLast12h(now), 3);
    assert.equal(countVisitorsAll(), 4);
    assert.equal(touchVisit("5.5.5.5", "e", now).online, 3);
  });
});
