import { PulseIcon } from "@phosphor-icons/react/ssr";
import { timeAgo } from "@/lib/time-ago";
import type { ActivityItem } from "@/lib/types";
import { ListingIcon } from "./listing-icon";

export function ActivityRail({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="activity">
      <p className="activity-head">
        <PulseIcon size={15} weight="fill" aria-hidden />
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
            <ListingIcon className="row-icon" src={item.iconUrl} size={32} />
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
