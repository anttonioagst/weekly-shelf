import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseInput } from "./identity";

describe("parseInput", () => {
  it("detects App Store id", () => {
    const parsed = parseInput(
      "https://apps.apple.com/us/app/gravity-animals/id6448311061",
    );
    assert.deepEqual(parsed, {
      type: "ios",
      identityKey: "ios:6448311061",
      url: "https://apps.apple.com/app/id6448311061",
    });
  });

  it("detects Play Store package", () => {
    const parsed = parseInput(
      "https://play.google.com/store/apps/details?id=com.example.app&hl=en",
    );
    assert.deepEqual(parsed, {
      type: "android",
      identityKey: "android:com.example.app",
      url: "https://play.google.com/store/apps/details?id=com.example.app",
    });
  });

  it("normalizes website URLs to the same listing", () => {
    const a = parseInput("HTTP://WWW.Example.com/Foo/?ref=1#x");
    const b = parseInput("https://example.com/Foo");
    assert.equal(a.identityKey, b.identityKey);
    assert.equal(a.url, "https://example.com/Foo");
    assert.equal(a.type, "site");
  });

  it("rejects TestFlight, invites, and empty input", () => {
    assert.throws(() => parseInput("https://testflight.apple.com/join/abc"), {
      message: "TestFlight-only links are out.",
    });
    assert.throws(() => parseInput("https://t.me/something"), {
      message: "Chat and invite links are out.",
    });
    assert.throws(() => parseInput("   "), /Need a live/);
  });
});
