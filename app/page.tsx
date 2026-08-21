import { Suspense } from "react";
import { typeLabel } from "@/lib/identity";
import { currentWeekSnapshot } from "@/lib/shelf";
import { ClaimForm } from "./claim-form";
import { Countdown } from "./countdown";
import { PaidReturn } from "./paid-return";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const snap = currentWeekSnapshot();
  const lead = snap.rows[0];

  return (
    <>
      <section className="hero">
        <h1>Pay the current price. Take #1 this week.</h1>
        <p className="lede">
          The next move costs $1 more. Monday 00:00 UTC the shelf is empty. You
          are not buying clicks, SEO, or installs.
        </p>
      </section>

      <section className="price-box">
        <p className="kicker">Current price</p>
        <p className="price">${snap.priceDollars}</p>
        <p className="meta">one payment · ${snap.priceDollars} = $1 + {snap.moveCount} moves</p>
        <Countdown nextMondayIso={snap.nextMondayIso} />
        <ClaimForm priceDollars={snap.priceDollars} />
      </section>

      <Suspense>
        <PaidReturn />
      </Suspense>

      <section className="shelf">
        <div className="shelf-head">
          <h2>This week</h2>
          {snap.rows.length > 0 ? (
            <span className="shelf-count">{snap.rows.length} apps</span>
          ) : null}
        </div>
        {lead?.screenshotUrl ? (
          <div className="lead-shot">
            <img src={lead.screenshotUrl} alt="" />
          </div>
        ) : null}
        {snap.rows.length === 0 ? (
          <p className="empty">
            The shelf is empty. First move is $1.
          </p>
        ) : (
          snap.rows.map((row) => (
            <a
              key={row.identityKey}
              className={row.rank === 1 ? "row row-lead" : "row"}
              href={row.url}
              rel="noreferrer"
            >
              <span className="rank">{row.rank}</span>
              {row.iconUrl ? (
                <img src={row.iconUrl} alt="" width={58} height={58} />
              ) : (
                <span />
              )}
              <span>
                <strong>{row.name}</strong>
                <div className="meta">
                  {typeLabel(row.type)} · ${row.lastAmountCents / 100} move
                </div>
              </span>
              <span className="meta">Open</span>
            </a>
          ))
        )}
      </section>
    </>
  );
}
