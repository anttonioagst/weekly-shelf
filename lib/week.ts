/** Monday 00:00 UTC week key, e.g. 2026-08-17 */
export function mondayUtc(now: Date): Date {
  const d = new Date(now.getTime());
  const day = d.getUTCDay();
  const daysFromMonday = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - daysFromMonday);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function weekIdAt(now: Date): string {
  return mondayUtc(now).toISOString().slice(0, 10);
}

export function nextMondayUtc(now: Date): Date {
  return new Date(mondayUtc(now).getTime() + 7 * 24 * 60 * 60 * 1000);
}

/** Displayed price in whole USD. N = completed (non-decrementing) moves this week. */
export function priceDollars(moveCount: number): number {
  if (moveCount < 0) {
    throw new Error("moveCount cannot be negative");
  }
  return 1 + moveCount;
}

export function priceCents(moveCount: number): number {
  return priceDollars(moveCount) * 100;
}

export function isHoldValid(holdExpiresAt: Date, now: Date): boolean {
  return now.getTime() <= holdExpiresAt.getTime();
}
