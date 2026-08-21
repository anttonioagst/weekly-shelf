import { parseInput } from "./identity";
import type { ListingPreview } from "./types";

const FETCH_MS = 6000;

function meta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decode(match[1]);
  }
  return null;
}

function decode(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function titleTag(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim() ? decode(match[1].trim()) : null;
}

function iconFromHtml(html: string, pageUrl: string): string | null {
  const match = html.match(
    /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']/i,
  );
  if (!match?.[1]) return null;
  try {
    return new URL(match[1], pageUrl).toString();
  } catch {
    return null;
  }
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_MS),
    headers: {
      "user-agent":
        "WeeklyShelf/0.1 (preview; +https://github.com/anttonioagst/weekly-shelf)",
    },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`Could not load ${url}`);
  }
  return response.text();
}

async function previewIos(id: string, url: string): Promise<ListingPreview> {
  const response = await fetch(
    `https://itunes.apple.com/lookup?id=${id}&country=us`,
    { signal: AbortSignal.timeout(FETCH_MS) },
  );
  const data = (await response.json()) as {
    results?: Array<{
      trackName?: string;
      artworkUrl100?: string;
      artworkUrl512?: string;
      screenshotUrls?: string[];
    }>;
  };
  const app = data.results?.[0];
  if (!app?.trackName) {
    throw new Error("Need a live App Store app URL.");
  }
  return {
    type: "ios",
    identityKey: `ios:${id}`,
    url,
    name: app.trackName,
    iconUrl: app.artworkUrl100 ?? app.artworkUrl512 ?? null,
    screenshotUrl: app.screenshotUrls?.[0] ?? app.artworkUrl512 ?? null,
  };
}

async function previewHtml(
  parsed: ReturnType<typeof parseInput>,
): Promise<ListingPreview> {
  const html = await fetchText(parsed.url);
  const name =
    meta(html, "og:title") ??
    meta(html, "twitter:title") ??
    titleTag(html) ??
    new URL(parsed.url).hostname;
  const screenshot =
    meta(html, "og:image") ?? meta(html, "twitter:image") ?? null;
  const icon =
    iconFromHtml(html, parsed.url) ??
    `https://www.google.com/s2/favicons?sz=128&domain=${new URL(parsed.url).hostname}`;
  return {
    ...parsed,
    name,
    iconUrl: icon,
    screenshotUrl: screenshot,
  };
}

export async function previewListing(raw: string): Promise<ListingPreview> {
  const parsed = parseInput(raw);
  if (parsed.type === "ios") {
    const id = parsed.identityKey.slice("ios:".length);
    return previewIos(id, parsed.url);
  }
  try {
    return await previewHtml(parsed);
  } catch {
    const host = new URL(parsed.url).hostname;
    return {
      ...parsed,
      name: host,
      iconUrl: `https://www.google.com/s2/favicons?sz=128&domain=${host}`,
      screenshotUrl: null,
    };
  }
}
