"use client";

import { useEffect, useState } from "react";

function format(ms: number): string {
  if (ms <= 0) return "resetting…";
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (days > 0) return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function Countdown({ nextMondayIso }: { nextMondayIso: string }) {
  const target = new Date(nextMondayIso).getTime();
  const [label, setLabel] = useState("…");

  useEffect(() => {
    const tick = () => setLabel(format(target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <p className="countdown">
      Empties in {label}
    </p>
  );
}
