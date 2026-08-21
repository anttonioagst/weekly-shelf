import { fulfillOrder, refundOrder } from "./fulfill";
import { saveBoard, withLockedWeek } from "./store";
import { weekIdAt } from "./week";

export async function applyPaidOrder(opts: {
  checkoutId: string;
  orderId: string;
  now?: Date;
}) {
  const now = opts.now ?? new Date();
  const weekId = weekIdAt(now);

  return withLockedWeek(weekId, (board) => {
    const { board: next, result } = fulfillOrder(board, {
      orderId: opts.orderId,
      checkoutId: opts.checkoutId,
      paidAt: now,
      now,
    });
    if (result.reason === "applied" || result.reason === "hold_expired") {
      saveBoard(next);
    }
    return result.reason;
  });
}

export async function applyRefund(orderId: string, weekId: string) {
  await withLockedWeek(weekId, (board) => {
    saveBoard(refundOrder(board, orderId));
  });
}
