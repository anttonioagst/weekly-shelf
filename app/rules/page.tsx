import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rules — Weekly shelf",
};

export default function RulesPage() {
  return (
    <article className="rules">
      <h1>Rules</h1>
      <p className="lede">
        How the shelf works. Nothing here is a traffic promise.
      </p>
      <ol>
        <li>
          The week starts Monday 00:00 UTC. The first move is $1. Every
          completed payment adds $1 to the next price.
        </li>
        <li>
          Checkout holds the price you see for 30 minutes. A payment that
          confirms after that window does not move the shelf.
        </li>
        <li>
          The latest completed payment takes #1. Same App Store id, Play Store
          id, or normalized URL is the same listing. Pay again to move it back
          to the top.
        </li>
        <li>
          Monday 00:00 UTC the shelf is empty and the price is $1. There is no
          history on the home page.
        </li>
        <li>
          #1 gets the top row, an outbound link, and a screenshot. You are not
          buying clicks, SEO, installs, or traffic. None of that is guaranteed.
        </li>
        <li>
          Catalog: a live App Store app, Play Store app, or public website.
          TestFlight-only builds and chat invites are out.
        </li>
      </ol>
      <section className="faq">
        <h2>FAQ</h2>
        <dl>
          <dt>What do I get?</dt>
          <dd>
            The #1 row, a link out, and a screenshot. That is the whole
            purchase.
          </dd>
          <dt>Can someone take my spot?</dt>
          <dd>
            Yes. They pay $1 more. Latest completed payment is #1.
          </dd>
          <dt>What if two people pay the same held price?</dt>
          <dd>
            Both payments count. Latest confirmation is #1. The next new price
            jumps by $2.
          </dd>
          <dt>Do refunds drop the price?</dt>
          <dd>
            No. The move comes off the shelf. The price never goes backwards.
          </dd>
          <dt>Why Polar?</dt>
          <dd>
            Polar is the merchant. If they refuse this product, the shelf stops.
            We will not add another payer.
          </dd>
        </dl>
      </section>
      <p>
        <Link href="/">Back home</Link>
      </p>
    </article>
  );
}
