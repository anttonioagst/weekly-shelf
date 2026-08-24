import { ClockCountdownIcon, UsersThreeIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { headers } from "next/headers";
import { touchVisit } from "@/lib/visits";

export async function VisitorCount() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local";
  const snap = touchVisit(ip, h.get("user-agent") ?? "");

  return (
    <p className="visitors">
      <span className="visitors-dot" aria-hidden="true" />
      <UsersThreeIcon size={14} weight="bold" aria-hidden />
      <strong>{snap.online.toLocaleString("en-US")}</strong>
      <span> online</span>
      <span className="visitors-sep">·</span>
      <Link href="/stats">
        <ClockCountdownIcon size={14} weight="bold" aria-hidden />
        <strong>{snap.last12h.toLocaleString("en-US")}</strong>
        <span> visitors in the last 12h</span>
      </Link>
    </p>
  );
}
