import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { emptyBoard, type WeekBoard } from "./fulfill";

let db: DatabaseSync | null = null;

function dataDir(): string {
  return process.env.SHELF_DATA_DIR ?? path.join(process.cwd(), "data");
}

function getDb(): DatabaseSync {
  if (db) return db;
  mkdirSync(dataDir(), { recursive: true });
  db = new DatabaseSync(path.join(dataDir(), "shelf.sqlite"));
  db.exec(`
    CREATE TABLE IF NOT EXISTS weeks (
      week_id TEXT PRIMARY KEY,
      board_json TEXT NOT NULL
    );
  `);
  return db;
}

export function loadBoard(weekId: string): WeekBoard {
  const row = getDb()
    .prepare("SELECT board_json FROM weeks WHERE week_id = ?")
    .get(weekId) as { board_json: string } | undefined;
  if (!row) return emptyBoard(weekId);
  const parsed = JSON.parse(row.board_json) as WeekBoard;
  if (parsed.weekId !== weekId) return emptyBoard(weekId);
  return parsed;
}

export function saveBoard(board: WeekBoard): void {
  getDb()
    .prepare(
      `INSERT INTO weeks (week_id, board_json) VALUES (?, ?)
       ON CONFLICT(week_id) DO UPDATE SET board_json = excluded.board_json`,
    )
    .run(board.weekId, JSON.stringify(board));
}

const locks = new Map<string, Promise<void>>();

export async function withLockedWeek<T>(
  weekId: string,
  fn: (board: WeekBoard) => T | Promise<T>,
): Promise<T> {
  const previous = locks.get(weekId) ?? Promise.resolve();
  let release: () => void = () => undefined;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  locks.set(weekId, previous.then(() => current));
  await previous;
  try {
    return await fn(loadBoard(weekId));
  } finally {
    release();
    if (locks.get(weekId) === current) locks.delete(weekId);
  }
}

export function resetStoreForTests(): void {
  db?.close();
  db = null;
}
