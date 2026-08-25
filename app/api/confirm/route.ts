import { applyPaidOrder } from "@/lib/apply";
import { isSessionPaid, orderIdFromSession, stripeClient } from "@/lib/stripe";
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

  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.retrieve(checkoutId);
  if (!isSessionPaid(session)) {
    return NextResponse.json({
      status: session.payment_status,
      applied: false,
    });
  }

  const orderId = orderIdFromSession(session);
  if (!orderId) {
    return NextResponse.json({
      status: session.payment_status,
      applied: false,
      outcome: "pending_order",
    });
  }

  const outcome = await applyPaidOrder({
    checkoutId: session.id,
    orderId,
  });

  return NextResponse.json({
    status: session.payment_status,
    applied: outcome === "applied" || outcome === "already",
    outcome,
  });
}
