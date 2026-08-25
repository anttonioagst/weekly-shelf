import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { orderIdFromSession, stripeObjectId } from "./stripe";
import type Stripe from "stripe";

describe("stripe ids", () => {
  it("reads a string id or an expanded object", () => {
    assert.equal(stripeObjectId("pi_1"), "pi_1");
    assert.equal(stripeObjectId({ id: "pi_2" }), "pi_2");
    assert.equal(stripeObjectId(null), null);
  });

  it("prefers the PaymentIntent as the order id", () => {
    const session = {
      id: "cs_1",
      payment_intent: "pi_9",
    } as Stripe.Checkout.Session;
    assert.equal(orderIdFromSession(session), "pi_9");
    assert.equal(
      orderIdFromSession({ id: "cs_1", payment_intent: null } as Stripe.Checkout.Session),
      "cs_1",
    );
  });
});
