import type { Metadata } from "next";
import {
  ArrowLeftIcon,
  CalendarBlankIcon,
  CreditCardIcon,
  HourglassIcon,
  ImageIcon,
  QuestionIcon,
  RankingIcon,
  StorefrontIcon,
  TrayIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { Icon } from "@phosphor-icons/react";

export const metadata: Metadata = {
  title: "Rules — Weekly shelf",
};

const RULES: { Icon: Icon; text: string }[] = [
  {
    Icon: CalendarBlankIcon,
    text: "The week starts Monday 00:00 UTC. The first move is $1. Every completed payment adds $1 to the next price.",
  },
  {
    Icon: HourglassIcon,
    text: "Checkout holds the price you see for 30 minutes. A payment that confirms after that window does not move the shelf.",
  },
  {
    Icon: RankingIcon,
    text: "The latest completed payment takes #1. Same App Store id, Play Store id, or normalized URL is the same listing. Pay again to move it back to the top.",
  },
  {
    Icon: TrayIcon,
    text: "Monday 00:00 UTC the shelf is empty and the price is $1. There is no history on the home page.",
  },
  {
    Icon: ImageIcon,
    text: "#1 gets the top row, an outbound link, and a screenshot. You are not buying clicks, SEO, installs, or traffic. None of that is guaranteed.",
  },
  {
    Icon: StorefrontIcon,
    text: "Catalog: a live App Store app, Play Store app, or public website. TestFlight-only builds and chat invites are out.",
  },
];

const FAQS: { Icon: Icon; title: string; body: string }[] = [
  {
    Icon: QuestionIcon,
    title: "What do I get?",
    body: "The #1 row, a link out, and a screenshot. That is the whole purchase.",
  },
  {
    Icon: RankingIcon,
    title: "Can someone take my spot?",
    body: "Yes. They pay $1 more. Latest completed payment is #1.",
  },
  {
    Icon: HourglassIcon,
    title: "What if two people pay the same held price?",
    body: "Both payments count. Latest confirmation is #1. The next new price jumps by $2.",
  },
  {
    Icon: TrayIcon,
    title: "Do refunds drop the price?",
    body: "No. The move comes off the shelf. The price never goes backwards.",
  },
  {
    Icon: CreditCardIcon,
    title: "Why Stripe?",
    body: "Polar does not accept Brazilian businesses. Stripe is the merchant. Checkout is one payment for the quoted price.",
  },
];

export default function RulesPage() {
  return (
    <article className="rules-page">
      <h1>Rules</h1>
      <p className="lede">
        How the shelf works. Nothing here is a traffic promise.
      </p>
      <ol className="doc-panel">
        {RULES.map((row, index) => (
          <li className="doc-row" key={row.text}>
            <span className="doc-index">{String(index + 1).padStart(2, "0")}</span>
            <row.Icon size={18} weight="bold" aria-hidden />
            <span>{row.text}</span>
          </li>
        ))}
      </ol>
      <h2 className="doc-sub">FAQ</h2>
      <div className="doc-panel">
        {FAQS.map((row) => (
          <div className="doc-row faq-row" key={row.title}>
            <row.Icon size={18} weight="bold" aria-hidden />
            <div>
              <h3>{row.title}</h3>
              <p>{row.body}</p>
            </div>
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
