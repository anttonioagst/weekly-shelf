import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { typeLabel } from "@/lib/identity";
import { currentWeekSnapshot } from "@/lib/shelf";
import type { ListingType, ShelfRow } from "@/lib/types";
import { BrandMark } from "../brand-mark";
import { TypeTag } from "../type-tag";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories — Weekly shelf",
};

const TYPES: ListingType[] = ["ios", "android", "site"];

export default function CategoriesPage() {
  const snap = currentWeekSnapshot();

  return (
    <article className="doc-page">
      <h1>Categories</h1>
      <p className="lede">
        Catalog: a live App Store app, Play Store app, or public website.
        TestFlight-only builds and chat invites are out.
      </p>
      <div className="doc-panel category-panel">
        {TYPES.map((type) => (
          <CategoryBlock
            key={type}
            type={type}
            rows={snap.rows.filter((row) => row.type === type)}
          />
        ))}
      </div>
      <p className="back-home">
        <Link href="/">
          <ArrowLeftIcon size={16} weight="bold" aria-hidden />
          Back home
        </Link>
      </p>
    </article>
  );
}

function CategoryBlock({
  type,
  rows,
}: {
  type: ListingType;
  rows: ShelfRow[];
}) {
  return (
    <section className="category-block">
      <div className="category-head">
        <BrandMark type={type} size={22} tone="color" />
        <TypeTag type={type} />
        <strong>{typeLabel(type)}</strong>
        <span className="shelf-count">{rows.length} apps</span>
      </div>
      {rows.length === 0 ? (
        <p className="meta">None this week.</p>
      ) : (
        <ul className="category-list">
          {rows.map((row) => (
            <li key={row.identityKey}>
              <a href={row.url} rel="noreferrer">
                <span className="rank">#{row.rank}</span>
                <span>{row.name}</span>
                <span className="meta">${row.lastAmountCents / 100}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
