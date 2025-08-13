"use client";
import { useState } from "react";

export default function Page() {
  const [inst, setInst] = useState({ name: "ABC Public School", address: "City, State" });
  const [data, setData] = useState({ name: "Student Name", class: "Class 10", academicYear: "2024-25", purpose: "For passport application", date: new Date().toISOString().slice(0,10) });

  return (
    <div>
      <h1>Bonafide Certificate</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <fieldset>
          <legend>Institution</legend>
          <input value={inst.name} onChange={e => setInst({ ...inst, name: e.target.value })} placeholder="Name" style={{ width: "100%", marginBottom: 6 }} />
          <input value={inst.address} onChange={e => setInst({ ...inst, address: e.target.value })} placeholder="Address" style={{ width: "100%" }} />
        </fieldset>
        <fieldset>
          <legend>Details</legend>
          <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Student Name" style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={data.class} onChange={e => setData({ ...data, class: e.target.value })} placeholder="Class" />
            <input value={data.academicYear} onChange={e => setData({ ...data, academicYear: e.target.value })} placeholder="Academic Year" />
          </div>
          <input value={data.purpose} onChange={e => setData({ ...data, purpose: e.target.value })} placeholder="Purpose" style={{ width: "100%", marginTop: 6 }} />
          <input type="date" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} style={{ marginTop: 6 }} />
        </fieldset>
      </div>

      <div id="print-bonafide" style={{ border: "1px solid #ddd", borderRadius: 8, marginTop: 16 }}>
        <div style={{ padding: 16 }}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>{inst.name}</div>
          <div style={{ textAlign: "center", color: "#666" }}>{inst.address}</div>
          <h2 style={{ textAlign: "center" }}>Bonafide Certificate</h2>
          <p>This is to certify that <b>{data.name}</b> is a bonafide student of this institution studying in <b>{data.class}</b> for the academic year <b>{data.academicYear}</b>.</p>
          <p>This certificate is issued on request of the student for the purpose of <b>{data.purpose}</b>.</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <div>Date: {data.date}</div>
            <div>Head of Institution</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => window.print()}>Print / Save PDF</button>
      </div>
      <style>{`@media print { body * { visibility: hidden; } #print-bonafide, #print-bonafide * { visibility: visible; } #print-bonafide { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}

