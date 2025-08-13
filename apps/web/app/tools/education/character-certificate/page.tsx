"use client";
import { useState } from "react";

export default function Page() {
  const [inst, setInst] = useState({ name: "ABC Public School", address: "City, State" });
  const [d, setD] = useState({ name: "Student Name", father: "Father Name", period: "2021-2024", character: "Good", date: new Date().toISOString().slice(0,10) });

  return (
    <div>
      <h1>Character Certificate</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <fieldset>
          <legend>Institution</legend>
          <input value={inst.name} onChange={e => setInst({ ...inst, name: e.target.value })} placeholder="Institution" style={{ width: "100%", marginBottom: 6 }} />
          <input value={inst.address} onChange={e => setInst({ ...inst, address: e.target.value })} placeholder="Address" style={{ width: "100%" }} />
        </fieldset>
        <fieldset>
          <legend>Details</legend>
          <input value={d.name} onChange={e => setD({ ...d, name: e.target.value })} placeholder="Student Name" style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={d.father} onChange={e => setD({ ...d, father: e.target.value })} placeholder="Father's Name" />
            <input value={d.period} onChange={e => setD({ ...d, period: e.target.value })} placeholder="Period (e.g., 2021-2024)" />
          </div>
          <input value={d.character} onChange={e => setD({ ...d, character: e.target.value })} placeholder="Character (e.g., Good)" style={{ marginTop: 6 }} />
          <input type="date" value={d.date} onChange={e => setD({ ...d, date: e.target.value })} style={{ marginLeft: 8 }} />
        </fieldset>
      </div>

      <div id="print-character" style={{ border: "1px solid #ddd", borderRadius: 8, marginTop: 16 }}>
        <div style={{ padding: 16 }}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>{inst.name}</div>
          <div style={{ textAlign: "center", color: "#666" }}>{inst.address}</div>
          <h2 style={{ textAlign: "center" }}>Character Certificate</h2>
          <p>This is to certify that <b>{d.name}</b>, son/daughter of <b>{d.father}</b>, was a student of this institution during the period <b>{d.period}</b>. His/Her character and conduct during the period of study are found to be <b>{d.character}</b>.</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <div>Date: {d.date}</div>
            <div>Head of Institution</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => window.print()}>Print / Save PDF</button>
      </div>
      <style>{`@media print { body * { visibility: hidden; } #print-character, #print-character * { visibility: visible; } #print-character { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}

