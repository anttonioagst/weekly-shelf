import { Suspense } from "react";
import { currentWeekSnapshot } from "@/lib/shelf";
import { ClaimForm } from "./claim-form";
import { Countdown } from "./countdown";
import { PaidReturn } from "./paid-return";
import { ShelfBoard } from "./shelf-board";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const snap = currentWeekSnapshot();

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
        <ClaimForm priceDollars={snap.priceDollars} />
      </section>

      <div className="composer-meta">
        <p className="kicker">Current price</p>
        <p className="price">${snap.priceDollars}</p>
        <p className="meta">one payment · ${snap.priceDollars} = $1 + {snap.moveCount} moves</p>
        <Countdown nextMondayIso={snap.nextMondayIso} />
      </div>

      <Suspense>
        <PaidReturn />
      </Suspense>

      <ShelfBoard rows={snap.rows} />
    </>
  );
}
