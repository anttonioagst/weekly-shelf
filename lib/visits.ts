import { createHash } from "node:crypto";
import {
  countOnline,
  countVisitorsAll,
  countVisitsLast12h,
  recordVisit,
} from "./store";

export type VisitSnapshot = {
  online: number;
  last12h: number;
  recorded: number;
};

export function visitorKey(ip: string, userAgent: string): string {
  return createHash("sha256")
    .update(`${ip.trim()}\n${userAgent}`)
    .digest("hex")
    .slice(0, 32);
}

export function touchVisit(
  ip: string,
  userAgent: string,
  now = new Date(),
): VisitSnapshot {
  recordVisit(visitorKey(ip, userAgent), now);
  return visitSnapshot(now);
}

export function visitSnapshot(now = new Date()): VisitSnapshot {
  return {
    online: countOnline(now),
    last12h: countVisitsLast12h(now),
    recorded: countVisitorsAll(),
  };
}
