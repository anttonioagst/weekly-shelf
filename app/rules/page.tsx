import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rules — Weekly shelf",
};

export default function RulesPage() {
  return (
    <article className="rules">
      <h1>Rules</h1>
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
    </article>
  );
}
