"use client";
import { useMemo, useState } from "react";

type Row = { course: string; credits: number; gradePoint: number };

export default function Page() {
  const [rows, setRows] = useState<Row[]>([
    { course: "Subject 1", credits: 4, gradePoint: 9 },
    { course: "Subject 2", credits: 3, gradePoint: 8 },
  ]);

  const totals = useMemo(() => rows.reduce((a, r) => ({ credits: a.credits + (Number(r.credits)||0), points: a.points + (Number(r.credits||0) * Number(r.gradePoint||0)) }), { credits:0, points:0 }), [rows]);
  const cgpa = totals.credits ? totals.points / totals.credits : 0;

  return (
    <div>
      <h1>CGPA/SGPA Calculator</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>#</th>
            <th style={th}>Course</th>
            <th style={th}>Credits</th>
            <th style={th}>Grade Point</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={tdCenter}>{i+1}</td>
              <td style={td}><input value={r.course} onChange={e => setRows(xs => xs.map((x,j)=> j===i? { ...x, course: e.target.value }: x))} style={{ width: "100%" }} /></td>
              <td style={td}><input type="number" value={r.credits} onChange={e => setRows(xs => xs.map((x,j)=> j===i? { ...x, credits: +e.target.value }: x))} /></td>
              <td style={td}><input type="number" step="0.1" min={0} max={10} value={r.gradePoint} onChange={e => setRows(xs => xs.map((x,j)=> j===i? { ...x, gradePoint: +e.target.value }: x))} /></td>
              <td style={tdCenter}><button onClick={() => setRows(xs => xs.filter((_,j)=> j!==i))}>✕</button></td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} style={{ padding: 6 }}>
              <button onClick={() => setRows(xs => [...xs, { course: "New", credits: 0, gradePoint: 0 }])}>+ Add Row</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}><b>Total Credits:</b> {totals.credits} | <b>Weighted Points:</b> {totals.points.toFixed(2)} | <b>CGPA:</b> {cgpa.toFixed(2)}</div>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #ddd", padding: 6, background: "#fafafa" };
const td: React.CSSProperties = { borderBottom: "1px solid #f0f0f0", padding: 6 };
const tdCenter: React.CSSProperties = { ...td, textAlign: "center" };

