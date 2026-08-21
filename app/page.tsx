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
      <p className="lede">
        Whoever pays the current price goes to #1 this week. The next move
        costs $1 more. Monday 00:00 UTC empties the shelf. No clicks, SEO, or
        installs are guaranteed.
      </p>

      <section className="price-box">
        <p className="meta">Current price</p>
        <p className="price">${snap.priceDollars}</p>
        <p className="meta">one payment · ${snap.priceDollars} = $1 + {snap.moveCount} moves</p>
        <Countdown nextMondayIso={snap.nextMondayIso} />
      </section>

      <Suspense>
        <PaidReturn />
      </Suspense>

      <ClaimForm priceDollars={snap.priceDollars} />

      <section className="shelf">
        <h2>This week</h2>
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
            <a key={row.identityKey} className="row" href={row.url} rel="noreferrer">
              <span className="rank">{row.rank}</span>
              {row.iconUrl ? (
                <img src={row.iconUrl} alt="" width={56} height={56} />
              ) : (
                <span />
              )}
              <span>
                <strong>{row.name}</strong>
                <div className="meta">
                  {typeLabel(row.type)} · ${row.lastAmountCents / 100} move
                </div>
              </span>
              <span className="meta">open</span>
            </a>
          ))
        )}
      </section>
    </>
  );
}
