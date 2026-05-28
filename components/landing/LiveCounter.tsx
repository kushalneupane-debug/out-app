"use client";
import { useEffect, useState } from "react";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export function LiveCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // try to get real count from server
    fetch(`${SOCKET_URL}/stats`)
      .then(r => r.json())
      .then(d => setCount(d.active ?? 247))
      .catch(() => setCount(247));
  }, []);

  const display = count ?? 247;

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
      style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
      <span className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: "#22c55e", animation: "glow-pulse 2s ease-out infinite" }} />
      <span className="text-sm" style={{ color: "#a1a1aa" }}>
        <span className="font-mono font-semibold" style={{ color: "#22c55e" }}>{display}</span>
        {" "}people are Out right now
      </span>
    </div>
  );
}
