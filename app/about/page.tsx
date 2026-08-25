import type { Metadata } from "next";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  ImageIcon,
  ProhibitIcon,
  RankingIcon,
  StorefrontIcon,
  TimerIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { Icon } from "@phosphor-icons/react";

export const metadata: Metadata = {
  title: "About — Weekly shelf",
};

const CARDS: { Icon: Icon; text: string }[] = [
  {
    Icon: RankingIcon,
    text: "Pay the current price. Take #1 this week.",
  },
  {
    Icon: TimerIcon,
    text: "The next move costs $1 more. Monday 00:00 UTC the shelf is empty. You are not buying clicks, SEO, or installs.",
  },
  {
    Icon: ImageIcon,
    text: "The #1 row, a link out, and a screenshot. That is the whole purchase.",
  },
  {
    Icon: StorefrontIcon,
    text: "Catalog: a live App Store app, Play Store app, or public website. TestFlight-only builds and chat invites are out.",
  },
  {
    Icon: CreditCardIcon,
    text: "Stripe is the merchant. Polar does not accept Brazilian businesses.",
  },
  {
    Icon: ProhibitIcon,
    text: "Checkout by Stripe. No traffic guaranteed.",
  },
];

export default function AboutPage() {
  return (
    <article className="doc-page">
      <h1>About</h1>
      <p className="lede">
        How the shelf works. Nothing here is a traffic promise.
      </p>
      <div className="rules-grid">
        {CARDS.map((card) => (
          <div className="rule-card" key={card.text}>
            <card.Icon className="card-icon" size={28} weight="duotone" aria-hidden />
            {card.text}
          </div>
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
