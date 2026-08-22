import { headers } from "next/headers";
import { touchVisit } from "@/lib/visits";

export async function VisitorCount() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local";
  const count = touchVisit(ip, h.get("user-agent") ?? "");

  return (
    <p className="visitors">
      <span className="visitors-dot" aria-hidden="true" />
      <strong>{count.toLocaleString("en-US")}</strong>
      <span> visitors in the last 12h</span>
    </p>
  );
}
