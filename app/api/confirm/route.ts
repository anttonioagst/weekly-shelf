import { applyPaidOrder } from "@/lib/apply";
import { polarClient } from "@/lib/polar";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    checkoutId?: string;
  } | null;
  const checkoutId = body?.checkoutId;
  if (!checkoutId) {
    return NextResponse.json({ error: "checkoutId required" }, { status: 400 });
  }

  const polar = polarClient();
  const checkout = await polar.checkouts.get({ id: checkoutId });
  if (checkout.status !== "succeeded") {
    return NextResponse.json({
      status: checkout.status,
      applied: false,
    });
  }

  const pages = await polar.orders.list({ checkoutId, limit: 1 });
  const order = pages.result.items[0];
  if (!order?.id) {
    return NextResponse.json({
      status: checkout.status,
      applied: false,
      outcome: "pending_order",
    });
  }

  const outcome = await applyPaidOrder({
    checkoutId,
    orderId: order.id,
  });

  return NextResponse.json({
    status: checkout.status,
    applied: outcome === "applied" || outcome === "already",
    outcome,
  });
}
