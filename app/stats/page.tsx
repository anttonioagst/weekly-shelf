import type { Metadata } from "next";
import Link from "next/link";
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

  return (
    <article className="doc-page">
      <h1>Stats</h1>
      <p className="lede">
        How the shelf works. Nothing here is a traffic promise.
      </p>
      <div className="stats-grid">
        <Stat label="online" value={visits.online.toLocaleString("en-US")} />
        <Stat
          label="visitors in the last 12h"
          value={visits.last12h.toLocaleString("en-US")}
        />
        <Stat
          label="recorded visitors"
          value={visits.recorded.toLocaleString("en-US")}
        />
        <Stat label="apps this week" value={String(week.rows.length)} />
        <Stat label="moves this week" value={String(week.moveCount)} />
        <Stat label="Current price" value={`$${week.priceDollars}`} />
        <Stat label="paid this week" value={`$${weekPaid / 100}`} />
      </div>
      <p className="back-home">
        <Link href="/">Back home</Link>
      </p>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <p className="stat-value">{value}</p>
      <p className="meta">{label}</p>
    </div>
  );
}
