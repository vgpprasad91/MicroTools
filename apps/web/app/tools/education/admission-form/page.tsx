"use client";
import { useState } from "react";

export default function Page() {
  const [inst, setInst] = useState({ name: "ABC Public School" });
  const [s, setS] = useState({ name: "Student Name", dob: "2010-01-01", gender: "Male", blood: "", address: "", father: "Father Name", mother: "Mother Name", phone: "", email: "", classApplied: "Class 1", date: new Date().toISOString().slice(0,10) });

  return (
    <div>
      <h1>Admission Form Template</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <fieldset>
          <legend>Institution</legend>
          <input value={inst.name} onChange={e => setInst({ name: e.target.value })} placeholder="Institute Name" style={{ width: "100%" }} />
        </fieldset>
        <fieldset>
          <legend>Applicant</legend>
          <input value={s.name} onChange={e => setS({ ...s, name: e.target.value })} placeholder="Student Name" style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input type="date" value={s.dob} onChange={e => setS({ ...s, dob: e.target.value })} />
            <input value={s.gender} onChange={e => setS({ ...s, gender: e.target.value })} placeholder="Gender" />
            <input value={s.blood} onChange={e => setS({ ...s, blood: e.target.value })} placeholder="Blood Group" />
          </div>
          <textarea value={s.address} onChange={e => setS({ ...s, address: e.target.value })} placeholder="Address" rows={3} style={{ width: "100%", marginTop: 6 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input value={s.father} onChange={e => setS({ ...s, father: e.target.value })} placeholder="Father's Name" />
            <input value={s.mother} onChange={e => setS({ ...s, mother: e.target.value })} placeholder="Mother's Name" />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input value={s.phone} onChange={e => setS({ ...s, phone: e.target.value })} placeholder="Phone" />
            <input value={s.email} onChange={e => setS({ ...s, email: e.target.value })} placeholder="Email" />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input value={s.classApplied} onChange={e => setS({ ...s, classApplied: e.target.value })} placeholder="Class Applied For" />
            <input type="date" value={s.date} onChange={e => setS({ ...s, date: e.target.value })} />
          </div>
        </fieldset>
      </div>

      <div id="print-admission" style={{ border: "1px solid #ddd", borderRadius: 8, marginTop: 16 }}>
        <div style={{ padding: 16 }}>
          <h2 style={{ textAlign: "center" }}>{inst.name} - Admission Form</h2>
          <div><b>Student Name:</b> {s.name}</div>
          <div><b>Date of Birth:</b> {s.dob} | <b>Gender:</b> {s.gender} | <b>Blood Group:</b> {s.blood || "-"}</div>
          <div><b>Address:</b> {s.address || "-"}</div>
          <div><b>Father:</b> {s.father} | <b>Mother:</b> {s.mother}</div>
          <div><b>Phone:</b> {s.phone} | <b>Email:</b> {s.email}</div>
          <div><b>Class Applied:</b> {s.classApplied} | <b>Date:</b> {s.date}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
            <div>Applicant Signature</div>
            <div>Authorised Signatory</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => window.print()}>Print / Save PDF</button>
      </div>
      <style>{`@media print { body * { visibility: hidden; } #print-admission, #print-admission * { visibility: visible; } #print-admission { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}

