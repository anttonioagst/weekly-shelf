import { applyPaidOrder, applyRefund } from "@/lib/apply";
import { weekIdAt } from "@/lib/week";
import { Webhooks } from "@polar-sh/nextjs";

export const runtime = "nodejs";

function orderIds(order: {
  id: string;
  checkoutId: string | null;
}): { orderId: string; checkoutId: string | undefined } {
  return {
    orderId: order.id,
    checkoutId: order.checkoutId ?? undefined,
  };
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET ?? "",
  onOrderPaid: async (payload) => {
    const { orderId, checkoutId } = orderIds(payload.data);
    if (!orderId || !checkoutId) return;
    const outcome = await applyPaidOrder({ checkoutId, orderId });
    if (outcome === "hold_expired") {
      console.info("polar.order.paid ignored: hold expired", { orderId });
    }
  },
  onOrderRefunded: async (payload) => {
    const { orderId } = orderIds(payload.data);
    if (!orderId) return;
    const metadata = (
      payload.data as { metadata?: { week_id?: string } }
    ).metadata;
    await applyRefund(orderId, metadata?.week_id ?? weekIdAt(new Date()));
  },
});
