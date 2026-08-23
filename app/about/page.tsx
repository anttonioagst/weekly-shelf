import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Weekly shelf",
};

export default function AboutPage() {
  return (
    <article className="doc-page">
      <h1>About</h1>
      <p className="lede">
        How the shelf works. Nothing here is a traffic promise.
      </p>
      <div className="rules-grid">
        <div className="rule-card">
          Pay the current price. Take #1 this week.
        </div>
        <div className="rule-card">
          The next move costs $1 more. Monday 00:00 UTC the shelf is empty. You
          are not buying clicks, SEO, or installs.
        </div>
        <div className="rule-card">
          The #1 row, a link out, and a screenshot. That is the whole
          purchase.
        </div>
        <div className="rule-card">
          Catalog: a live App Store app, Play Store app, or public website.
          TestFlight-only builds and chat invites are out.
        </div>
        <div className="rule-card">
          Polar is the merchant. If they refuse this product, the shelf stops.
          We will not add another payer.
        </div>
        <div className="rule-card">
          Checkout by Polar. No traffic guaranteed.
        </div>
      </div>
      <p className="back-home">
        <Link href="/">Back home</Link>
      </p>
    </article>
  );
}
