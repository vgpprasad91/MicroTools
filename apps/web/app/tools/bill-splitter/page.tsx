"use client";
import { useState } from "react";

type Person = { name: string; paid: number };
export default function Page() {
  const [people, setPeople] = useState<Person[]>([{ name: "A", paid: 0 }, { name: "B", paid: 0 }]);
  const total = people.reduce((a, p) => a + (Number(p.paid) || 0), 0);
  const share = people.length ? total / people.length : 0;
  const settlements = people.map(p => ({ name: p.name, delta: +(Number(p.paid) - share).toFixed(2) }));

  return (
    <div>
      <h1>Bill Splitter</h1>
      {people.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <input value={p.name} onChange={e => setPeople(ps => ps.map((x, j) => j===i ? { ...x, name: e.target.value } : x))} />
          <input type="number" value={p.paid} onChange={e => setPeople(ps => ps.map((x, j) => j===i ? { ...x, paid: +e.target.value } : x))} />
          <button onClick={() => setPeople(ps => ps.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button onClick={() => setPeople(ps => [...ps, { name: "New", paid: 0 }])}>Add person</button>

      <div style={{ marginTop: 12 }}>
        <strong>Total:</strong> ₹{total.toFixed(2)} | <strong>Per head:</strong> ₹{share.toFixed(2)}
      </div>

      <div id="print-area" style={{ marginTop: 12, border: "1px solid #eee", padding: 12 }}>
        <h2>Settlement Summary</h2>
        {settlements.map(s => (
          <div key={s.name}>
            {s.name}: {s.delta === 0 ? "settled" : s.delta > 0 ? `gets ₹${s.delta}` : `pays ₹${(-s.delta).toFixed(2)}`}
          </div>
        ))}
      </div>

      <button onClick={() => window.print()} style={{ marginTop: 8 }}>Print / Save PDF</button>
      <style>{`@media print { body * { visibility: hidden; } #print-area, #print-area * { visibility: visible; } #print-area { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}

