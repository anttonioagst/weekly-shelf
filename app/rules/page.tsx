import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rules — Weekly shelf",
};

export default function RulesPage() {
  return (
    <article className="rules-page">
      <h1>Rules</h1>
      <p className="lede">
        How the shelf works. Nothing here is a traffic promise.
      </p>
      <div className="rules-grid">
        <div className="rule-card">
          The week starts Monday 00:00 UTC. The first move is $1. Every
          completed payment adds $1 to the next price.
        </div>
        <div className="rule-card">
          Checkout holds the price you see for 30 minutes. A payment that
          confirms after that window does not move the shelf.
        </div>
        <div className="rule-card">
          The latest completed payment takes #1. Same App Store id, Play Store
          id, or normalized URL is the same listing. Pay again to move it back
          to the top.
        </div>
        <div className="rule-card">
          Monday 00:00 UTC the shelf is empty and the price is $1. There is no
          history on the home page.
        </div>
        <div className="rule-card">
          #1 gets the top row, an outbound link, and a screenshot. You are not
          buying clicks, SEO, installs, or traffic. None of that is guaranteed.
        </div>
        <div className="rule-card">
          Catalog: a live App Store app, Play Store app, or public website.
          TestFlight-only builds and chat invites are out.
        </div>
        <div className="faq-card">
          <h3>What do I get?</h3>
          <p>
            The #1 row, a link out, and a screenshot. That is the whole
            purchase.
          </p>
        </div>
        <div className="faq-card">
          <h3>Can someone take my spot?</h3>
          <p>
            Yes. They pay $1 more. Latest completed payment is #1.
          </p>
        </div>
        <div className="faq-card">
          <h3>What if two people pay the same held price?</h3>
          <p>
            Both payments count. Latest confirmation is #1. The next new price
            jumps by $2.
          </p>
        </div>
        <div className="faq-card">
          <h3>Do refunds drop the price?</h3>
          <p>
            No. The move comes off the shelf. The price never goes backwards.
          </p>
        </div>
        <div className="faq-card">
          <h3>Why Polar?</h3>
          <p>
            Polar is the merchant. If they refuse this product, the shelf stops.
            We will not add another payer.
          </p>
        </div>
      </div>
      <p className="back-home">
        <Link href="/">Back home</Link>
      </p>
    </article>
  );
}
