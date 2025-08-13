"use client";
import { useState } from "react";

export default function Page() {
  const [school, setSchool] = useState({ name: "ABC Public School", address: "City, State" });
  const [student, setStudent] = useState({ name: "Student Name", father: "Father Name", mother: "Mother Name", dob: "2008-06-01", nationality: "Indian", caste: "General", admissionDate: "2020-06-10", leavingClass: "Class 10", conduct: "Good", issueDate: new Date().toISOString().slice(0,10), reason: "At parent request" });

  return (
    <div>
      <h1>Transfer Certificate (TC) Generator</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <fieldset>
          <legend>Institution</legend>
          <input value={school.name} onChange={e => setSchool({ ...school, name: e.target.value })} placeholder="School Name" style={{ width: "100%", marginBottom: 6 }} />
          <input value={school.address} onChange={e => setSchool({ ...school, address: e.target.value })} placeholder="Address" style={{ width: "100%" }} />
        </fieldset>
        <fieldset>
          <legend>Student</legend>
          <input value={student.name} onChange={e => setStudent({ ...student, name: e.target.value })} placeholder="Student Name" style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={student.father} onChange={e => setStudent({ ...student, father: e.target.value })} placeholder="Father's Name" />
            <input value={student.mother} onChange={e => setStudent({ ...student, mother: e.target.value })} placeholder="Mother's Name" />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input type="date" value={student.dob} onChange={e => setStudent({ ...student, dob: e.target.value })} />
            <input value={student.nationality} onChange={e => setStudent({ ...student, nationality: e.target.value })} placeholder="Nationality" />
            <input value={student.caste} onChange={e => setStudent({ ...student, caste: e.target.value })} placeholder="Caste" />
          </div>
        </fieldset>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input type="date" value={student.admissionDate} onChange={e => setStudent({ ...student, admissionDate: e.target.value })} />
        <input value={student.leavingClass} onChange={e => setStudent({ ...student, leavingClass: e.target.value })} placeholder="Class Leaving" />
        <input value={student.conduct} onChange={e => setStudent({ ...student, conduct: e.target.value })} placeholder="Conduct" />
        <input type="date" value={student.issueDate} onChange={e => setStudent({ ...student, issueDate: e.target.value })} />
        <input value={student.reason} onChange={e => setStudent({ ...student, reason: e.target.value })} placeholder="Reason for Leaving" />
      </div>

      <div id="print-tc" style={{ border: "1px solid #ddd", borderRadius: 8, marginTop: 16 }}>
        <div style={{ padding: 16 }}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>{school.name}</div>
          <div style={{ textAlign: "center", color: "#666" }}>{school.address}</div>
          <h2 style={{ textAlign: "center" }}>Transfer Certificate</h2>
          <p>This is to certify that <b>{student.name}</b>, son/daughter of <b>{student.father}</b> and <b>{student.mother}</b>, born on <b>{student.dob}</b> (in words), is/was a student of this institution.</p>
          <p>He/She was admitted on <b>{student.admissionDate}</b> and left the school from class <b>{student.leavingClass}</b>. Conduct during the period of study is reported as <b>{student.conduct}</b>.</p>
          <p>Reason for leaving: <b>{student.reason}</b>.</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <div>Date of Issue: {student.issueDate}</div>
            <div>Principal/Headmaster</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => window.print()}>Print / Save PDF</button>
      </div>
      <style>{`@media print { body * { visibility: hidden; } #print-tc, #print-tc * { visibility: visible; } #print-tc { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}

