"use client";
import { useState } from "react";

export default function Page() {
  const [uni, setUni] = useState({ name: "XYZ University", address: "City, State" });
  const [d, setD] = useState({ name: "Student Name", course: "B.Sc.", roll: "12345", year: "2021-2024", migratingTo: "ABC University", date: new Date().toISOString().slice(0,10) });

  return (
    <div>
      <h1>Migration Certificate</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <fieldset>
          <legend>University</legend>
          <input value={uni.name} onChange={e => setUni({ ...uni, name: e.target.value })} placeholder="University" style={{ width: "100%", marginBottom: 6 }} />
          <input value={uni.address} onChange={e => setUni({ ...uni, address: e.target.value })} placeholder="Address" style={{ width: "100%" }} />
        </fieldset>
        <fieldset>
          <legend>Student</legend>
          <input value={d.name} onChange={e => setD({ ...d, name: e.target.value })} placeholder="Student Name" style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={d.course} onChange={e => setD({ ...d, course: e.target.value })} placeholder="Course" />
            <input value={d.roll} onChange={e => setD({ ...d, roll: e.target.value })} placeholder="Roll No" />
            <input value={d.year} onChange={e => setD({ ...d, year: e.target.value })} placeholder="Year" />
          </div>
          <input value={d.migratingTo} onChange={e => setD({ ...d, migratingTo: e.target.value })} placeholder="Migrating To (University)" style={{ width: "100%", marginTop: 6 }} />
          <input type="date" value={d.date} onChange={e => setD({ ...d, date: e.target.value })} style={{ marginTop: 6 }} />
        </fieldset>
      </div>

      <div id="print-migration" style={{ border: "1px solid #ddd", borderRadius: 8, marginTop: 16 }}>
        <div style={{ padding: 16 }}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>{uni.name}</div>
          <div style={{ textAlign: "center", color: "#666" }}>{uni.address}</div>
          <h2 style={{ textAlign: "center" }}>Migration Certificate</h2>
          <p>This is to certify that <b>{d.name}</b>, Roll No <b>{d.roll}</b>, has pursued <b>{d.course}</b> during <b>{d.year}</b> at {uni.name}. He/She is permitted to migrate to <b>{d.migratingTo}</b>.</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <div>Date: {d.date}</div>
            <div>Registrar/Controller of Examinations</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => window.print()}>Print / Save PDF</button>
      </div>
      <style>{`@media print { body * { visibility: hidden; } #print-migration, #print-migration * { visibility: visible; } #print-migration { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}

