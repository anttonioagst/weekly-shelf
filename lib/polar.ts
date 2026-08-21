import { Polar } from "@polar-sh/sdk";
import { PRODUCT_DESCRIPTION, PRODUCT_NAME } from "./types";

export type PolarServer = "sandbox" | "production";

export function polarServer(): PolarServer {
  const value = process.env.POLAR_SERVER ?? "sandbox";
  if (value === "production") return "production";
  return "sandbox";
}

export function liveMoneyAllowed(): boolean {
  return process.env.POLAR_ALLOW_LIVE === "true";
}

export function assertSandboxUnlessAllowed(): void {
  if (polarServer() === "production" && !liveMoneyAllowed()) {
    throw new Error(
      "Live Polar is blocked until Polar accepts the honest SKU. Debug on sandbox.",
    );
  }
}

export function polarClient(): Polar {
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("POLAR_ACCESS_TOKEN is not set. Use a Polar sandbox organization token.");
  }
  assertSandboxUnlessAllowed();
  return new Polar({
    accessToken,
    server: polarServer(),
  });
}

export function productId(): string {
  const id = process.env.POLAR_PRODUCT_ID;
  if (!id) {
    throw new Error("POLAR_PRODUCT_ID is not set. Run npm run setup:polar");
  }
  return id;
}

export function isPolarRefusal(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const haystack = message.toLowerCase();
  return (
    haystack.includes("acceptable use") ||
    haystack.includes("advertising") ||
    haystack.includes("sponsorship") ||
    haystack.includes("director") ||
    haystack.includes("restricted") ||
    haystack.includes("prohibited") ||
    haystack.includes("not allowed")
  );
}

export const HONEST_SKU = {
  name: PRODUCT_NAME,
  description: PRODUCT_DESCRIPTION,
};
