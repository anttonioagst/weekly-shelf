import { recentActivity, shelfRows, type WeekBoard } from "./fulfill";
import { loadBoard } from "./store";
import { nextMondayUtc, priceCents, priceDollars, weekIdAt } from "./week";

export function currentWeekSnapshot(now = new Date()): {
  weekId: string;
  moveCount: number;
  priceDollars: number;
  priceCents: number;
  nextMondayIso: string;
  rows: ReturnType<typeof shelfRows>;
  activity: ReturnType<typeof recentActivity>;
  board: WeekBoard;
} {
  const weekId = weekIdAt(now);
  const board = loadBoard(weekId);
  return {
    weekId,
    moveCount: board.moveCount,
    priceDollars: priceDollars(board.moveCount),
    priceCents: priceCents(board.moveCount),
    nextMondayIso: nextMondayUtc(now).toISOString(),
    rows: shelfRows(board),
    activity: recentActivity(board),
    board,
  };
}
