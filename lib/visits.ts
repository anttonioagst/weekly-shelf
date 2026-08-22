import { createHash } from "node:crypto";
import { countVisitsLast12h, recordVisit } from "./store";

export function visitorKey(ip: string, userAgent: string): string {
  return createHash("sha256")
    .update(`${ip.trim()}\n${userAgent}`)
    .digest("hex")
    .slice(0, 32);
}

export function touchVisit(ip: string, userAgent: string, now = new Date()): number {
  recordVisit(visitorKey(ip, userAgent), now);
  return countVisitsLast12h(now);
}
