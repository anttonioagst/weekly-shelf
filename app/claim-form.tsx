"use client";

import { useEffect, useState } from "react";
import type { ListingPreview, ListingType } from "@/lib/types";

const URL_ERROR = "Use a live App Store, Play Store, or website URL.";
const CHECKOUT_ERROR = "Checkout is not open yet.";
const POLAR_ERROR =
  "Polar refused this listing. We will not switch providers.";

function previewTypeLabel(type: ListingType): string {
  if (type === "ios") return "iOS";
  if (type === "android") return "Android";
  return "Site";
}

function mapCheckoutError(status: number, data: { error?: string; polar?: string }): string {
  if (status === 503 || data.polar) return POLAR_ERROR;
  if (status === 502 || status >= 500) return CHECKOUT_ERROR;
  return CHECKOUT_ERROR;
}

export function ClaimForm({ priceDollars }: { priceDollars: number }) {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<ListingPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const trimmed = url.trim();
    if (trimmed.length < 8) {
      setPreview(null);
      return;
    }
    const handle = setTimeout(async () => {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPreview(null);
        setError(URL_ERROR);
        return;
      }
      setError(null);
      setPreview(data);
    }, 400);
    return () => clearTimeout(handle);
  }, [url]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(mapCheckoutError(response.status, data));
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError(CHECKOUT_ERROR);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="claim-form" onSubmit={onSubmit}>
      <label htmlFor="listing-url" className="sr-only">
        App Store, Play Store, or site URL
      </label>
      <div className="claim-row">
        <input
          id="listing-url"
          type="url"
          required
          placeholder="https://"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button type="submit" disabled={busy || !preview}>
          Take #1 for ${priceDollars}
        </button>
      </div>
      {preview ? (
        <div className="preview">
          {preview.iconUrl ? (
            <img src={preview.iconUrl} alt="" width={48} height={48} />
          ) : null}
          <div className="meta">
            {preview.name} · {previewTypeLabel(preview.type)}
          </div>
        </div>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}
