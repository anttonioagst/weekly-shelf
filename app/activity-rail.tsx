import { timeAgo } from "@/lib/time-ago";
import type { ActivityItem } from "@/lib/types";

export function ActivityRail({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="activity">
      <p className="activity-head">
        <span className="visitors-dot" aria-hidden="true" />
        Latest activity
      </p>
      <div className="activity-rail">
        {items.map((item) => (
          <a
            key={`${item.identityKey}:${item.paidAt}`}
            className="activity-card"
            href={item.url}
            rel="noreferrer"
          >
            {item.iconUrl ? (
              <img src={item.iconUrl} alt="" width={32} height={32} />
            ) : (
              <span className="row-icon icon-well" aria-hidden="true" />
            )}
            <span className="activity-copy">
              <strong>{item.name}</strong>
              <span className="meta">
                at #{item.rank} · ${item.amountCents / 100}
              </span>
              <span className="meta">{timeAgo(item.paidAt)}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
