import { ArrowFatLineUpIcon, CurrencyDollarIcon, TrayIcon } from "@phosphor-icons/react/ssr";
import { Suspense } from "react";
import { currentWeekSnapshot } from "@/lib/shelf";
import { BrandMark } from "./brand-mark";
import { ClaimForm } from "./claim-form";
import { Countdown } from "./countdown";
import { PaidReturn } from "./paid-return";
import { ShelfBoard } from "./shelf-board";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const snap = currentWeekSnapshot();
  const empty = snap.rows.length === 0;
  const nextDollars = snap.priceDollars + 1;

  return (
    <>
      <section className="intro">
        <p className="intro-kicker">
          A weekly shelf for
          <span className="intro-marks" aria-label="App Store, Play Store, and websites">
            <BrandMark type="ios" size={16} tone="color" />
            <BrandMark type="android" size={16} tone="color" />
            <BrandMark type="site" size={16} tone="color" />
          </span>
        </p>
        <h1>Get in early. Stay on top.</h1>
        <p className="lede">
          Join when the price feels right. Your payment puts the listing at
          the top, then the next move costs $1 more.
        </p>
      </section>

      <section className="composer">
        <div className="composer-price">
          <p className="kicker with-icon">
            <CurrencyDollarIcon size={14} weight="bold" aria-hidden />
            Current price
          </p>
          <div className="composer-price-row">
            <p className="price">${snap.priceDollars}</p>
            <p className="meta">one payment</p>
          </div>
          <p className="composer-blurb">
            Your listing goes straight to number one. The next move becomes ${nextDollars}.
          </p>
        </div>
        <ClaimForm priceDollars={snap.priceDollars} />
        <Countdown nextMondayIso={snap.nextMondayIso} />
      </section>

      <div className="composer-helpers">
        {empty ? (
          <p className="meta with-icon">
            <TrayIcon size={14} weight="bold" aria-hidden />
            The shelf is empty. First move is $1.
          </p>
        ) : null}
        <p className="meta with-icon">
          <ArrowFatLineUpIcon size={14} weight="bold" aria-hidden />
          Pay again to move it back to the top.
        </p>
      </div>

      <Suspense>
        <PaidReturn />
      </Suspense>

      <ShelfBoard rows={snap.rows} activity={snap.activity} />
    </>
  );
}
