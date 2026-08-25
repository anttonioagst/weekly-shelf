"use client";

import { useState } from "react";
import {
  ArrowSquareOutIcon,
  PulseIcon,
  SquaresFourIcon,
  TrayIcon,
} from "@phosphor-icons/react/ssr";
import { timeAgo } from "@/lib/time-ago";
import type { ActivityItem, ListingType, ShelfRow } from "@/lib/types";
import { ActivityRail } from "./activity-rail";
import { ListingIcon } from "./listing-icon";
import { TypeTag } from "./type-tag";

const BANDS = [
  { after: 3, label: "Top 3" },
  { after: 10, label: "Top 10" },
  { after: 20, label: "Top 20" },
] as const;

type Filter = "all" | ListingType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ios", label: "App Store" },
  { id: "android", label: "Play Store" },
  { id: "site", label: "Site" },
];

export function ShelfBoard({
  rows,
  activity,
}: {
  rows: ShelfRow[];
  activity: ActivityItem[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? rows : rows.filter((row) => row.type === filter);
  const featured = visible.filter((row) => row.rank <= 3);
  const compact = visible.filter((row) => row.rank > 3);
  const lead = featured.find((row) => row.rank === 1);
  const mids = featured.filter((row) => row.rank > 1);

  return (
    <section className="shelf">
      <div className="shelf-head">
        <div className="shelf-titles">
          <p className="shelf-kicker with-icon">
            <PulseIcon size={13} weight="bold" aria-hidden />
            Live shelf
          </p>
          <h2>Latest paid move wins</h2>
        </div>
        <div className="shelf-tools">
          {rows.length > 0 ? (
            <span className="shelf-count">{visible.length} apps</span>
          ) : null}
          {rows.length > 0 ? (
            <label className="shelf-filter">
              <span className="sr-only">Catalog</span>
              <SquaresFourIcon size={14} weight="bold" aria-hidden />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as Filter)}
              >
                {FILTERS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="empty">
          <TrayIcon size={40} weight="duotone" aria-hidden />
          <p>The shelf is empty. First move is $1.</p>
        </div>
      ) : (
        <ol className="shelf-list">
          {lead ? (
            <li>
              <FeaturedRow row={lead} />
            </li>
          ) : null}
          {mids.map((row) => (
            <li key={row.identityKey}>
              <CompactRow row={row} />
            </li>
          ))}
          {compact.map((row) => (
            <li key={row.identityKey}>
              <BandMark rank={row.rank} total={rows.length} />
              <CompactRow row={row} />
            </li>
          ))}
        </ol>
      )}
      {rows.length > 0 ? <ActivityRail items={activity} /> : null}
    </section>
  );
}

function BandMark({ rank, total }: { rank: number; total: number }) {
  const band = BANDS.find((item) => rank === item.after + 1 && total > item.after);
  if (!band) return null;
  return <p className="band-mark">{band.label}</p>;
}

function RowMeta({ row }: { row: ShelfRow }) {
  return (
    <span className="meta row-meta">
      {timeAgo(row.lastPaidAt)}
      <TypeTag type={row.type} />
      ${row.lastAmountCents / 100} move
    </span>
  );
}

function OpenMark() {
  return (
    <span className="meta open">
      <span className="open-label">Open</span>
      <ArrowSquareOutIcon size={14} weight="bold" aria-hidden />
    </span>
  );
}

function FeaturedRow({ row }: { row: ShelfRow }) {
  return (
    <a className="featured" href={row.url} rel="noreferrer">
      <div className="featured-line">
        <span className="rank">{row.rank}</span>
        <ListingIcon className="featured-icon" src={row.iconUrl} size={64} />
        <span className="featured-text">
          <strong>{row.name}</strong>
          {row.blurb ? <span className="blurb">{row.blurb}</span> : null}
          <RowMeta row={row} />
        </span>
        <OpenMark />
      </div>
      {row.screenshotUrl ? (
        <img className="featured-shot" src={row.screenshotUrl} alt="" />
      ) : null}
    </a>
  );
}

function CompactRow({ row }: { row: ShelfRow }) {
  return (
    <a className="row" href={row.url} rel="noreferrer">
      <span className="rank">{row.rank}</span>
      <ListingIcon className="row-icon" src={row.iconUrl} size={44} />
      <span className="row-text">
        <strong>{row.name}</strong>
        {row.blurb ? <span className="blurb">{row.blurb}</span> : null}
        <RowMeta row={row} />
      </span>
      <OpenMark />
    </a>
  );
}
