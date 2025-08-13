"use client";
import React, { useEffect, useMemo, useState } from "react";

function getAccess() {
  try {
    const raw = localStorage.getItem("ms_access");
    if (!raw) return false;
    const obj = JSON.parse(raw);
    return typeof obj?.expiry === "number" && obj.expiry > Date.now();
  } catch {
    return false;
  }
}

function setAccess(hours: number) {
  const expiry = Date.now() + hours * 60 * 60 * 1000;
  localStorage.setItem("ms_access", JSON.stringify({ expiry }));
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const [has, setHas] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setHas(getAccess());
    setChecked(true);
  }, []);

  const Gate = useMemo(() => (
    <div style={{ border: "1px solid #eee", padding: 16, borderRadius: 8 }}>
      <h2>Subscribe to unlock tools</h2>
      <p style={{ color: "#666" }}>This is a demo paywall. In production, connect Stripe/Razorpay and set access after checkout.</p>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={() => { setAccess(24); setHas(true); }}>Unlock 24h Demo</button>
        <button onClick={() => { setAccess(24 * 30); setHas(true); }}>I have access (simulate)</button>
      </div>
      <p style={{ marginTop: 10, color: "#888" }}>Tip: replace this with real auth later; no data stored server-side.</p>
    </div>
  ), []);

  if (!checked) return null;
  return has ? <>{children}</> : Gate;
}

