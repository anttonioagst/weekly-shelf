"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function PaidReturn() {
  const params = useSearchParams();
  const router = useRouter();
  const checkoutId = params.get("checkout_id");
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutId) return;
    let cancelled = false;
    (async () => {
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ checkoutId }),
      });
      const data = await response.json();
      if (cancelled) return;
      if (data.outcome === "hold_expired") {
        setNote(
          "Payment confirmed after the 30-minute hold. The shelf did not move.",
        );
        return;
      }
      if (data.applied) {
        router.replace("/");
        router.refresh();
        return;
      }
      setNote("Waiting for Polar to confirm the payment.");
    })();
    return () => {
      cancelled = true;
    };
  }, [checkoutId, router]);

  if (!checkoutId && !note) return null;
  return note ? <p className="meta">{note}</p> : null;
}
