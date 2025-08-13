"use client";
import { useState } from "react";

export default function Page() {
  const [school, setSchool] = useState({ name: "ABC Public School", address: "City, State" });
  const [data, setData] = useState({ name: "Student Name", father: "Father Name", dob: "2008-06-01", classLeaving: "Class 10", lastAttendance: "2024-03-15", conduct: "Good", reason: "At parent request", date: new Date().toISOString().slice(0,10) });

  return (
    <div>
      <h1>Leaving Certificate</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <fieldset>
          <legend>Institution</legend>
          <input value={school.name} onChange={e => setSchool({ ...school, name: e.target.value })} placeholder="School Name" style={{ width: "100%", marginBottom: 6 }} />
          <input value={school.address} onChange={e => setSchool({ ...school, address: e.target.value })} placeholder="Address" style={{ width: "100%" }} />
        </fieldset>
        <fieldset>
          <legend>Student</legend>
          <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Student Name" style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={data.father} onChange={e => setData({ ...data, father: e.target.value })} placeholder="Father's Name" />
            <input type="date" value={data.dob} onChange={e => setData({ ...data, dob: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input value={data.classLeaving} onChange={e => setData({ ...data, classLeaving: e.target.value })} placeholder="Class Leaving" />
            <input type="date" value={data.lastAttendance} onChange={e => setData({ ...data, lastAttendance: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input value={data.conduct} onChange={e => setData({ ...data, conduct: e.target.value })} placeholder="Conduct" />
            <input value={data.reason} onChange={e => setData({ ...data, reason: e.target.value })} placeholder="Reason for Leaving" />
          </div>
        </fieldset>
      </div>

      <div id="print-leaving" style={{ border: "1px solid #ddd", borderRadius: 8, marginTop: 16 }}>
        <div style={{ padding: 16 }}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>{school.name}</div>
          <div style={{ textAlign: "center", color: "#666" }}>{school.address}</div>
          <h2 style={{ textAlign: "center" }}>School Leaving Certificate</h2>
          <p>This is to certify that <b>{data.name}</b>, son/daughter of <b>{data.father}</b>, born on <b>{data.dob}</b>, was a student of this school. He/She last attended the school on <b>{data.lastAttendance}</b> and left from <b>{data.classLeaving}</b>.</p>
          <p>His/Her conduct is reported as <b>{data.conduct}</b>. Reason for leaving: <b>{data.reason}</b>.</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <div>Date: {data.date}</div>
            <div>Head of Institution</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => window.print()}>Print / Save PDF</button>
      </div>
      <style>{`@media print { body * { visibility: hidden; } #print-leaving, #print-leaving * { visibility: visible; } #print-leaving { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}

