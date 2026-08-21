import type { ListingType, ParsedInput } from "./types";

const INVITE_HOSTS = [
  "t.me",
  "telegram.me",
  "telegram.dog",
  "discord.gg",
  "discord.com",
  "discordapp.com",
  "chat.whatsapp.com",
  "wa.me",
  "api.whatsapp.com",
  "slack.com",
  "signal.group",
  "signal.me",
  "m.me",
  "messenger.com",
];

const BLOCKED_HOST_HINTS = [
  "pornhub",
  "xvideos",
  "xnxx",
  "onlyfans",
  "chaturbate",
  "stripchat",
  "bet365",
  "stake.com",
  "roobet",
  "crashino",
  "gambling",
];

export class InputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputError";
  }
}

function asUrl(raw: string): URL {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new InputError("Need a live App Store, Play Store, or website URL.");
  }
  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    throw new InputError("Need a live App Store, Play Store, or website URL.");
  }
}

function hostOf(url: URL): string {
  return url.hostname.replace(/^www\./, "").toLowerCase();
}

function isInvite(url: URL): boolean {
  const host = hostOf(url);
  return INVITE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

function isBlocked(url: URL): boolean {
  const host = hostOf(url);
  return BLOCKED_HOST_HINTS.some((hint) => host.includes(hint));
}

function appleAppId(url: URL): string | null {
  const idMatch = url.pathname.match(/\/id(\d+)/);
  if (idMatch) return idMatch[1];
  const queryId = url.searchParams.get("id");
  if (queryId && /^\d+$/.test(queryId)) return queryId;
  return null;
}

function playPackage(url: URL): string | null {
  const id = url.searchParams.get("id");
  if (id && /^[A-Za-z0-9._]+$/.test(id)) return id;
  return null;
}

export function normalizeSiteUrl(url: URL): string {
  const host = hostOf(url);
  let path = url.pathname;
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  if (path === "/") path = "";
  return `https://${host}${path}`;
}

export function parseInput(raw: string): ParsedInput {
  const url = asUrl(raw);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new InputError("Need a live App Store, Play Store, or website URL.");
  }

  const host = hostOf(url);

  if (host === "testflight.apple.com") {
    throw new InputError("TestFlight-only links are out.");
  }
  if (isInvite(url)) {
    throw new InputError("Chat and invite links are out.");
  }
  if (isBlocked(url)) {
    throw new InputError("That listing is not allowed.");
  }

  if (host === "apps.apple.com" || host === "itunes.apple.com") {
    const id = appleAppId(url);
    if (!id) {
      throw new InputError("Need a live App Store app URL.");
    }
    return {
      type: "ios",
      identityKey: `ios:${id}`,
      url: `https://apps.apple.com/app/id${id}`,
    };
  }

  if (host === "play.google.com") {
    const pkg = playPackage(url);
    if (!pkg) {
      throw new InputError("Need a live Play Store app URL.");
    }
    return {
      type: "android",
      identityKey: `android:${pkg}`,
      url: `https://play.google.com/store/apps/details?id=${pkg}`,
    };
  }

  return {
    type: "site",
    identityKey: `web:${normalizeSiteUrl(url)}`,
    url: normalizeSiteUrl(url),
  };
}

export function typeLabel(type: ListingType): string {
  if (type === "ios") return "App Store";
  if (type === "android") return "Play Store";
  return "Site";
}
