"use client";

import { useEffect, useState } from "react";
import type { ListingPreview } from "@/lib/types";

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
        setError(data.error ?? "Could not read that URL.");
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
        setError(data.error ?? "Checkout failed.");
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Checkout failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-box" onSubmit={onSubmit}>
      <h2>One field</h2>
      <p className="meta">
        App Store, Play Store, or website URL. Polar checkout. Price held 30
        minutes.
      </p>
      <input
        type="url"
        required
        placeholder="https://"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
      />
      {preview ? (
        <div className="preview">
          {preview.iconUrl ? (
            <img src={preview.iconUrl} alt="" width={48} height={48} />
          ) : null}
          <div>
            <strong>{preview.name}</strong>
            <div className="meta">
              {preview.type === "ios"
                ? "App Store"
                : preview.type === "android"
                  ? "Play Store"
                  : "Site"}
            </div>
          </div>
        </div>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={busy || !preview}>
        {busy ? "Opening Polar…" : `Pay $${priceDollars} — go to #1`}
      </button>
    </form>
  );
}
