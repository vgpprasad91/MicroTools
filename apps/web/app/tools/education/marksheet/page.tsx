"use client";
import { useMemo, useState } from "react";

type Row = { subject: string; max: number; obtained: number };

function gradeFromPercent(p: number) {
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B+";
  if (p >= 60) return "B";
  if (p >= 50) return "C";
  if (p >= 40) return "D";
  return "F";
}

export default function Page() {
  const [inst, setInst] = useState({ name: "ABC Public School", exam: "Annual Examination", year: "2024-25" });
  const [student, setStudent] = useState({ name: "Student Name", class: "Class 10", roll: "23" });
  const [rows, setRows] = useState<Row[]>([
    { subject: "English", max: 100, obtained: 85 },
    { subject: "Maths", max: 100, obtained: 78 },
    { subject: "Science", max: 100, obtained: 82 },
  ]);

  const totals = useMemo(() => rows.reduce((a, r) => ({ max: a.max + (Number(r.max)||0), obtained: a.obtained + (Number(r.obtained)||0) }), { max:0, obtained:0 }), [rows]);
  const percent = totals.max ? (totals.obtained / totals.max) * 100 : 0;
  const grade = gradeFromPercent(percent);

  return (
    <div>
      <h1>Marksheet Generator</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <fieldset>
          <legend>Institution</legend>
          <input value={inst.name} onChange={e => setInst({ ...inst, name: e.target.value })} placeholder="Name" style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={inst.exam} onChange={e => setInst({ ...inst, exam: e.target.value })} placeholder="Exam" />
            <input value={inst.year} onChange={e => setInst({ ...inst, year: e.target.value })} placeholder="Year" />
          </div>
        </fieldset>
        <fieldset>
          <legend>Student</legend>
          <input value={student.name} onChange={e => setStudent({ ...student, name: e.target.value })} placeholder="Student Name" style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={student.class} onChange={e => setStudent({ ...student, class: e.target.value })} placeholder="Class" />
            <input value={student.roll} onChange={e => setStudent({ ...student, roll: e.target.value })} placeholder="Roll" />
          </div>
        </fieldset>
      </div>

      <h2 style={{ marginTop: 12 }}>Subjects</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>#</th>
            <th style={th}>Subject</th>
            <th style={th}>Max</th>
            <th style={th}>Obtained</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i}>
              <td style={tdCenter}>{i+1}</td>
              <td style={td}><input value={r.subject} onChange={e => setRows(xs => xs.map((x,j)=> j===i? { ...x, subject: e.target.value }: x))} style={{ width: "100%" }} /></td>
              <td style={td}><input type="number" value={r.max} onChange={e => setRows(xs => xs.map((x,j)=> j===i? { ...x, max: +e.target.value }: x))} /></td>
              <td style={td}><input type="number" value={r.obtained} onChange={e => setRows(xs => xs.map((x,j)=> j===i? { ...x, obtained: +e.target.value }: x))} /></td>
              <td style={tdCenter}><button onClick={() => setRows(xs => xs.filter((_,j)=>j!==i))}>✕</button></td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} style={{ padding: 6 }}>
              <button onClick={() => setRows(xs => [...xs, { subject: "New Subject", max: 100, obtained: 0 }])}>+ Add Subject</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div id="print-marksheet" style={{ border: "1px solid #ddd", borderRadius: 8, marginTop: 16 }}>
        <div style={{ padding: 16 }}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>{inst.name}</div>
          <div style={{ textAlign: "center" }}>{inst.exam} ({inst.year})</div>
          <div style={{ marginTop: 8 }}><b>Student:</b> {student.name} | <b>Class:</b> {student.class} | <b>Roll:</b> {student.roll}</div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
            <thead>
              <tr>
                <th style={thPrint}>#</th>
                <th style={thPrint}>Subject</th>
                <th style={thPrintRight}>Max</th>
                <th style={thPrintRight}>Obtained</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i) => (
                <tr key={i}>
                  <td style={tdPrintCenter}>{i+1}</td>
                  <td style={tdPrint}>{r.subject}</td>
                  <td style={tdPrintRight}>{r.max}</td>
                  <td style={tdPrintRight}>{r.obtained}</td>
                </tr>
              ))}
              <tr>
                <td style={tdPrint}></td>
                <td style={{ ...tdPrint, fontWeight: 700 }}>Total</td>
                <td style={{ ...tdPrintRight, fontWeight: 700 }}>{totals.max}</td>
                <td style={{ ...tdPrintRight, fontWeight: 700 }}>{totals.obtained}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 10 }}><b>Percentage:</b> {percent.toFixed(2)}% | <b>Grade:</b> {grade}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <div>Class Teacher</div>
            <div>Principal</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => window.print()}>Print / Save PDF</button>
      </div>
      <style>{`@media print { body * { visibility: hidden; } #print-marksheet, #print-marksheet * { visibility: visible; } #print-marksheet { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #ddd", padding: 6, background: "#fafafa" };
const td: React.CSSProperties = { borderBottom: "1px solid #f0f0f0", padding: 6 };
const tdCenter: React.CSSProperties = { ...td, textAlign: "center" };
const thPrint: React.CSSProperties = { ...th, background: "#f7f7f7" };
const thPrintRight: React.CSSProperties = { ...thPrint, textAlign: "right" };
const tdPrint: React.CSSProperties = { ...td };
const tdPrintCenter: React.CSSProperties = { ...td, textAlign: "center" };
const tdPrintRight: React.CSSProperties = { ...td, textAlign: "right" };

