import { applyPaidOrder, applyRefund } from "@/lib/apply";
import {
  isSessionPaid,
  orderIdFromSession,
  stripeClient,
  stripeObjectId,
  stripeWebhookSecret,
} from "@/lib/stripe";
import { weekIdAt } from "@/lib/week";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

async function onPaidSession(session: Stripe.Checkout.Session) {
  if (!isSessionPaid(session)) return;
  const orderId = orderIdFromSession(session);
  if (!orderId) return;
  const outcome = await applyPaidOrder({
    checkoutId: session.id,
    orderId,
  });
  if (outcome === "hold_expired") {
    console.info("stripe.checkout.paid ignored: hold expired", {
      checkoutId: session.id,
      orderId,
    });
  }
}

async function onRefunded(stripe: ReturnType<typeof stripeClient>, charge: Stripe.Charge) {
  const orderId = stripeObjectId(charge.payment_intent);
  if (!orderId) return;
  let weekId: string | undefined = charge.metadata?.week_id;
  if (!weekId) {
    try {
      const intent = await stripe.paymentIntents.retrieve(orderId);
      weekId = intent.metadata?.week_id;
    } catch {
      weekId = undefined;
    }
  }
  await applyRefund(orderId, weekId || weekIdAt(new Date()));
}

export async function POST(request: Request) {
  const stripe = stripeClient();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      stripeWebhookSecret(),
    );
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await onPaidSession(event.data.object);
      break;
    case "charge.refunded":
      await onRefunded(stripe, event.data.object);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
