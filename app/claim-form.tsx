"use client";

import { CrownSimpleIcon, LinkSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";
import type { ListingPreview, ListingType } from "@/lib/types";
import { ListingIcon } from "./listing-icon";
import { TypeGlyph } from "./type-glyph";

const URL_ERROR = "Use a live App Store, Play Store, or website URL.";
const CHECKOUT_ERROR = "Checkout is not open yet.";

function previewTypeLabel(type: ListingType): string {
  if (type === "ios") return "iOS";
  if (type === "android") return "Android";
  return "Site";
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
        setError(CHECKOUT_ERROR);
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
        <div className="claim-field">
          <LinkSimpleIcon className="field-icon" size={16} weight="bold" aria-hidden />
          <input
            id="listing-url"
            type="url"
            required
            placeholder="Paste your App Store, Play Store, or site URL"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={busy || !preview}
          aria-label={`Claim number one for $${priceDollars}`}
        >
          <CrownSimpleIcon size={18} weight="bold" aria-hidden />
          Claim number one
        </button>
      </div>
      {preview ? (
        <div className="preview">
          <ListingIcon src={preview.iconUrl} size={48} />
          <div className="preview-copy">
            <div className="meta">
              <TypeGlyph type={preview.type} />
              {preview.name} · {previewTypeLabel(preview.type)}
            </div>
            {preview.blurb ? <p className="blurb">{preview.blurb}</p> : null}
          </div>
        </div>
      ) : null}
      {error ? (
        <p className="error with-icon">
          <WarningCircleIcon size={16} weight="fill" aria-hidden />
          {error}
        </p>
      ) : null}
    </form>
  );
}
