import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { publicAppUrl } from "./app-url";

function request(headers: Record<string, string>, url = "https://example.invalid/api/checkout") {
  return new Request(url, { headers });
}

describe("publicAppUrl", () => {
  it("prefers the live host over a stale APP_URL", () => {
    process.env.APP_URL = "https://old-design.example";
    const url = publicAppUrl(
      request({
        host: "weekly-shelf-6dg9gn231-antonio-augustos-projects-12a6f6b6.vercel.app",
        "x-forwarded-proto": "https",
      }),
    );
    assert.equal(
      url,
      "https://weekly-shelf-6dg9gn231-antonio-augustos-projects-12a6f6b6.vercel.app",
    );
    delete process.env.APP_URL;
  });

  it("uses http on localhost", () => {
    const url = publicAppUrl(request({ host: "localhost:3000" }));
    assert.equal(url, "http://localhost:3000");
  });
});
