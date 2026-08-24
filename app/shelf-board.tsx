"use client";

import { Fragment, useState } from "react";
import {
  ArrowSquareOutIcon,
  PulseIcon,
  SquaresFourIcon,
  TrayIcon,
} from "@phosphor-icons/react/ssr";
import { timeAgo } from "@/lib/time-ago";
import type { ActivityItem, ListingType, ShelfRow } from "@/lib/types";
import { ActivityRail } from "./activity-rail";
import { BrandMark } from "./brand-mark";
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
          <h2>This week</h2>
        </div>
        {rows.length > 0 ? (
          <span className="shelf-count">{visible.length} apps</span>
        ) : null}
      </div>

      {rows.length > 0 ? (
        <div className="tag-bar" role="tablist" aria-label="Catalog">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={filter === item.id ? "tag-pill on" : "tag-pill"}
              onClick={() => setFilter(item.id)}
            >
              {item.id === "all" ? (
                <SquaresFourIcon size={15} weight="bold" aria-hidden />
              ) : (
                <BrandMark type={item.id} size={15} tone="color" />
              )}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="empty">
          <TrayIcon size={40} weight="duotone" aria-hidden />
          <p>The shelf is empty. First move is $1.</p>
        </div>
      ) : (
        <div className="shelf-list">
          {lead ? <FeaturedRow row={lead} /> : null}
          {mids.map((row) => (
            <MidRow key={row.identityKey} row={row} />
          ))}
          <ActivityRail items={activity} />
          {compact.map((row) => (
            <Fragment key={row.identityKey}>
              <BandMark rank={row.rank} total={rows.length} />
              <CompactRow row={row} />
            </Fragment>
          ))}
        </div>
      )}
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
      Open
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

function MidRow({ row }: { row: ShelfRow }) {
  return (
    <a className="mid" href={row.url} rel="noreferrer">
      <span className="rank">{row.rank}</span>
      <ListingIcon className="mid-icon" src={row.iconUrl} size={52} />
      <span className="mid-text">
        <strong>{row.name}</strong>
        {row.blurb ? <span className="blurb">{row.blurb}</span> : null}
        <RowMeta row={row} />
      </span>
      <span className="mid-amount">${row.lastAmountCents / 100}</span>
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
