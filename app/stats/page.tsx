import type { Metadata } from "next";
import {
  AppWindowIcon,
  ArrowFatLineUpIcon,
  ArrowLeftIcon,
  ClockCountdownIcon,
  CurrencyDollarIcon,
  EyeIcon,
  UsersThreeIcon,
  WalletIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { Icon } from "@phosphor-icons/react";
import { currentWeekSnapshot } from "@/lib/shelf";
import { visitSnapshot } from "@/lib/visits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stats — Weekly shelf",
};

export default function StatsPage() {
  const week = currentWeekSnapshot();
  const visits = visitSnapshot();
  const weekPaid = Object.values(week.board.moves)
    .filter((move) => !move.refunded)
    .reduce((sum, move) => sum + move.amountCents, 0);

  const rows: { Icon: Icon; label: string; value: string }[] = [
    { Icon: UsersThreeIcon, label: "online", value: visits.online.toLocaleString("en-US") },
    {
      Icon: ClockCountdownIcon,
      label: "visitors in the last 12h",
      value: visits.last12h.toLocaleString("en-US"),
    },
    {
      Icon: EyeIcon,
      label: "recorded visitors",
      value: visits.recorded.toLocaleString("en-US"),
    },
    { Icon: AppWindowIcon, label: "apps this week", value: String(week.rows.length) },
    { Icon: ArrowFatLineUpIcon, label: "moves this week", value: String(week.moveCount) },
    { Icon: CurrencyDollarIcon, label: "Current price", value: `$${week.priceDollars}` },
    { Icon: WalletIcon, label: "paid this week", value: `$${weekPaid / 100}` },
  ];

  return (
    <article className="doc-page">
      <h1>Stats</h1>
      <p className="lede">
        How the shelf works. Nothing here is a traffic promise.
      </p>
      <div className="doc-panel">
        {rows.map((row) => (
          <div className="stat-row" key={row.label}>
            <span className="with-icon">
              <row.Icon size={16} weight="bold" aria-hidden />
              {row.label}
            </span>
            <strong className="stat-value">{row.value}</strong>
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
