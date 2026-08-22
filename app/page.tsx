import { Suspense } from "react";
import { currentWeekSnapshot } from "@/lib/shelf";
import { ClaimForm } from "./claim-form";
import { Countdown } from "./countdown";
import { PaidReturn } from "./paid-return";
import { ShelfBoard } from "./shelf-board";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const snap = currentWeekSnapshot();
  const empty = snap.rows.length === 0;

  return (
    <>
      <section className="intro">
        <h1>Pay the current price. Take #1 this week.</h1>
        <p className="lede">
          The next move costs $1 more. Monday 00:00 UTC the shelf is empty. You
          are not buying clicks, SEO, or installs.
        </p>
      </section>

      <section className="composer">
        <div className="composer-price">
          <p className="kicker">Current price</p>
          <div className="composer-price-row">
            <p className="price">${snap.priceDollars}</p>
            <p className="meta">one payment · ${snap.priceDollars} = $1 + {snap.moveCount} moves</p>
          </div>
        </div>
        <ClaimForm priceDollars={snap.priceDollars} />
        <Countdown nextMondayIso={snap.nextMondayIso} />
      </section>

      <div className="composer-helpers">
        {empty ? (
          <p className="meta">The shelf is empty. First move is $1.</p>
        ) : null}
        <p className="meta">Pay again to move it back to the top.</p>
      </div>

      <Suspense>
        <PaidReturn />
      </Suspense>

      <ShelfBoard rows={snap.rows} activity={snap.activity} />
    </>
  );
}
