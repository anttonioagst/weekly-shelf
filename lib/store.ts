import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { emptyBoard, type WeekBoard } from "./fulfill";

let db: DatabaseSync | null = null;

function dataDir(): string {
  if (process.env.SHELF_DATA_DIR) return process.env.SHELF_DATA_DIR;
  if (process.env.VERCEL) return "/tmp";
  return path.join(process.cwd(), "data");
}

function dbPath(): string {
  if (process.env.SHELF_DB) return process.env.SHELF_DB;
  return path.join(dataDir(), "shelf.sqlite");
}

function getDb(): DatabaseSync {
  if (db) return db;
  const file = dbPath();
  mkdirSync(path.dirname(file), { recursive: true });
  db = new DatabaseSync(file);
  db.exec(`
    CREATE TABLE IF NOT EXISTS weeks (
      week_id TEXT PRIMARY KEY,
      board_json TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS visits (
      visitor_key TEXT NOT NULL,
      seen_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS visitors (
      visitor_key TEXT PRIMARY KEY,
      first_seen TEXT NOT NULL,
      last_seen TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS visitors_last_seen ON visitors(last_seen);
  `);
  return db;
}

export const VISIT_WINDOW_MS = 12 * 60 * 60 * 1000;
export const ONLINE_WINDOW_MS = 5 * 60 * 1000;

export function recordVisit(visitorKey: string, now = new Date()): void {
  const iso = now.toISOString();
  getDb()
    .prepare(
      `INSERT INTO visitors (visitor_key, first_seen, last_seen)
       VALUES (?, ?, ?)
       ON CONFLICT(visitor_key) DO UPDATE SET last_seen = excluded.last_seen`,
    )
    .run(visitorKey, iso, iso);
}

function countSince(column: "last_seen", sinceIso: string): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) AS n FROM visitors WHERE ${column} >= ?`)
    .get(sinceIso) as { n: number };
  return row.n;
}

export function countOnline(now = new Date()): number {
  return countSince(
    "last_seen",
    new Date(now.getTime() - ONLINE_WINDOW_MS).toISOString(),
  );
}

export function countVisitsLast12h(now = new Date()): number {
  return countSince(
    "last_seen",
    new Date(now.getTime() - VISIT_WINDOW_MS).toISOString(),
  );
}

export function countVisitorsAll(): number {
  const row = getDb()
    .prepare("SELECT COUNT(*) AS n FROM visitors")
    .get() as { n: number };
  return row.n;
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
