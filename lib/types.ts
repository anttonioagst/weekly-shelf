export type ListingType = "ios" | "android" | "site";

export type ParsedInput = {
  type: ListingType;
  identityKey: string;
  url: string;
};

export type ListingPreview = ParsedInput & {
  name: string;
  blurb: string | null;
  iconUrl: string | null;
  screenshotUrl: string | null;
};

export type ActivityItem = {
  identityKey: string;
  name: string;
  url: string;
  iconUrl: string | null;
  type: ListingType;
  rank: number;
  amountCents: number;
  paidAt: string;
};

export type ShelfRow = {
  rank: number;
  identityKey: string;
  type: ListingType;
  url: string;
  name: string;
  blurb: string | null;
  iconUrl: string | null;
  screenshotUrl: string | null;
  lastPaidAt: string;
  lastAmountCents: number;
};

export type CheckoutHold = {
  polarCheckoutId: string;
  weekId: string;
  identityKey: string;
  type: ListingType;
  url: string;
  name: string;
  blurb?: string | null;
  iconUrl: string | null;
  screenshotUrl: string | null;
  quotedCents: number;
  holdExpiresAt: string;
  status: "open" | "fulfilled" | "expired_ignored";
};

export type PaidMove = {
  polarOrderId: string;
  polarCheckoutId: string;
  weekId: string;
  identityKey: string;
  amountCents: number;
  paidAt: string;
  refunded: boolean;
};

export const HOLD_MS = 30 * 60 * 1000;
export const PRODUCT_NAME = "Weekly #1 shelf listing";
export const PRODUCT_DESCRIPTION =
  "One payment moves a public App Store, Play Store, or website listing to #1 on this week's shelf. The next move costs $1 more. The shelf resets Monday 00:00 UTC. You receive the #1 row, an outbound link, and a screenshot. No clicks, SEO, or installs are guaranteed.";
