import { withFoundingListing } from "./founding";
import { recentActivity, shelfRows, type WeekBoard } from "./fulfill";
import { loadBoard, saveBoard } from "./store";
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
  const loaded = loadBoard(weekId);
  const board = withFoundingListing(loaded, now);
  if (board !== loaded) saveBoard(board);
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
