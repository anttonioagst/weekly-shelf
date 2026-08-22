import { Fragment } from "react";
import { typeLabel } from "@/lib/identity";
import { timeAgo } from "@/lib/time-ago";
import type { ShelfRow } from "@/lib/types";
import { TypeGlyph } from "./type-glyph";

const BANDS = [
  { after: 3, label: "Top 3" },
  { after: 10, label: "Top 10" },
  { after: 20, label: "Top 20" },
] as const;

export function ShelfBoard({ rows }: { rows: ShelfRow[] }) {
  const [lead, ...rest] = rows;

  return (
    <section className="shelf">
      <div className="shelf-head">
        <h2>This week</h2>
        {rows.length > 0 ? (
          <span className="shelf-count">{rows.length} apps</span>
        ) : null}
      </div>
      {rows.length === 0 ? (
        <p className="empty">
          The shelf is empty. First move is $1.
        </p>
      ) : (
        <div className="shelf-list">
          <FeaturedRow row={lead} />
          {rest.map((row) => (
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
      <TypeGlyph type={row.type} />
      {timeAgo(row.lastPaidAt)} · {typeLabel(row.type)} · ${row.lastAmountCents / 100} move
    </span>
  );
}

function FeaturedRow({ row }: { row: ShelfRow }) {
  return (
    <a className="featured" href={row.url} rel="noreferrer">
      <div className="featured-line">
        <span className="rank">{row.rank}</span>
        {row.iconUrl ? (
          <img
            className="featured-icon"
            src={row.iconUrl}
            alt=""
            width={64}
            height={64}
          />
        ) : (
          <span className="featured-icon icon-well" aria-hidden="true" />
        )}
        <span className="featured-text">
          <strong>{row.name}</strong>
          {row.blurb ? <span className="blurb">{row.blurb}</span> : null}
          <RowMeta row={row} />
        </span>
        <span className="meta open">Open</span>
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
      {row.iconUrl ? (
        <img src={row.iconUrl} alt="" width={44} height={44} />
      ) : (
        <span className="row-icon icon-well" aria-hidden="true" />
      )}
      <span className="row-text">
        <strong>{row.name}</strong>
        {row.blurb ? <span className="blurb">{row.blurb}</span> : null}
        <RowMeta row={row} />
      </span>
      <span className="meta open">Open</span>
    </a>
  );
}
