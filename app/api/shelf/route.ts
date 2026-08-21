import { currentWeekSnapshot } from "@/lib/shelf";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snap = currentWeekSnapshot();
  return NextResponse.json({
    weekId: snap.weekId,
    moveCount: snap.moveCount,
    priceDollars: snap.priceDollars,
    nextMondayIso: snap.nextMondayIso,
    rows: snap.rows,
  });
}
